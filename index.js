const express = require('express')
const mongoose = require('mongoose')
const app = express()
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRouter = require('./routes/home')
const coursesRouter = require('./routes/courses')
const addRouter = require('./routes/add')
const path = require('path')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const cserf = require('csurf')


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views','views')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))

const MONGODB_URI = `mongodb+srv://dima:fQXXjOl83ICkb3LG@cluster0.kbyto.mongodb.net/<dbname>?retryWrites=true&w=majority`
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})
app.use(session({
    secret: 'some value',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(cserf())
app.use(flash())
app.use(userMiddleware)
app.use(varMiddleware)

app.use('/', homeRouter)
app.use('/courses', coursesRouter)
app.use('/add', addRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)
app.use('/auth', authRouter)




async function start() {
    try{
        
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true})
    app.listen(3000, () => {
        console.log('server is running...')
    })
    }catch(e){
        console.log(e)
    }
    
    
}

start()