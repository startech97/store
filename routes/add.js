const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')
router.get('/', auth, (req,res) => {
    res.render('add',{
        title: 'Добавить курсы',
        isAdd: true
    })
})

router.post('/', auth, async (req,res) => {
    try{
        console.log(req.user)
        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user
        })
        await course.save()
        res.redirect('/courses')
    }catch(e) {
        console.log(e)
    }
})

module.exports = router