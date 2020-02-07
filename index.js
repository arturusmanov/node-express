const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const mongoose = require('mongoose');

// Подключаем роуты
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');

const app = express();


const hbs = exphbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// Статическая папка
app.use('/public', express.static(path.join(__dirname, 'public')));

// middleware для того чтобы работать с формой POST как с json?
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);


async function start() {
    try {
        // const url = 'mongodb://localhost:27017/test';
        const PORT = process.env.PORT || 3123;

        // await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        app.listen(PORT, () => {
            console.log(`Server is runing on port ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e);
    }

}

start();



