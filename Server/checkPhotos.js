const fs = require('fs')

//путь к папке где лежат фотографии
let path = "../src/assets/";

//проверка на наличие фотографии в папке, если фото есть - отправляем ее клиенту, если нет отправляем стандартную фотографию

let photosArray = (body) => {
    body.map(element => {
        try {
            //синхронный метод проверки файла ??????????????
            fs.existsSync(`${path + element.photo_name}`) ? element.photo_name : element.photo_name = 'ava/ava_1.jpg';
        } catch (err) {
            console.log(err);
        }
    })
}
module.exports.photosArray = photosArray;

//проверка на наличие авы в папке, если ава есть - отправляем ее клиенту, если нет отправляем стандартную аву
let avaArray = (body) => {
    body.map(element => {
        try {
            //синхронный метод проверки файла ??????????????
            fs.existsSync(`${path + element.ava}`) ? element.ava : element.ava = 'ava/ava_1.jpg';
        } catch (err) {
            console.log(err);
        }
    })
}
module.exports.avaArray = avaArray;

//проверка авы с уведомлений
let avaArrayNotice = (body) => {
    body.map(element => {
        try {
            //синхронный метод проверки файла ??????????????
            fs.existsSync(`${path + element.ava_addressee}`) ? element.ava_addressee : element.ava_addressee = 'ava/ava_1.jpg';
        } catch (err) {
            console.log(err);
        }
    })
}
module.exports.avaArrayNotice = avaArrayNotice;

//проверка авы
let avaOne = (user) => {
    fs.existsSync(`${path + user.ava}`) ? user.ava : user.ava = 'ava/ava_1.jpg'
}

module.exports.avaOne = avaOne;