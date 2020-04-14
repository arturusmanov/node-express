const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const mongoose = require('mongoose');

// Подключаем роуты
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');

// Models
const User = require('./models/user-model')

const app = express();


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// middleware
app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e432b053cf8ad3e387019c5');
        req.user = user;
        next();
    }
    catch (e) {
        console.log(e);
    }

});

// Статическая папка
app.use('/public', express.static(path.join(__dirname, 'public')));

// middleware для того чтобы работать с формой POST как с json?
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3123;

async function start() {
    try {
        const url = `mongodb://localhost:27017/node-express`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        });

        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'admin@admin.ru',
                name: 'admin',
                cart: {items: []},
            });
            await user.save();
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e);
    }

}

start();



