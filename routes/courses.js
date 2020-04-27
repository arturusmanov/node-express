const { Router } = require('express');
const Course = require('../models/course-model');
const auth = require('../middleware/auth');
const router = Router();

// Получить все
router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img');
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses,
    })
});

// Получить 1
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: course.title,
        course,
    });
});

// Редактировать 1
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    res.render('edit', {
        title: course.title,
        course,
    });
});

// Пост запрос для сохранения редактирвоания
router.post('/edit', auth, async (req, res) => {
    const { id } = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses')
});

// Удаление курса
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/courses');
    }
    catch (e) {
        console.log(e);
    }

});

module.exports = router;