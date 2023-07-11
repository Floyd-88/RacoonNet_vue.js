"use strict";

var fs = require('fs'); //путь к папке где лежат фотографии


var path = "../src/assets/"; //проверка на наличие фотографии в папке, если фото есть - отправляем ее клиенту, если нет отправляем стандартную фотографию

var photosArray = function photosArray(body) {
  body.map(function (element) {
    try {
      //синхронный метод проверки файла ??????????????
      fs.existsSync("".concat(path + element.photo_name)) ? element.photo_name : element.photo_name = 'ava/ava_1.jpg';
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.photosArray = photosArray; //проверка на наличие авы в папке, если ава есть - отправляем ее клиенту, если нет отправляем стандартную аву

var avaArray = function avaArray(body) {
  body.map(function (element) {
    try {
      //синхронный метод проверки файла ??????????????
      fs.existsSync("".concat(path + element.ava)) ? element.ava : element.ava = 'ava/ava_1.jpg';
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.avaArray = avaArray; //проверка авы с уведомлений

var avaArrayNotice = function avaArrayNotice(body) {
  body.map(function (element) {
    try {
      //синхронный метод проверки файла ??????????????
      fs.existsSync("".concat(path + element.ava_addressee)) ? element.ava_addressee : element.ava_addressee = 'ava/ava_1.jpg';
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.avaArrayNotice = avaArrayNotice; //проверка авы

var avaOne = function avaOne(user) {
  fs.existsSync("".concat(path + user.ava)) ? user.ava : user.ava = 'ava/ava_1.jpg';
};

module.exports.avaOne = avaOne;