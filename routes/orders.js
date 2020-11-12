const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/',auth, async (req,res) => {
    try{
        const orders = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')

        res.render('orders', {
            isOrders: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
        
    }catch(e) {
        console.log(e)
    }
    
    
})
router.post('/', auth, async (req,res) => {
    console.log('ddd')
        const user = await req.user.populate('cart.items.courseId').execPopulate()
        
        const courses = user.cart.items.map(c => ({
        count: c.count,
        course: {...c.courseId._doc}
        }))
        
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })
        
        await order.save()
        await req.user.clearCart()
        res.redirect('/orders')

})

module.exports = router