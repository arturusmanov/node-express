const { Schema, model } = require('mongoose');

const CourseModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

CourseModel.method('toClient', function () {
    const course = this.toObject()
    course.id = course._id;
    delete course._id;
});

module.exports = model('Course', CourseModel);