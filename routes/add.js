const { Router } = require('express');
const CourseModel = require('../models/course-model');
const router = Router();

router.get('/', (req, res) => {
   res.render('add', {
       title: 'Add new course',
       isAdd: true,
   })
});

router.post('/', async (req, res) => {
    const course = new CourseModel(req.body.title, req.body.price, req.body.img);
    await course.save();

    res.redirect('/courses')
});

module.exports = router;