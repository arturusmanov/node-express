const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

class CourseModel {
    constructor (title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    };

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id,
        }
    };

    async save() {
        const courses = await CourseModel.getAll();
        courses.push(this.toJSON());

        return new Promise ((resolve, reject) => {
           fs.writeFile(
               path.join(__dirname, '..', 'data', 'courses.json'),
               JSON.stringify(courses),
               (err) => {
                   if (err) reject(err)
                   resolve();
               }
           )
        });
    };

    async update(course) {
        const courses = await CourseModel.getAll();
        const idx = courses.findIndex(c => c.id === course.id);
        courses[idx] = course;

        return new Promise ((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) reject(err)
                    resolve();
                }
            );
        });
    };

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile (
                path.join(__dirname, '..', 'data', 'courses.json'),
                (err, data) => {
                    if (err) throw reject(err);
                    resolve(JSON.parse(data));
                }
            );
        });
    };

    static async getById(id) {
        const courses = await CourseModel.getAll();
        for(let i = 0; i < courses.length; i++) {
            if (courses[i].id === id) {
                return courses[i];
            }
        }
    }
}

module.exports = CourseModel;