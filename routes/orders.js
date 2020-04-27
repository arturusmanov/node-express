const {Router} = require('express');
const OrderModel = require('../models/order-model');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const orders = await OrderModel.find({'user.userId': req.user._id}).populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        });
    } catch (e) {
        console.log(e);
    }

});

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();
        console.log(user);
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc},
        }));

        const order = new OrderModel({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses: courses,
        });

        await order.save();
        console.log(req.user);
        await req.user.clearCart();

        res.redirect('/orders');
    }
    catch (e) {
        console.log(e);
    }

});

module.exports = router;