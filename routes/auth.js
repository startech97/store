const {Router} = require('express')
const router = Router()
const User =require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', (req,res) => {
    res.render('auth/login', {
        title: 'Войти',
        isLogin: true,
        error: req.flash('error'),
        loginError: req.flash('loginError')
    })
})

router.post('/login', async (req,res) =>{
    try{
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            
            const areSame = await bcrypt.compare(password, candidate.password)
            if(areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((err) => {
                    if(err) {
                        throw err
                    }
                    res.redirect('/')
                })
            }else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        }else{
            req.flash('loginError', 'Такого пользователя не сущетсвует')
            res.redirect('/auth/login#login')
        }
    }catch(e) {
        console.log(e)
    }
    
    
})

router.get('/logout', async (req,res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/register', async (req,res) => {
    try{
        const {email,password, name, repeat} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            req.flash('error', 'Пользователь с таким email уже существует ')
            res.redirect('/auth/login#login')
        }else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    }catch(e){
        console.log(e)
    }
})




module.exports = router