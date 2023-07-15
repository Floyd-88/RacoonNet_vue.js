"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedBackStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var feedBackStore = {
  state: function state() {
    return {
      isModalFeedBack: false,
      messageFeedBack: {
        selectedCause: "",
        title: "",
        description: ""
      }
    };
  },
  getters: {
    getisModalFeedBack: function getisModalFeedBack(state) {
      return state.isModalFeedBack;
    },
    getMessageFeedBack: function getMessageFeedBack(state) {
      return state.messageFeedBack;
    }
  },
  mutations: {
    setIsModalFeedBack: function setIsModalFeedBack(state, bool) {
      state.isModalFeedBack = bool;
    },
    setMessageFeedBackSelectedCause: function setMessageFeedBackSelectedCause(state, value) {
      state.messageFeedBack.selectedCause = value;
    },
    setMessageFeedBackTitle: function setMessageFeedBackTitle(state, value) {
      state.messageFeedBack.title = value;
    },
    setMessageFeedBackDescription: function setMessageFeedBackDescription(state, value) {
      state.messageFeedBack.description = value;
    }
  },
  actions: {
    SEND_MESSAGE_PROBLEM_USER: function SEND_MESSAGE_PROBLEM_USER(_ref) {
      var getters, commit;
      return regeneratorRuntime.async(function SEND_MESSAGE_PROBLEM_USER$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getters = _ref.getters, commit = _ref.commit;
              _context.next = 3;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/problem_user', {
                cause: getters.getMessageFeedBack.selectedCause,
                title: getters.getMessageFeedBack.title,
                description: getters.getMessageFeedBack.description
              }).then(function () {
                commit("setIsModalFeedBack", false);
                commit("setMessageFeedBackSelectedCause", "");
                commit("setMessageFeedBackTitle", "");
                commit("setMessageFeedBackDescription", "");
              })["catch"](function (error) {
                console.log(error);
                commit("setIsModalFeedBack", false);
                commit("setMessageFeedBackSelectedCause", "");
                commit("setMessageFeedBackTitle", "");
                commit("setMessageFeedBackDescription", "");
              }));

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
exports.feedBackStore = feedBackStore;