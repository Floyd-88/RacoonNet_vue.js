"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelLoadAxios = void 0;
var cancelLoadAxios = {
  strict: true,
  state: {
    cancelTokens: [] //массив отмененных запросов

  },
  getters: {
    cancelTokens: function cancelTokens(state) {
      return state.cancelTokens;
    }
  },
  mutations: {
    setCancelTokens: function setCancelTokens(state, token) {
      state.cancelTokens.push(token);
    },
    setCancelTokensClear: function setCancelTokensClear(state) {
      state.cancelTokens = [];
    }
  },
  actions: {
    //отмена запросов на сервер
    CANCEL_PENDING_REQUESTS: function CANCEL_PENDING_REQUESTS(_ref) {
      var state, commit;
      return regeneratorRuntime.async(function CANCEL_PENDING_REQUESTS$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              state = _ref.state, commit = _ref.commit;
              state.cancelTokens.forEach(function (request) {
                if (request.cancel) {
                  request.cancel();
                }
              });
              commit('setCancelTokensClear');

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  },
  namespaced: true
};
exports.cancelLoadAxios = cancelLoadAxios;