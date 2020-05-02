const { Router } = require('express');
const Course = require('../models/course-model');
const auth = require('../middleware/auth');
const router = Router();

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

// Получить все
router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img');
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        userId: req.user ? req.user._id.toString() : null,
        courses,
    })
});

// Получить 1
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            layout: 'empty',
            title: course.title,
            course,
        });
    } catch (e) {
        console.log(e);
    }

});

// Редактировать 1
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    try {
        const course = await Course.findById(req.params.id);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }

        res.render('edit', {
            title: course.title,
            course,
        });
    } catch (e) {
        
    }
});

// Пост запрос для сохранения редактирвоания
router.post('/edit', auth, async (req, res) => {
    try {
        const { id } = req.body;
        delete req.body.id;
        const course = await Course.findById(id);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }

        Object.assign(course, req.body);
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }


});

// Удаление курса
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id,
        });
        res.redirect('/courses');
    }
    catch (e) {
        console.log(e);
    }

});

module.exports = router;