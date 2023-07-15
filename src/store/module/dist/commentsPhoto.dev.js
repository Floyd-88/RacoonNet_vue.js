"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentsPhoto = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _socketio = _interopRequireDefault(require("../../services/socketio.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var commentsPhoto = {
  state: function state() {
    return {
      // isShowWriteComment: false, //показывать комментарии с textarea
      commentPhoto: "",
      //текст комментария
      commentsPhotoArray: [],
      //массив комментариев к фотографии
      isFocusComment: false,
      //если фокус не сделан на поле ввода комментария 
      usersLikesPhoto: [],
      //пользователи лайкнувшие фото
      showModalBlockUsersLikesPhoto: false //показывать блок с пользователями лайкнувшими фото 

    };
  },
  getters: {
    // getIsShowWriteComment: state => state.isShowWriteComment,
    getCommentPhoto: function getCommentPhoto(state) {
      return state.commentPost;
    },
    getCommentsPhotoArray: function getCommentsPhotoArray(state) {
      return state.commentsPhotoArray;
    },
    getIsFocusComment: function getIsFocusComment(state) {
      return state.isFocusComment;
    },
    getUsersLikesPhoto: function getUsersLikesPhoto(state) {
      return state.usersLikesPhoto;
    },
    getShowModalBlockUsersLikesPhoto: function getShowModalBlockUsersLikesPhoto(state) {
      return state.showModalBlockUsersLikesPhoto;
    }
  },
  mutations: {
    // setIsShowWriteComment(state) {
    //     state.isShowWriteComment = !state.isShowWriteComment;
    // },
    setCommentPhoto: function setCommentPhoto(state, text) {
      state.commentPhoto = text;
    },
    setCommentsPhotoArray: function setCommentsPhotoArray(state, value) {
      state.commentsPhotoArray = value;
    },
    //удалить комментарий к посту
    setRemoveCommentsPhoto: function setRemoveCommentsPhoto(state, id) {
      state.commentsPhotoArray = state.commentsPhotoArray.filter(function (comment) {
        return comment.id !== id;
      });
    },
    setIsFocusComment: function setIsFocusComment(state, value) {
      state.isFocusComment = value;
    },
    setUsersLikesPhoto: function setUsersLikesPhoto(state, value) {
      state.usersLikesPhoto = value;
    },
    setShowModalBlockUsersLikesPhoto: function setShowModalBlockUsersLikesPhoto(state, bool) {
      state.showModalBlockUsersLikesPhoto = bool;
    }
  },
  actions: {
    //сохранение комментария к фотографии в базу данных
    SAVE_COMMENTS_PHOTO: function SAVE_COMMENTS_PHOTO(_ref, newCommentsPhoto) {
      var dispatch, commit, state, date;
      return regeneratorRuntime.async(function SAVE_COMMENTS_PHOTO$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dispatch = _ref.dispatch, commit = _ref.commit, state = _ref.state;
              _context.next = 3;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 3:
              date = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(date);

            case 6:
              newCommentsPhoto.date = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/load_comments_photo.js', newCommentsPhoto).then(function (response) {
                commit("setCommentsPhotoArray", [].concat(_toConsumableArray(state.commentsPhotoArray), [response.data])); // commit("setAddPosts", response.data);
                // commit("setCountPosts", 1);
                // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                // commit("setCommentPost", "")
                //отправляем уведомление адресату без перезагрузки страницы

                _socketio["default"].sendNotice(response.data.userID);
              })["catch"](function (error) {
                console.log("Ошибка при написании комментария: " + error);
              }));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    //загрузка комментариев из БД
    LOAD_COMMENTS_PHOTO: function LOAD_COMMENTS_PHOTO(_ref2, id) {
      var state, commit;
      return regeneratorRuntime.async(function LOAD_COMMENTS_PHOTO$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              state = _ref2.state, commit = _ref2.commit;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/load_comments_photo.js', {
                params: {
                  photoID: id
                }
              }).then(function (response) {
                if (response.data.length > 0) {
                  commit("setCommentsPhotoArray", [].concat(_toConsumableArray(state.commentsPhotoArray), _toConsumableArray(response.data)));
                }
              }));

            case 4:
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](1);

              if (_context2.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context2.t0);
              }

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //удаление комментария к посту
    DELETE_COMMENTS_PHOTO: function DELETE_COMMENTS_PHOTO(_ref3, paramsComment) {
      var commit;
      return regeneratorRuntime.async(function DELETE_COMMENTS_PHOTO$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit;
              _context3.prev = 1;
              commit("setRemoveCommentsPhoto", paramsComment.commentID);
              _context3.next = 5;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://localhost:8000/load_comments_photo.js', {
                data: paramsComment
              }).then(function () {}));

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
    GET_USER_LIKES_PHOTO: function GET_USER_LIKES_PHOTO(_ref4, photo) {
      var commit, photo_id;
      return regeneratorRuntime.async(function GET_USER_LIKES_PHOTO$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              commit = _ref4.commit;
              _context4.prev = 1;
              photo_id = photo.id;

              if (photo.photoID) {
                photo_id = photo.photoID;
              }

              _context4.next = 6;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/get_users_likes_photo', {
                params: {
                  photoID: photo_id
                }
              }).then(function (response) {
                commit("setUsersLikesPhoto", response.data);
              }));

            case 6:
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
    }
  },
  namespaced: true
};
exports.commentsPhoto = commentsPhoto;