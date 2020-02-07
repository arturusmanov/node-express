const { Router } = require('express');
const Course = require('../models/course-model');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses,
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: course.title,
        course,
    });
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const course = await Course.getById(req.params.id);
    res.render('edit', {
        title: course.title,
        course,
    });
});

router.post('/edit', async (req, res) => {
    console.log('req.params', req.body);
    const course = new Course(req.body.title, req.body.price, req.body.img, req.body.id);
    await course.update(req.body);

    res.redirect('/courses')
});

module.exports = router;