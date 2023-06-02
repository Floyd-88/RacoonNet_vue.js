"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelLoadAxios = void 0;
var cancelLoadAxios = {
  state: function state() {
    return {
      cancelTokenArr: [] // Отменить массив токенов запроса

    };
  },
  getters: {},
  mutations: {
    pushToken: function pushToken(state, payload) {
      state.cancelTokenArr.push(payload.cancelToken);
    },
    clearToken: function clearToken(_ref) {
      var cancelTokenArr = _ref.cancelTokenArr;
      cancelTokenArr.forEach(function (item) {
        item('Запрос на отмену перехода по маршруту');
      });
      cancelTokenArr = [];
    }
  },
  actions: {},
  namespaced: true
};
exports.cancelLoadAxios = cancelLoadAxios;