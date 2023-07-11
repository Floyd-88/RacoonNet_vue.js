"use strict";

var _vue = require("vue");

var _App = _interopRequireDefault(require("./App.vue"));

var _pages = _interopRequireDefault(require("@/pages"));

var _components = _interopRequireDefault(require("@/components"));

var _router = _interopRequireDefault(require("@/router/router"));

var _index = _interopRequireDefault(require("@/store/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _vue.createApp)(_App["default"]); // const token = localStorage.getItem('token');
// if (token) {
//     axios.defaults.headers.common['Authorization'] = token;
// }

_pages["default"].forEach(function (page) {
  app.component(page.name, page);
});

_components["default"].forEach(function (comp) {
  app.component(comp.name, comp);
});

app.use(_router["default"]);
app.use(_index["default"]);
app.mount('#app');
window.fallbackImage = require('./assets/ava/ava_1.jpg');