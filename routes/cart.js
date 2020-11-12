const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')
function mapCart(cart) {
    return cart.items.map( c => {
        return {
            ...c.courseId._doc, count: c.count
        }
    })
}
function computedPrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    },0)

}
router.post('/add', auth, async(req,res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCard(course)
    res.redirect('/cart')
})
router.get('/', auth, async(req,res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCart(user.cart)
    const price = computedPrice(courses)
    res.render('cart', {
        courses,
        price: price
    })
})

router.delete('/remove/:id',auth, async(req,res)=> {
    
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCart(user.cart)
    const cart = {
        courses,
        price: computedPrice(courses)
    }
    res.json(cart)
})








module.exports = router