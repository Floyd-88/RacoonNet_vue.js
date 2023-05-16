"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noticeStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import axios from "axios";
// import SocketioService from "../../services/socketio.service";
var noticeStore = {
  state: function state() {
    return {
      isShowModalWindowNotice: false,
      //открытие модального окна с уведомлениями
      isShowModalWindowOneNotice: false,
      //открытие модального окна с конкретным уведомлением
      noticeTextArray: ["написал что то на вашей стене", "отметил запись на Ваше стене", "отметил Вашу фотографию", "оставил новый комментарий под Вашей записью", "оставил новый комментарий под Вашей фотографией"],
      //массив с текстовыми уведомлениями
      noticeArray: [],
      //массив с уведомлениями
      selectNotice: {},
      //выбранное уведомление
      photosPostNotice: [] //массив с фотографиями из поста который показан в уведомлении

    };
  },
  getters: {
    getIsShowModalWindowNotice: function getIsShowModalWindowNotice(state) {
      return state.isShowModalWindowNotice;
    },
    getIsShowModalWindowOneNotice: function getIsShowModalWindowOneNotice(state) {
      return state.isShowModalWindowOneNotice;
    },
    noticeTextArray: function noticeTextArray(state) {
      return state.noticeTextArray;
    },
    getNoticeArray: function getNoticeArray(state) {
      return state.noticeArray;
    },
    getSelectNotice: function getSelectNotice(state) {
      return state.selectNotice;
    },
    getPhotosPostNotice: function getPhotosPostNotice(state) {
      return state.photosPostNotice;
    }
  },
  mutations: {
    setIsShowModalWindowNotice: function setIsShowModalWindowNotice(state, bool) {
      state.isShowModalWindowNotice = bool;

      if (bool === true) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    setIsShowModalWindowOneNotice: function setIsShowModalWindowOneNotice(state, bool) {
      state.isShowModalWindowOneNotice = bool;
    },
    setNoticeArray: function setNoticeArray(state, value) {
      state.noticeArray = value;
    },
    setNoticeArrayDelete: function setNoticeArrayDelete(state, id) {
      state.noticeArray = state.noticeArray.filter(function (notice) {
        return notice.id !== id;
      });
    },
    setSelectNotice: function setSelectNotice(state, value) {
      state.selectNotice = value;
    },
    setPhotosPostNotice: function setPhotosPostNotice(state, value) {
      state.photosPostNotice = value;
    }
  },
  actions: {
    //получение массива с уведомлениями
    GET_NEW_NOTICE: function GET_NEW_NOTICE(_ref) {
      var commit;
      return regeneratorRuntime.async(function GET_NEW_NOTICE$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/new_notice").then(function (res) {
                console.log(res.data); // res.data.map(notice => {
                //     if (notice.selectedGender === "woman") {
                //         notice.text = state.noticeTextArray
                //     }
                // })

                commit("setNoticeArray", res.data);
              }));

            case 4:
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              console.log(_context.t0);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //удаление уведомления из списка
    NOTICE_ARRAY_DELETE: function NOTICE_ARRAY_DELETE(_ref2, id) {
      var commit;
      return regeneratorRuntime.async(function NOTICE_ARRAY_DELETE$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit;
              commit("setNoticeArrayDelete", id);
              _context2.prev = 2;
              _context2.next = 5;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]("http://localhost:8000/notice_delete", {
                data: {
                  noticeID: id
                }
              }).then(function (res) {
                console.log(res.data);
              }));

            case 5:
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](2);
              console.log(_context2.t0);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[2, 7]]);
    },
    //получение фотографий к посту в уведомлении
    GET_PHOTOS_POST_NOTICE: function GET_PHOTOS_POST_NOTICE(_ref3, post_id) {
      var commit;
      return regeneratorRuntime.async(function GET_PHOTOS_POST_NOTICE$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit;
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/new_notice_photos", {
                params: {
                  post_id: post_id
                }
              }).then(function (res) {
                console.log(res.data);
                commit("setPhotosPostNotice", res.data);
              }));

            case 4:
              _context3.next = 9;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](1);
              console.log(_context3.t0);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //убрать уведомление из шапки после его просмотра
    REMOVE_COUNT_NOTICE_LIST: function REMOVE_COUNT_NOTICE_LIST(context, id) {
      return regeneratorRuntime.async(function REMOVE_COUNT_NOTICE_LIST$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_axios["default"].put("http://localhost:8000/notice_remove_count", {
                noticeID: id
              }).then(function (res) {
                console.log(res.data);
              }));

            case 3:
              _context4.next = 8;
              break;

            case 5:
              _context4.prev = 5;
              _context4.t0 = _context4["catch"](0);
              console.log(_context4.t0);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 5]]);
    }
  },
  namespaced: true
};
exports.noticeStore = noticeStore;