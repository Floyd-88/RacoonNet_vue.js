"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentsPost = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _socketio = _interopRequireDefault(require("../../services/socketio.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var commentsPost = {
  state: function state() {
    return {
      isShowWriteComment: true,
      //показывать комментарии с textarea
      commentPost: "",
      //текст комментария
      underCommentPost: "",
      //текст комментария под комментарием
      commentsArray: [],
      //массив комментариев к посту
      commentsCommentArray: [],
      //массив комментариев к комментариям
      usersLikesPost: [],
      //пользователи лайкнувшие пост
      showModalBlockUsersLikesPost: false //показывать блок с пользователями лайкнувшими пост
      // commentText: "",
      // underCommentText: "",

    };
  },
  getters: {
    getIsShowWriteComment: function getIsShowWriteComment(state) {
      return state.isShowWriteComment;
    },
    getCommentPost: function getCommentPost(state) {
      return state.commentPost;
    },
    getUnderCommentPost: function getUnderCommentPost(state) {
      return state.underCommentPost;
    },
    getCommentsArray: function getCommentsArray(state) {
      return state.commentsArray;
    },
    getCommentsCommentArray: function getCommentsCommentArray(state) {
      return state.commentsCommentArray;
    },
    getUsersLikesPost: function getUsersLikesPost(state) {
      return state.usersLikesPost;
    },
    getShowModalBlockUsersLikesPost: function getShowModalBlockUsersLikesPost(state) {
      return state.showModalBlockUsersLikesPost;
    } // getUnderCommentText: state => state.underCommentText

  },
  mutations: {
    setIsShowWriteComment: function setIsShowWriteComment(state) {
      state.isShowWriteComment = !state.isShowWriteComment;
    },
    setCommentPost: function setCommentPost(state, text) {
      state.commentPost = text;
    },
    setUnderCommentPost: function setUnderCommentPost(state, text) {
      state.underCommentPost = text;
    },
    setCommentsArray: function setCommentsArray(state, value) {
      state.commentsArray = value;
    },
    setCommentsCommentArray: function setCommentsCommentArray(state, value) {
      state.commentsCommentArray = value;
    },
    //удалить комментарий к коментарию
    setRemoveCommentsComment: function setRemoveCommentsComment(state, id) {
      state.commentsCommentArray = state.commentsCommentArray.filter(function (comment) {
        return comment.id !== id;
      });
    },
    //удалить комментарий к посту
    setRemoveCommentsPost: function setRemoveCommentsPost(state, id) {
      state.commentsArray = state.commentsArray.filter(function (comment) {
        return comment.id !== id;
      });
    },
    setUsersLikesPost: function setUsersLikesPost(state, value) {
      state.usersLikesPost = value;
    },
    setShowModalBlockUsersLikesPost: function setShowModalBlockUsersLikesPost(state, bool) {
      state.showModalBlockUsersLikesPost = bool;
    } // setUnderCommentText(state, text) {
    //     state.underCommentText = text;
    // }

  },
  actions: {
    //сохранение комментария к посту в базу данных
    SAVE_COMMENTS_POST: function SAVE_COMMENTS_POST(_ref, newCommentsPost) {
      var dispatch, commit, state, date;
      return regeneratorRuntime.async(function SAVE_COMMENTS_POST$(_context) {
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
              newCommentsPost.date = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/load_comments_post.js', newCommentsPost).then(function (response) {
                commit("setCommentsArray", [response.data].concat(_toConsumableArray(state.commentsArray))); // commit("setAddPosts", response.data);
                // commit("setCountPosts", 1);
                // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                // commit("setCommentPost", "")
                //отправляем уведомление адресату без перезагрузки страницы

                _socketio["default"].sendNotice(response.data.authorPost, function (cb) {
                  console.log(cb);
                });
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
    //сохранение комментария к комментарию в базу данных
    SAVE_UNDER_COMMENTS_POST: function SAVE_UNDER_COMMENTS_POST(_ref2, newCommentsComment) {
      var dispatch, commit, state, date;
      return regeneratorRuntime.async(function SAVE_UNDER_COMMENTS_POST$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dispatch = _ref2.dispatch, commit = _ref2.commit, state = _ref2.state;
              _context2.next = 3;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 3:
              date = _context2.sent;
              _context2.next = 6;
              return regeneratorRuntime.awrap(date);

            case 6:
              newCommentsComment.date = _context2.sent;
              _context2.next = 9;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/load_comments_comment.js', newCommentsComment).then(function (response) {
                // console.log(response.data);
                response.data.nameAddressee = newCommentsComment.nameAddressee;
                commit("setCommentsCommentArray", [response.data].concat(_toConsumableArray(state.commentsCommentArray))); // commit("setAddPosts", response.data);
                // commit("setCountPosts", 1);
                // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                // commit("setCommentPost", "")
                //отправляем уведомление адресату без перезагрузки страницы

                _socketio["default"].sendNotice(newCommentsComment.author_comment_comment || response.data.author_comment_id, function (cb) {
                  console.log(cb);
                });
              })["catch"](function (error) {
                console.log("Ошибка при написании комментария: " + error);
              }));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    //загрузка комментариев из БД
    LOAD_COMMENTS_POST: function LOAD_COMMENTS_POST(_ref3, body) {
      var state, commit;
      return regeneratorRuntime.async(function LOAD_COMMENTS_POST$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              state = _ref3.state, commit = _ref3.commit;
              return _context3.abrupt("return", new Promise(function (resolve, reject) {
                _axios["default"].get('http://localhost:8000/load_comments_post.js', {
                  params: {
                    userID: body.userID,
                    postID: body.postID.slice(body.postID.length - 20, body.postID.length)
                  }
                }).then(function (response) {
                  if (response.data.length > 0) {
                    commit("setCommentsArray", [].concat(_toConsumableArray(state.commentsArray), _toConsumableArray(response.data)));
                  }

                  resolve(response);
                })["catch"](function (err) {
                  reject(err);
                });
              }));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    //загрузка комментариев из БД к конкретному посту
    LOAD_COMMENTS_ONE_POST: function LOAD_COMMENTS_ONE_POST(_ref4, id) {
      var state, commit, dispatch;
      return regeneratorRuntime.async(function LOAD_COMMENTS_ONE_POST$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              state = _ref4.state, commit = _ref4.commit, dispatch = _ref4.dispatch;
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/load_comments_one_post.js', {
                params: {
                  postID: id
                }
              }).then(function (response) {
                if (response.data.length > 0) {
                  commit("setCommentsArray", [].concat(_toConsumableArray(state.commentsArray), _toConsumableArray(response.data)));
                  response.data.forEach(function (comment) {
                    if (comment.id) {
                      dispatch("LOAD_COMMENTS_COMMENT_ONE_POST", comment.id);
                    }
                  });
                }
              }));

            case 4:
              _context4.next = 9;
              break;

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](1);

              if (_context4.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context4.t0);
              }

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //загрузка комментариев к комментариям из БД
    LOAD_COMMENTS_COMMENT: function LOAD_COMMENTS_COMMENT(_ref5, body) {
      var state, commit;
      return regeneratorRuntime.async(function LOAD_COMMENTS_COMMENT$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              state = _ref5.state, commit = _ref5.commit;
              _context5.prev = 1;
              _context5.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/load_comments_comment.js', {
                params: {
                  userID: body.userID,
                  postID: body.postID
                }
              }).then(function (response) {
                if (response.data.length > 0) {
                  commit("setCommentsCommentArray", [].concat(_toConsumableArray(state.commentsCommentArray), _toConsumableArray(response.data)));
                }
              }));

            case 4:
              _context5.next = 9;
              break;

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5["catch"](1);

              if (_context5.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context5.t0);
              }

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //загрузка комментариев к комментариям из БД к конкретному посту
    LOAD_COMMENTS_COMMENT_ONE_POST: function LOAD_COMMENTS_COMMENT_ONE_POST(_ref6, id) {
      var state, commit;
      return regeneratorRuntime.async(function LOAD_COMMENTS_COMMENT_ONE_POST$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              state = _ref6.state, commit = _ref6.commit;
              _context6.prev = 1;
              _context6.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/load_comments_comment_one_post.js', {
                params: {
                  postID: id
                }
              }).then(function (response) {
                if (response.data.length > 0) {
                  commit("setCommentsCommentArray", [].concat(_toConsumableArray(state.commentsCommentArray), _toConsumableArray(response.data)));
                }
              }));

            case 4:
              _context6.next = 9;
              break;

            case 6:
              _context6.prev = 6;
              _context6.t0 = _context6["catch"](1);

              if (_context6.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context6.t0);
              }

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //удаление комментария к комментарию
    DELETE_COMMENTS_COMMENT: function DELETE_COMMENTS_COMMENT(_ref7, paramsComment) {
      var commit;
      return regeneratorRuntime.async(function DELETE_COMMENTS_COMMENT$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              commit = _ref7.commit;
              _context7.prev = 1;
              commit("setRemoveCommentsComment", paramsComment.commentID);
              _context7.next = 5;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://localhost:8000/load_comments_comment.js', {
                data: paramsComment
              }).then(function (response) {
                console.log(response.data);
              }));

            case 5:
              _context7.next = 10;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7["catch"](1);
              console.log(_context7.t0);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[1, 7]]);
    },
    //удаление комментария к посту
    DELETE_COMMENTS_POST: function DELETE_COMMENTS_POST(_ref8, paramsComment) {
      var commit;
      return regeneratorRuntime.async(function DELETE_COMMENTS_POST$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              commit = _ref8.commit;
              _context8.prev = 1;
              commit("setRemoveCommentsPost", paramsComment.commentID);
              _context8.next = 5;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://localhost:8000/load_comments_post.js', {
                data: paramsComment
              }).then(function (response) {
                console.log(response.data);
              }));

            case 5:
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8["catch"](1);
              console.log(_context8.t0);

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[1, 7]]);
    },
    GET_USER_LIKES_POST: function GET_USER_LIKES_POST(_ref9, post) {
      var commit;
      return regeneratorRuntime.async(function GET_USER_LIKES_POST$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              commit = _ref9.commit;
              _context9.prev = 1;
              _context9.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/get_users_likes', {
                params: {
                  postID: post.id
                }
              }).then(function (response) {
                commit("setUsersLikesPost", response.data);
              }));

            case 4:
              _context9.next = 9;
              break;

            case 6:
              _context9.prev = 6;
              _context9.t0 = _context9["catch"](1);

              if (_context9.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context9.t0);
              }

            case 9:
            case "end":
              return _context9.stop();
          }
        }
      }, null, null, [[1, 6]]);
    }
  },
  namespaced: true
};
exports.commentsPost = commentsPost;