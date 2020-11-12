const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')
router.get('/', async (req,res) => {
    const courses = await Course.find()
    res.render('courses',{
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async(req,res) => {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            title: `Курс ${course.title}`,
            course
        })

})

router.get('/:id/edit', auth,async (req,res) => {
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        course
    })
})

router.post('/edit', auth, async (req,res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses')
})

router.post('/remove',auth, async (req,res) => {
    await Course.deleteOne({
        _id: req.body.id
    })
    res.redirect('/courses')
})

module.exports = router