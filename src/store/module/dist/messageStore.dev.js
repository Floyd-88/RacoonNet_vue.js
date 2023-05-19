"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _socketio = _interopRequireDefault(require("../../services/socketio.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var messageStore = {
  state: function state() {
    return {
      modalWriteMessage: false,
      messageUser: "",
      //текст сообщения
      arrayDialogs: [],
      arrayMessages: [],
      countNewMessage: "",
      isNewMessageNotify: false,
      countDialogs: 0,
      //с какого диалога начинать вести счет
      limitDialogs: 10,
      // лимит диалогов на странице
      countMessages: 0,
      // с какого сообщения начинать вести счет
      limitMessages: 10 // лимит сообщений на странице

    };
  },
  getters: {
    getModalWriteMessage: function getModalWriteMessage(state) {
      return state.modalWriteMessage;
    },
    getMessageUser: function getMessageUser(state) {
      return state.messageUser;
    },
    getArrayDialogs: function getArrayDialogs(state) {
      return state.arrayDialogs;
    },
    getArrayMessages: function getArrayMessages(state) {
      return state.arrayMessages;
    },
    getCountNewMessage: function getCountNewMessage(state) {
      return state.countNewMessage;
    },
    userAva: function userAva(state, _, rootState) {
      return rootState.authorizationStore.user.ava;
    },
    getIsNewMessageNotify: function getIsNewMessageNotify(state) {
      return state.isNewMessageNotify;
    },
    getCountDialogs: function getCountDialogs(state) {
      return state.countDialogs;
    }
  },
  mutations: {
    //открытие-закрытия модального окна с сообщением
    setModalWriteMessage: function setModalWriteMessage(state, bool) {
      state.modalWriteMessage = bool;
      document.body.style.overflow = "hidden";

      if (bool === false) {
        document.body.style.overflow = "auto";
      }
    },
    setMessageUser: function setMessageUser(state, value) {
      state.messageUser = value;
    },
    setArrayDialogs: function setArrayDialogs(state, value) {
      state.arrayDialogs = value;
    },
    setArrayMessages: function setArrayMessages(state, value) {
      state.arrayMessages = value;
    },
    setArrayMessagesUnread: function setArrayMessagesUnread(state) {
      state.arrayMessages.map(function (message) {
        return message.unread = 0;
      });
    },
    setCountNewMessage: function setCountNewMessage(state, count) {
      state.countNewMessage = count;
    },
    setIsNewMessageNotify: function setIsNewMessageNotify(state, bool) {
      state.isNewMessageNotify = bool;
    },
    setCountDialogs: function setCountDialogs(state, count) {
      state.countDialogs += count;
    },
    setCountDialogsNull: function setCountDialogsNull(state) {
      state.countDialogs = 0;
    },
    setCountMessages: function setCountMessages(state, count) {
      state.countMessages += count;
    },
    setCountMessagesNull: function setCountMessagesNull(state) {
      state.countMessages = 0;
    }
  },
  actions: {
    //сохранение сообщений в базе данных
    WRITE_MESSAGE_USER: function WRITE_MESSAGE_USER(_ref, addresseeID) {
      var state, commit, dispatch, date, message;
      return regeneratorRuntime.async(function WRITE_MESSAGE_USER$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              state = _ref.state, commit = _ref.commit, dispatch = _ref.dispatch;
              _context.next = 3;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 3:
              date = _context.sent;
              message = {
                destinationID: addresseeID,
                textMessage: state.messageUser,
                date: date
              };
              _context.prev = 5;
              commit("setMessageUser", "");
              commit("setModalWriteMessage", false);
              _context.next = 10;
              return regeneratorRuntime.awrap(_axios["default"].post("http://localhost:8000/user_message", message).then(function (res) {
                //отпраляем сообщение на сервер для передачи его адресату через сокет
                var newMessage = res.data[0];
                newMessage.destinationID = addresseeID;

                _socketio["default"].sendMessage(newMessage, function (cb) {
                  console.log(cb);
                });

                commit("setArrayMessages", [].concat(_toConsumableArray(state.arrayMessages), [newMessage])); // state.arrayMessages.push(resp.data)
              }));

            case 10:
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](5);
              console.log(_context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[5, 12]]);
    },
    //получение всех диалогов пользователя
    LOAD_DIALOGS: function LOAD_DIALOGS(_ref2, body) {
      var commit, state;
      return regeneratorRuntime.async(function LOAD_DIALOGS$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit, state = _ref2.state;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/user_dialogs", {
                params: {
                  body: body,
                  _count: state.countDialogs,
                  _limit: state.limitDialogs
                }
              }).then(function (resp) {
                var dialogs = resp.data.sort(function (a, b) {
                  return b.unread - a.unread;
                });
                commit("setArrayDialogs", [].concat(_toConsumableArray(state.arrayDialogs), _toConsumableArray(dialogs)));

                if (resp.data.length > 0) {
                  commit("setCountDialogs", 10);
                } // let count = resp.data.reduce((accum, item) => accum + item.unread, 0);
                // commit("setCountNewMessage", count)
                // commit("setMessageUser", "")
                // commit("setModalWriteMessage", false)

              }));

            case 4:
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](1);
              console.log(_context2.t0);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //получение переписки с конкретным пользователем
    LOAD_MESSAGES_USER: function LOAD_MESSAGES_USER(_ref3, id) {
      var commit = _ref3.commit,
          state = _ref3.state;
      return new Promise(function (resolve) {
        try {
          _axios["default"].get("http://localhost:8000/user_messages", {
            params: {
              user_companion: id,
              _count: state.countMessages,
              _limit: state.limitMessages
            }
          }).then(function (resp) {
            var arrayMessage = resp.data.reverse();
            console.log(state.arrayMessages);
            commit("setArrayMessages", [].concat(_toConsumableArray(arrayMessage), _toConsumableArray(state.arrayMessages)));

            if (resp.data.length > 0) {
              commit("setCountMessages", 10);
            }

            resolve(resp.data[resp.data.length - 4]);
          });
        } catch (err) {
          console.log(err);
        }
      });
    },
    //удаление сообщения
    DELETE_MESSAGES: function DELETE_MESSAGES(_ref4, id) {
      var state, message_params;
      return regeneratorRuntime.async(function DELETE_MESSAGES$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              state = _ref4.state;
              _context3.prev = 1;
              message_params = {
                deleteID: id
              };
              _context3.next = 5;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]("http://localhost:8000/user_messages", {
                data: message_params
              }).then(function () {
                state.arrayMessages = state.arrayMessages.filter(function (message) {
                  return message.id !== id;
                });
              }));

            case 5:
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](1);
              console.log(_context3.t0);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[1, 7]]);
    },
    //удаление диалога
    DELETE_DIALOGS: function DELETE_DIALOGS(_ref5, id) {
      var state, commit, dialogs_params;
      return regeneratorRuntime.async(function DELETE_DIALOGS$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              state = _ref5.state, commit = _ref5.commit;
              _context4.prev = 1;
              dialogs_params = {
                dialogsID: id
              };
              _context4.next = 5;
              return regeneratorRuntime.awrap(_axios["default"].put("http://localhost:8000/user_messages", dialogs_params).then(function (resp) {
                var dialogs = state.arrayDialogs.filter(function (dialog) {
                  return dialog.convId !== resp.data.id;
                });
                commit("setArrayDialogs", dialogs);
              }));

            case 5:
              state.messageUser;
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](1);
              console.log(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    //обновление флагов непрочитанных сообщений после выхода из переписки
    UPDATE_FLAGS_UNREAD_MESSAGE: function UPDATE_FLAGS_UNREAD_MESSAGE(_ref6, conv_id) {
      var getters, commit;
      return regeneratorRuntime.async(function UPDATE_FLAGS_UNREAD_MESSAGE$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              getters = _ref6.getters, commit = _ref6.commit;
              _context5.prev = 1;
              _context5.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].put("http://localhost:8000/unread_messages", {
                conv_id: conv_id
              }).then(function (res) {
                getters.getArrayDialogs.map(function (dialog) {
                  if (dialog.convId === conv_id) {
                    dialog.unread = 0;
                  }
                });
                commit("setCountNewMessage", getters.getCountNewMessage - res.data.count);
              }));

            case 4:
              _context5.next = 9;
              break;

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5["catch"](1);
              console.log(_context5.t0);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //обновление диалогов без перезагрузки через сокеты
    UPDATE_DIALOGS_SOCKETS: function UPDATE_DIALOGS_SOCKETS(_ref7, data) {
      var state = _ref7.state,
          commit = _ref7.commit;
      state.arrayDialogs.map(function (dialog) {
        if (dialog.convId == data.conv_id) {
          dialog.message = data.message, dialog.date = data.date, dialog.id = data.id, dialog.ava = data.ava, dialog.name = data.name, dialog.surname = data.surname, dialog.unread += 1;
        }
      });

      if (!state.arrayDialogs.some(function (i) {
        return i.convId === data.conv_id;
      })) {
        var newDialog = {
          convId: data.conv_id,
          message: data.message,
          date: data.date,
          isShowBtnDelete: false,
          id: data.id,
          ava: data.ava,
          name: data.name,
          surname: data.surname,
          unread: 1,
          sender: data.sender,
          userID: data.sender
        };
        commit("setArrayDialogs", [newDialog].concat(_toConsumableArray(state.arrayDialogs)));
      }

      state.arrayDialogs.sort(function (a, b) {
        if (a.unread) {
          return b.id - a.id;
        }
      });
    }
  },
  namespaced: true
};
exports.messageStore = messageStore;