"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPhotoStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import router from "@/router/router";
var loadPhotoStore = {
  state: function state() {
    return {
      myPhotosMyPage: [],
      //фото которые показаны при загрузки страницы
      allPhotos: [],
      //все фото юзера
      isModalAllPhotos: false,
      //показывать-скрывать модальное окно со всеми фото
      isModalLoadPhoto: false,
      //показывать-скрывать модальное окно с загрузкой фото
      messageLoadPhoto: "",
      //сообщение возникающее при ошибки загрузки фото
      arrayLoadImage: [],
      //фотографии выбранные в окне загрузки
      urlsImages: [],
      //массив с исходными кодами картинок для их отображения в превью блоке
      idPhoto: "",
      //id фото из базы данных
      isModulePhotoRemove: false,
      //показывать-скрывать модальное окно с подтвержением удаления фото
      limitAllPhoto: 8,
      //количество фотографий отображаемых каждый раз при прокрутке вниз
      avaPhoto: "",
      progressLoadPhoto: 0,
      request: null,
      //прерывание запроса
      likesPhoto: "",
      //количество лайков фото
      isLoadPhotoPost: "",
      //загрузка фотографий в пост
      isLoadPhotoMessage: "" //загрузка фотографий в сообщения

    };
  },
  getters: {
    getUser: function getUser(state, _, rootState) {
      return rootState.authorizationStore.user;
    },
    getMyPhotosMyPage: function getMyPhotosMyPage(state) {
      return state.myPhotosMyPage;
    },
    getAllPhotosMyPage: function getAllPhotosMyPage(state) {
      return state.allPhotos;
    },
    getIsModalAllPhotos: function getIsModalAllPhotos(state) {
      return state.isModalAllPhotos;
    },
    getIsModalLoadPhoto: function getIsModalLoadPhoto(state) {
      return state.isModalLoadPhoto;
    },
    getMessageLoadPhoto: function getMessageLoadPhoto(state) {
      return state.messageLoadPhoto;
    },
    getArrayLoadImage: function getArrayLoadImage(state) {
      return state.arrayLoadImage;
    },
    getUrlsImages: function getUrlsImages(state) {
      return state.urlsImages;
    },
    getIdPhoto: function getIdPhoto(state) {
      return state.idPhoto;
    },
    getModulePhotoRemove: function getModulePhotoRemove(state) {
      return state.isModulePhotoRemove;
    },
    getLimitAllPhoto: function getLimitAllPhoto(state) {
      return state.limitAllPhoto;
    },
    getAvaPhoto: function getAvaPhoto(state) {
      return state.avaPhoto;
    },
    getProgressLoadPhoto: function getProgressLoadPhoto(state) {
      return state.progressLoadPhoto;
    },
    getLikesPhoto: function getLikesPhoto(state) {
      return state.likesPhoto;
    },
    getIsLoadPhotoPost: function getIsLoadPhotoPost(state) {
      return state.isLoadPhotoPost;
    },
    getIsLoadPhotoMessage: function getIsLoadPhotoMessage(state) {
      return state.isLoadPhotoMessage;
    }
  },
  mutations: {
    setMyPhotosMyPage: function setMyPhotosMyPage(state, value) {
      state.myPhotosMyPage = value;
    },
    setAllMyPhotosMyPage: function setAllMyPhotosMyPage(state, value) {
      state.allPhotos = value;
    },
    setIsModalLoadPhoto: function setIsModalLoadPhoto(state, bool) {
      state.isModalLoadPhoto = bool;

      if (bool === true) {
        document.body.style.overflow = "hidden";
      }

      if (bool === false) {
        state.messageLoadPhoto = "";
        state.urlsImages = [];
        document.body.style.overflow = "auto";
      }
    },
    setIsModalAllPhotos: function setIsModalAllPhotos(state, bool) {
      state.isModalAllPhotos = bool;
      document.body.style.overflow = "hidden";

      if (bool === false) {
        state.limitAllPhoto = 8;
        document.body.style.overflow = "auto";
      }
    },
    setArrayLoadImage: function setArrayLoadImage(state, value) {
      state.arrayLoadImage = value;
    },
    removeArrayLoadImage: function removeArrayLoadImage(state, name) {
      state.arrayLoadImage = state.arrayLoadImage.filter(function (elem) {
        return elem.name != name;
      });
    },
    setUrlsImages: function setUrlsImages(state, value) {
      state.urlsImages.push(value);
    },
    removeUrlsImages: function removeUrlsImages(state, name) {
      state.urlsImages = state.urlsImages.filter(function (elem) {
        return elem.name != name;
      });
    },
    setMessageLoadPhoto: function setMessageLoadPhoto(state, value) {
      state.messageLoadPhoto = value;
    },
    //удаление картинки из массива
    removeAllPhotos: function removeAllPhotos(state, id) {
      state.allPhotos = state.allPhotos.filter(function (photo) {
        return photo.id !== id;
      });
      state.myPhotosMyPage = state.myPhotosMyPage.filter(function (photo) {
        return photo.id !== id;
      });
    },
    setPhotoId: function setPhotoId(state, id) {
      state.idPhoto = id;
    },
    setModulePhotoRemove: function setModulePhotoRemove(state, bool) {
      state.isModulePhotoRemove = bool;
    },
    setLimitAllPhoto: function setLimitAllPhoto(state, count) {
      state.limitAllPhoto += count;
    },
    setAvaPhoto: function setAvaPhoto(state, value) {
      state.avaPhoto = value;
    },
    setProgressLoadPhoto: function setProgressLoadPhoto(state, value) {
      state.progressLoadPhoto = value;
    },
    setLikesPhoto: function setLikesPhoto(state, value) {
      state.likesPhoto = value;
    },
    setIsLoadPhotoPost: function setIsLoadPhotoPost(state, bool) {
      state.isLoadPhotoPost = bool;
    },
    setIsLoadPhotoMessage: function setIsLoadPhotoMessage(state, bool) {
      state.isLoadPhotoMessage = bool;
    }
  },
  actions: {
    //загрузка автарки
    addAvaServer: function addAvaServer(_ref, img) {
      var getters = _ref.getters,
          commit = _ref.commit;

      _axios["default"].post('http://localhost:8000/upload_ava', {
        img: img,
        nameAva: getters.getUser.ava,
        id: getters.getUser.userID
      }, {
        onUploadProgress: function onUploadProgress(ProgressEvent) {
          var progress = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%";
          commit("setProgressLoadPhoto", progress);
        }
      }).then(function (res) {
        commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
          root: true
        });
        commit("setIsModalLoadPhoto", false);
        commit("showFullPhotoStore/setIsModalFullSize", false, {
          root: true
        });
        commit("authorizationStore/setUserAva", res.data.ava, {
          root: true
        });
        commit("setProgressLoadPhoto", 0); // commit("setIsModalLoadPhoto", false);
        // commit("showFullPhotoStore/setIsModalFullSize", false, {
        //     root: true
        // });
        // commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
        //     root: true
        // });
        // router.push(`/id${getters.getUser.userID}/info`)
        // this.$router.push('/')
        // window.location.href = `/id${getters.getUser.userID}`;
      })["catch"](function (err) {
        console.log(err);
      });
    },
    //загрузка картинок на сервер
    addPhotoServer: function addPhotoServer(_ref2, body) {
      var getters, commit, state, rootGetters, dispatch, axiosSource, formData, i, file, posts, messages;
      return regeneratorRuntime.async(function addPhotoServer$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getters = _ref2.getters, commit = _ref2.commit, state = _ref2.state, rootGetters = _ref2.rootGetters, dispatch = _ref2.dispatch;
              //остановка загрузки картинок
              axiosSource = _axios["default"].CancelToken.source();
              state.request = {
                cancel: axiosSource.cancel
              }; //сокрытие кнопки загрузить картинки после ее нажатия

              body.event.target.style.opacity = '0';
              formData = new FormData();

              for (i = 0; i < getters.getArrayLoadImage.length; i++) {
                file = getters.getArrayLoadImage[i];
                formData.append('files[' + i + ']', file);
              }

              formData.append('id', body.addresseeID); // formData.append('id', JSON.parse(localStorage.getItem('user')).userID);
              //добавляем категорию к фотографии если она есть

              if (rootGetters["galleryStore/getSelectedLoadThemaPhoto"]) {
                formData.append('category', rootGetters["galleryStore/getSelectedLoadThemaPhoto"]);
              } //проверяем отправлены ли фотографии через пост


              if (!state.isLoadPhotoPost) {
                _context.next = 15;
                break;
              }

              _context.next = 11;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/addPost", state.isLoadPhotoPost, {
                root: true
              }));

            case 11:
              posts = rootGetters["postsMyPageStore/getPosts"];
              formData.append('postIDLast', posts[0].id);
              _context.next = 21;
              break;

            case 15:
              if (!state.isLoadPhotoMessage) {
                _context.next = 21;
                break;
              }

              _context.next = 18;
              return regeneratorRuntime.awrap(dispatch("messageStore/WRITE_MESSAGE_USER", {
                addresseeID: body.addresseeID,
                isPhoto: state.isLoadPhotoMessage
              }, {
                root: true
              }));

            case 18:
              messages = rootGetters["messageStore/getArrayMessages"];
              console.log(messages);
              formData.append('dialogIDLast', messages[messages.length - 1].id);

            case 21:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                _axios["default"].post('http://localhost:8000/upload_photo', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },
                  cancelToken: axiosSource.token,
                  onUploadProgress: function onUploadProgress(ProgressEvent) {
                    var progress = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%";
                    commit("setProgressLoadPhoto", progress);
                  }
                }).then(function (resp) {
                  commit("setIsModalLoadPhoto", false);
                  commit("setProgressLoadPhoto", 0);
                  commit("setIsLoadPhotoPost", false);
                  commit("setIsLoadPhotoMessage", false);
                  resolve(resp.data); // window.location.href = `/id${JSON.parse(getters.getUser.userID)}`;
                })["catch"](function (err) {
                  if (_axios["default"].isCancel(err)) {
                    console.info("Загрузка фотографий была прервана");
                    return;
                  }

                  commit("setIsLoadPhotoPost", false);
                  commit("setIsLoadPhotoMessage", false);
                  commit("setArrayLoadImage", []);
                  commit("setUrlsImages", []);
                  commit("setMessageLoadPhoto", err);
                  reject(err);
                });
              }));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    //остановка загрузки картиновк на сервер
    cancelLoadPhoto: function cancelLoadPhoto(_ref3) {
      var state = _ref3.state,
          commit = _ref3.commit;

      if (state.request) {
        state.request.cancel();
      }

      commit("setIsModalLoadPhoto", false);
      commit("setProgressLoadPhoto", 0);
    },
    //удаление картинки на предпросмотре перед загрузкой
    removePreviewImage: function removePreviewImage(_ref4, name) {
      var commit = _ref4.commit;
      commit("removeArrayLoadImage", name);
      commit("removeUrlsImages", name);
    },
    //получить все фотографии
    loadAllPhotos: function loadAllPhotos(_ref5, id) {
      var commit;
      return regeneratorRuntime.async(function loadAllPhotos$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref5.commit;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get('http://localhost:8000/upload_all_photo', {
                params: {
                  id: id
                }
              }).then(function (response) {
                commit("setMyPhotosMyPage", response.data);
                commit("setAllMyPhotosMyPage", response.data);
                commit("galleryStore/setArrayFilterPhotos", response.data, {
                  root: true
                });
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
    //удаление картинки
    removePhoto: function removePhoto(_ref6, body) {
      var commit, state, getters, rootGetters;
      return regeneratorRuntime.async(function removePhoto$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref6.commit, state = _ref6.state, getters = _ref6.getters, rootGetters = _ref6.rootGetters;
              commit("setModulePhotoRemove", false); //если все картинки закончились

              if (!(state.allPhotos.length <= 1)) {
                _context3.next = 7;
                break;
              }

              _context3.next = 5;
              return regeneratorRuntime.awrap(commit("showFullPhotoStore/setIsModalFullSize", false, {
                root: true
              }));

            case 5:
              _context3.next = 7;
              return regeneratorRuntime.awrap(commit("setIsModalAllPhotos", false));

            case 7:
              if (!(body.countPhotoPost <= 1 && rootGetters["postsMyPageStore/getPosts"].length > 0)) {
                _context3.next = 13;
                break;
              }

              _context3.next = 10;
              return regeneratorRuntime.awrap(commit("showFullPhotoStore/setIsModalFullSize", false, {
                root: true
              }));

            case 10:
              _context3.next = 12;
              return regeneratorRuntime.awrap(commit("showFullPhotoStore/setPostID", "", {
                root: true
              }));

            case 12:
              document.body.style.overflow = "auto";

            case 13:
              if (body.photoID) {
                _context3.next = 24;
                break;
              }

              _context3.prev = 14;
              _context3.next = 17;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://localhost:8000/remove_photo', {
                params: {
                  idPhoto: getters.getIdPhoto,
                  id: getters.getUser.userID,
                  namePhoto: body.name
                }
              }).then(function () {
                commit("removeAllPhotos", getters.getIdPhoto);
                commit("postsMyPageStore/removePhotosPostsArray", getters.getIdPhoto, {
                  root: true
                });
                commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                  root: true
                });
                commit("galleryStore/removeArrayFilterPhotos", getters.getIdPhoto, {
                  root: true
                });
              }));

            case 17:
              _context3.next = 22;
              break;

            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](14);
              console.log(_context3.t0);

            case 22:
              _context3.next = 32;
              break;

            case 24:
              _context3.prev = 24;
              _context3.next = 27;
              return regeneratorRuntime.awrap(_axios["default"].put('http://localhost:8000/remove_photo_post', {
                idPhoto: getters.getIdPhoto,
                id: getters.getUser.userID
              }).then(function () {
                commit("postsMyPageStore/removePhotosPostsArray", getters.getIdPhoto, {
                  root: true
                });
                commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                  root: true
                });
                commit("galleryStore/removeArrayFilterPhotos", getters.getIdPhoto, {
                  root: true
                });
              }));

            case 27:
              _context3.next = 32;
              break;

            case 29:
              _context3.prev = 29;
              _context3.t1 = _context3["catch"](24);
              console.log(_context3.t1);

            case 32:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[14, 19], [24, 29]]);
    },
    //удаление аватрки
    removeAvaPhoto: function removeAvaPhoto(_ref7) {
      var getters, commit;
      return regeneratorRuntime.async(function removeAvaPhoto$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              getters = _ref7.getters, commit = _ref7.commit;
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].put('http://localhost:8000/remove_ava_photo', {
                id: getters.getUser.userID,
                nameAva: getters.getUser.ava
              }).then(function (res) {
                commit("authorizationStore/setUserAva", res.data.user.ava, {
                  root: true
                });
                commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                  root: true
                });
                commit("setModulePhotoRemove", false);
                window.location.href = '/';
              }));

            case 4:
              _context4.next = 9;
              break;

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](1);
              console.log(_context4.t0);

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //лайкнуть фото
    SAVE_LIKE_COUNT_PHOTO: function SAVE_LIKE_COUNT_PHOTO(_ref8, photoID) {
      var commit, dispatch;
      return regeneratorRuntime.async(function SAVE_LIKE_COUNT_PHOTO$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              commit = _ref8.commit, dispatch = _ref8.dispatch;
              _context5.prev = 1;
              _context5.next = 4;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 4:
              photoID.date = _context5.sent;
              _context5.next = 7;
              return regeneratorRuntime.awrap(_axios["default"].post('http://localhost:8000/likes_photo', photoID).then(function (response) {
                commit("setLikesPhoto", response.data);
              }));

            case 7:
              _context5.next = 12;
              break;

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](1);
              console.error(_context5.t0);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[1, 9]]);
    }
  },
  namespaced: true
};
exports.loadPhotoStore = loadPhotoStore;