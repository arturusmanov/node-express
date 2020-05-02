const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const keys = require('./keys/index');

// Подключаем роуты
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Мидлвейры
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

// Models
const User = require('./models/user-model')

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
});
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// middleware
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// Статическая папка
app.use('/public', express.static(path.join(__dirname, 'public')));

// middleware для того чтобы работать с формой POST как с json?
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3123;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e);
    }

}

start();



