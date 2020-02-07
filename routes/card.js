const {Router} = require('express');
const CardModel = require('../models/card-model');
const CourseModel = require('../models/course-model');

const router = Router();

router.post('/add', async (req, res) => {
    const course = await CourseModel.getById(req.body.id)
    await CardModel.add(course);
    res.redirect('/card')
});

router.delete('/remove/:id', async (req, res) => {
    const card = await CardModel.remove(req.params.id);
    res.status(200).json(card);
});

router.get('/', async (req, res) => {
    const card = await CardModel.fetch();
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: card.courses,
        price: card.price,
    })
});

module.exports = router;