const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json',
)

class CardModel{
    static async add (course) {
        const card = await CardModel.fetch();

        const idx = card.courses.findIndex(c => c.id === course.id);
        console.log(idx);
        const candidate = card.courses[idx];
        console.log(candidate);

        if (candidate) {
            candidate.count++;
            card.courses[idx] = candidate;
        }
        else {
            course.count = 1;
            card.courses.push(course);
        }

        card.price += +course.price;

        return new Promise ((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'card.json'),
                JSON.stringify(card),
                (err) => {
                    if (err) reject(err);
                    resolve();
                });
        });
    };

    static async remove(id) {
        const card = await CardModel.fetch();
        const idx = card.courses.findIndex(c => c.id === id);

        const course = card.courses[idx];

        if (card.courses[idx].count > 1) {
            card.courses[idx].count--;
        }
        else {
            card.courses = card.courses.filter(c => c.id !== id);
        }

        card.price -= course.price;

        return new Promise ((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(card),
                (err) => {
                    if (err) reject(err)
                    resolve(card);
                }
            )
        })
    };

    static async fetch() {
        return new Promise ((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'card.json'),
                'utf-8', (err, data) => {
                    if (err) reject(err);
                    resolve(JSON.parse(data));
                })
        })
    };

}

module.exports = CardModel;