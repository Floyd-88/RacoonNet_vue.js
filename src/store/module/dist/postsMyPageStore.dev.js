"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postsMyPageStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _socketio = _interopRequireDefault(require("../../services/socketio.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var postsMyPageStore = {
  state: function state() {
    return {
      postText: "",
      //текст который отображается на странице
      id: "",
      //id конкретного поста
      beforePostText: "",
      //копия текста отображаемого на странице с которым мы работаем при редактировании
      modulePost: false,
      //отображение модального окна
      posts: [],
      //массив постов подгружаемый из базы данных
      countPosts: 0,
      //с какого поста начинать вести счет
      limitPosts: 20,
      //лимит постов на одной странице
      totalCount: 0,
      //всего страниц
      newsPostsFriends: [],
      //новостная лента от друзей
      countNews: 0,
      //с какой новости начинать вести счет
      limitNews: 10,
      // лимит новостей на странице
      likesPost: "",
      // isLoadPhotoPost: "" //загрузка фотографий в пост
      photosPostsArray: [],
      //фотографии к постам
      isNotRepeatAddPost: true //предотвращение потворной отправки поста

    };
  },
  getters: {
    getPostText: function getPostText(state) {
      return state.postText;
    },
    getBeforePostText: function getBeforePostText(state) {
      return state.beforePostText;
    },
    getModulePost: function getModulePost(state) {
      return state.modulePost;
    },
    getPosts: function getPosts(state) {
      return state.posts;
    },
    getUser: function getUser(state, getters, rootState, rootGetters) {
      //получаем ID авторизованного юзера
      return rootGetters["authorizationStore/getUser"];
    },
    getNewsPostsFriends: function getNewsPostsFriends(state) {
      return state.newsPostsFriends;
    },
    getLikesPost: function getLikesPost(state) {
      return state.likesPost;
    },
    // getIsLoadPhotoPost: (state) => state.isLoadPhotoPost
    getPhotosPostsArray: function getPhotosPostsArray(state) {
      return state.photosPostsArray;
    },
    getIsNotRepeatAddPost: function getIsNotRepeatAddPost(state) {
      return state.isNotRepeatAddPost;
    }
  },
  mutations: {
    //при открытии модального окна сохраняем в state его id и текст поста
    setModulePost: function setModulePost(state, _ref) {
      var task = _ref.task,
          id = _ref.id,
          text = _ref.text;
      state.modulePost = task;
      state.id = id;
      state.beforePostText = text;
      document.body.style.overflow = "hidden";
    },
    //закрытие модального окна
    setCloseModulePost: function setCloseModulePost(state) {
      state.modulePost = false;
      document.body.style.overflow = "auto";
    },
    setPostText: function setPostText(state, post) {
      state.postText = post;
    },
    setBeforePostText: function setBeforePostText(state, text) {
      state.beforePostText = text;
    },
    setPosts: function setPosts(state, posts) {
      state.posts = posts;
    },
    setAddPosts: function setAddPosts(state, newPost) {
      state.posts.unshift(newPost);
      state.postText = "";
    },
    setLimitPosts: function setLimitPosts(state) {
      state.limitPosts = 3;
    },
    setCountPosts: function setCountPosts(state, count) {
      state.countPosts += count;
    },
    setCountPostsNull: function setCountPostsNull(state) {
      state.countPosts = 0;
    },
    setCountPostDel: function setCountPostDel(state) {
      state.countPosts -= 1;
    },
    setRemovePost: function setRemovePost(state, id) {
      state.posts = state.posts.filter(function (post) {
        return post.id !== id;
      });
    },
    setNewsPostsFriends: function setNewsPostsFriends(state, value) {
      state.newsPostsFriends = value;
    },
    setCountNews: function setCountNews(state, count) {
      state.countNews += count;
    },
    setCountNewsNull: function setCountNewsNull(state) {
      state.countNews = 0;
    },
    setLikesPost: function setLikesPost(state, value) {
      state.likesPost = value;
    },
    // setIsLoadPhotoPost(state, bool) {
    //     state.isLoadPhotoPost = bool
    // }
    setPhotosPostsArray: function setPhotosPostsArray(state, value) {
      state.photosPostsArray = value;
    },
    //удаление картинки из массива
    removePhotosPostsArray: function removePhotosPostsArray(state, id) {
      if (id) {
        state.photosPostsArray = state.photosPostsArray.filter(function (photo) {
          return photo.photoID !== id;
        });
      }
    },
    setIsNotRepeatAddPost: function setIsNotRepeatAddPost(state, bool) {
      state.isNotRepeatAddPost = bool;
    }
  },
  actions: {
    //загрузка постов с базы данных
    loadPostServer: function loadPostServer(_ref2, id) {
      var state, commit, dispatch, getters;
      return regeneratorRuntime.async(function loadPostServer$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              state = _ref2.state, commit = _ref2.commit, dispatch = _ref2.dispatch, getters = _ref2.getters;
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                _axios["default"].get('http://localhost:8000/dataBase.js', {
                  params: {
                    _count: state.countPosts,
                    _limit: state.limitPosts,
                    userID: id
                  }
                }).then(function (response) {
                  if (response.data.length > 0) {
                    commit("setPosts", [].concat(_toConsumableArray(state.posts), _toConsumableArray(response.data)));
                    commit("setCountPosts", 20);
                    response.data.forEach(function (post) {
                      if (post.photos === "1") {
                        dispatch("LOAD_POST_PHOTOS", {
                          postID: post.id,
                          userID: getters.getUser.userID
                        });
                      }
                    });
                  }

                  resolve(response);
                })["catch"](function (err) {
                  reject(err);
                });
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    // добавление нового поста на мою страницу
    addPost: function addPost(_ref3, isPhoto) {
      var dispatch, getters, commit, state, newPost;
      return regeneratorRuntime.async(function addPost$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dispatch = _ref3.dispatch, getters = _ref3.getters, commit = _ref3.commit, state = _ref3.state;
              commit("setIsNotRepeatAddPost", false);
              newPost = {
                id: getters.getUser.userID,
                postText: state.postText.trim()
              };
              _context3.next = 5;
              return regeneratorRuntime.awrap(dispatch("newDate"));

            case 5:
              newPost.date = _context3.sent;
              newPost.photo = isPhoto;
              _context3.next = 9;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/dataBase.js', newPost).then(function _callee(response) {
                return regeneratorRuntime.async(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return regeneratorRuntime.awrap(commit("setAddPosts", response.data));

                      case 2:
                        _context2.next = 4;
                        return regeneratorRuntime.awrap(commit("setCountPosts", 1));

                      case 4:
                        _context2.next = 6;
                        return regeneratorRuntime.awrap(commit("setIsNotRepeatAddPost", true));

                      case 6:
                        //отправляем уведомление адресату без перезагрузки страницы
                        _socketio["default"].sendNotice(newPost.id, function (cb) {
                          console.log(cb);
                        });

                      case 7:
                      case "end":
                        return _context2.stop();
                    }
                  }
                });
              })["catch"](function (error) {
                commit("setIsNotRepeatAddPost", true);
                console.log("Ошибка при добавлении поста: " + error);
              }));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    // изменение поста
    editPost: function editPost(_ref4) {
      var state, dispatch, commit, date, _state$posts$filter, _state$posts$filter2, post;

      return regeneratorRuntime.async(function editPost$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              state = _ref4.state, dispatch = _ref4.dispatch, commit = _ref4.commit;
              _context4.next = 3;
              return regeneratorRuntime.awrap(dispatch("newDate"));

            case 3:
              date = _context4.sent;
              _state$posts$filter = state.posts.filter(function (post) {
                return post.id === state.id;
              }), _state$posts$filter2 = _slicedToArray(_state$posts$filter, 1), post = _state$posts$filter2[0];
              post.date = "Изменено: " + date;
              commit("setCloseModulePost");
              post.postText = state.beforePostText; //при нажатии на кнопку сохранить, перезаписываем postText

              _context4.next = 10;
              return regeneratorRuntime.awrap(_axios["default"].put('http://localhost:8000/dataBase.js', {
                postText: post.postText,
                date: "Изменено: " + date,
                postID: post.id,
                authorPost: post.authorPost
              }).then(function (response) {
                console.log(response);
              })["catch"](function (error) {
                console.log("Ошибка при редактировании поста: " + error);
              }));

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    //удаление поста
    removePost: function removePost(_ref5) {
      var getters, commit, state, _state$posts$filter3, _state$posts$filter4, post, paramsBody;

      return regeneratorRuntime.async(function removePost$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              getters = _ref5.getters, commit = _ref5.commit, state = _ref5.state;
              _state$posts$filter3 = state.posts.filter(function (post) {
                return post.id === state.id;
              }), _state$posts$filter4 = _slicedToArray(_state$posts$filter3, 1), post = _state$posts$filter4[0];
              commit("setRemovePost", state.id);
              commit("setCloseModulePost");
              paramsBody = {
                postID: state.id,
                authorPost: post.authorPost,
                pageID: getters.getUser.userID,
                photos: post.photos
              };
              _context5.next = 7;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://localhost:8000/dataBase_delete', {
                data: paramsBody
              }).then(function (response) {
                console.log(response);
                commit("setCountPostDel");
              })["catch"](function (error) {
                console.log(error);
              }));

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      });
    },
    //функция устанавливает отредактированный формат даты и времени
    newDate: function newDate() {
      var date = new Date();
      var result = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      return result;
    },
    //получение постов от друзей для отображения в новостях
    LOAD_NEWS_FRIENDS_USERS: function LOAD_NEWS_FRIENDS_USERS(_ref6) {
      var state, commit, dispatch;
      return regeneratorRuntime.async(function LOAD_NEWS_FRIENDS_USERS$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              state = _ref6.state, commit = _ref6.commit, dispatch = _ref6.dispatch;
              return _context6.abrupt("return", new Promise(function (resolve, reject) {
                _axios["default"].get('http://localhost:8000/news_friends.js', {
                  params: {
                    _count: state.countNews,
                    _limit: state.limitNews
                  }
                }).then(function (response) {
                  if (response.data.length > 0) {
                    commit("setNewsPostsFriends", [].concat(_toConsumableArray(state.newsPostsFriends), _toConsumableArray(response.data)));
                    commit("setCountNews", 10); // response.data.forEach(post => {
                    //     dispatch("commentsPost/LOAD_COMMENTS_POST", post.authorPost, { root: true });
                    //     dispatch("commentsPost/LOAD_COMMENTS_COMMENT", post.authorPost, { root: true });
                    // })

                    response.data.forEach(function (post) {
                      if (post.photos === "1") {
                        dispatch("LOAD_POST_PHOTOS", {
                          postID: post.id,
                          userID: post.authorPost
                        });
                      }

                      dispatch("commentsPost/LOAD_COMMENTS_ONE_POST", post.id, {
                        root: true
                      });
                    });
                  }

                  resolve(response);
                })["catch"](function (err) {
                  reject(err);
                });
              }));

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    //лайкнуть пост
    SAVE_LIKE_COUNT_POST: function SAVE_LIKE_COUNT_POST(_ref7, postID) {
      var commit, dispatch;
      return regeneratorRuntime.async(function SAVE_LIKE_COUNT_POST$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              commit = _ref7.commit, dispatch = _ref7.dispatch;
              _context7.prev = 1;
              _context7.next = 4;
              return regeneratorRuntime.awrap(dispatch("newDate"));

            case 4:
              postID.date = _context7.sent;
              _context7.next = 7;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/likes_post', postID).then(function (response) {
                commit("setLikesPost", response.data); //отправляем уведомление адресату без перезагрузки страницы

                if (response.data.flag) {
                  _socketio["default"].sendNotice(response.data.likes.authorPost, function (cb) {
                    console.log(cb);
                  });
                }
              }));

            case 7:
              _context7.next = 12;
              break;

            case 9:
              _context7.prev = 9;
              _context7.t0 = _context7["catch"](1);
              console.error(_context7.t0);

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[1, 9]]);
    },
    //загрузка фотографий к постам
    LOAD_POST_PHOTOS: function LOAD_POST_PHOTOS(_ref8, params) {
      var state, commit;
      return regeneratorRuntime.async(function LOAD_POST_PHOTOS$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              state = _ref8.state, commit = _ref8.commit;
              _context8.prev = 1;
              _context8.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/post_photos.js', {
                params: params
              }).then(function (response) {
                if (response.data.length > 0) {
                  commit("setPhotosPostsArray", [].concat(_toConsumableArray(state.photosPostsArray), _toConsumableArray(response.data)));
                }
              }));

            case 4:
              _context8.next = 9;
              break;

            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8["catch"](1);

              if (_context8.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              } else {
                console.log(_context8.t0);
              }

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[1, 6]]);
    }
  },
  namespaced: true
};
exports.postsMyPageStore = postsMyPageStore;