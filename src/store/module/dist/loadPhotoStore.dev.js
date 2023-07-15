"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPhotoStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _socketio = _interopRequireDefault(require("../../services/socketio.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import router from "@/router/router";
// const controller = new AbortController();
// const signal = controller.signal;
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
      likesPhoto: "",
      //количество лайков фото
      isLoadPhotoPost: "",
      //загрузка фотографий в пост
      isLoadPhotoMessage: "",
      //загрузка фотографий в сообщения
      isNotPhoto: false //отображать надпись об отсутствии фотографий

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
    },
    getIsNotPhoto: function getIsNotPhoto(state) {
      return state.isNotPhoto;
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
    setLimitAllPhotoRemove: function setLimitAllPhotoRemove(state) {
      state.limitAllPhoto = 8;
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
    },
    setIsNotPhoto: function setIsNotPhoto(state, bool) {
      state.isNotPhoto = bool;
    }
  },
  actions: {
    //загрузка автарки
    addAvaServer: function addAvaServer(_ref, img) {
      var getters = _ref.getters,
          commit = _ref.commit;
      var nameAva = getters.getUser.ava;
      commit("authorizationStore/setUserAva", 'ava/ava_1.jpg', {
        root: true
      });
      return new Promise(function (resolve, reject) {
        var paramsPhoto = {
          img: img,
          nameAva: nameAva,
          id: getters.getUser.userID
        };

        _axios["default"].post('http://localhost:8000/upload_ava', paramsPhoto, {
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
          }); // commit("authorizationStore/setUserAva", res.data.ava, {
          //     root: true
          // })

          commit("setProgressLoadPhoto", 0);
          resolve(res);
        })["catch"](function (err) {
          reject(err);
        });
      });
    },
    //загрузка картинок на сервер
    addPhotoServer: function addPhotoServer(_ref2, body) {
      var getters, commit, state, rootGetters, dispatch, formData, i, file, posts, messages;
      return regeneratorRuntime.async(function addPhotoServer$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getters = _ref2.getters, commit = _ref2.commit, state = _ref2.state, rootGetters = _ref2.rootGetters, dispatch = _ref2.dispatch;
              //сокрытие кнопки загрузить картинки после ее нажатия
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
              } //проверяем отправлены ли фотографии через пост или сообщения


              if (!state.isLoadPhotoPost) {
                _context.next = 13;
                break;
              }

              _context.next = 9;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/addPost", state.isLoadPhotoPost, {
                root: true
              }));

            case 9:
              posts = rootGetters["postsMyPageStore/getPosts"];
              formData.append('postIDLast', posts[0].id);
              _context.next = 18;
              break;

            case 13:
              if (!state.isLoadPhotoMessage) {
                _context.next = 18;
                break;
              }

              _context.next = 16;
              return regeneratorRuntime.awrap(dispatch("messageStore/WRITE_MESSAGE_USER", {
                addresseeID: body.addresseeID,
                isPhoto: state.isLoadPhotoMessage
              }, {
                root: true
              }));

            case 16:
              messages = rootGetters["messageStore/getArrayMessages"];
              formData.append('dialogIDLast', messages[messages.length - 1].id);

            case 18:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                _axios["default"].post('http://localhost:8000/upload_photo', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },
                  onUploadProgress: function onUploadProgress(ProgressEvent) {
                    var progress = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%";
                    commit("setProgressLoadPhoto", progress);
                  }
                }).then(function (resp) {
                  commit("setIsModalLoadPhoto", false);
                  commit("setProgressLoadPhoto", 0);
                  commit("setIsLoadPhotoPost", false);
                  commit("setIsLoadPhotoMessage", false);
                  resolve(resp.data);
                })["catch"](function (err) {
                  if (_axios["default"].isCancel(err)) {
                    //удаление пустого поста при отмене загрузки фотогрфий
                    if (state.isLoadPhotoPost) {
                      commit('postsMyPageStore/setModulePost', {
                        task: 'remove',
                        id: formData.get('postIDLast')
                      }, {
                        root: true
                      });
                      dispatch('postsMyPageStore/removePost', null, {
                        root: true
                      });
                      commit('postsMyPageStore/setRemovePost', +formData.get('postIDLast'), {
                        root: true
                      });
                    }

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

            case 19:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    //остановка загрузки картиновк на сервер
    cancelLoadPhoto: function cancelLoadPhoto(_ref3) {
      var commit = _ref3.commit,
          dispatch = _ref3.dispatch;
      dispatch('cancelLoadAxios/CANCEL_PENDING_REQUESTS', null, {
        root: true
      });
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
              commit("setIsNotPhoto", false);
              _context2.next = 5;
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

                if (response.data.length === 0) {
                  commit("setIsNotPhoto", true);
                }
              }));

            case 5:
              _context2.next = 11;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](1);

              if (_context2.t0.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
              }

              console.log(_context2.t0);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 7]]);
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
              if (!(rootGetters["galleryStore/getArrayFilterPhotos"].length <= 1)) {
                _context3.next = 17;
                break;
              }

              _context3.next = 16;
              return regeneratorRuntime.awrap(commit("showFullPhotoStore/setIsModalFullSize", false, {
                root: true
              }));

            case 16:
              document.body.style.overflow = "auto";

            case 17:
              if (body.photoID) {
                _context3.next = 28;
                break;
              }

              _context3.prev = 18;
              _context3.next = 21;
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

            case 21:
              _context3.next = 26;
              break;

            case 23:
              _context3.prev = 23;
              _context3.t0 = _context3["catch"](18);
              console.log(_context3.t0);

            case 26:
              _context3.next = 36;
              break;

            case 28:
              _context3.prev = 28;
              _context3.next = 31;
              return regeneratorRuntime.awrap(_axios["default"].put('http://localhost:8000/remove_photo_post', {
                idPhoto: getters.getIdPhoto,
                id: getters.getUser.userID
              }).then(function () {
                commit("postsMyPageStore/removePhotosPostsArray", getters.getIdPhoto, {
                  root: true
                });
                commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                  root: true
                }); // commit("galleryStore/removeArrayFilterPhotos", getters.getIdPhoto, {
                //     root: true
                // });
              }));

            case 31:
              _context3.next = 36;
              break;

            case 33:
              _context3.prev = 33;
              _context3.t1 = _context3["catch"](28);
              console.log(_context3.t1);

            case 36:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[18, 23], [28, 33]]);
    },
    //удаление аватрки
    removeAvaPhoto: function removeAvaPhoto(_ref7) {
      var getters, commit, nameAva;
      return regeneratorRuntime.async(function removeAvaPhoto$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              getters = _ref7.getters, commit = _ref7.commit;
              nameAva = getters.getUser.ava;
              commit("authorizationStore/setUserAva", 'ava/ava_1.jpg', {
                root: true
              });
              _context4.prev = 3;
              _context4.next = 6;
              return regeneratorRuntime.awrap(_axios["default"].put('http://localhost:8000/remove_ava_photo', {
                id: getters.getUser.userID,
                nameAva: nameAva
              }).then(function () {
                // commit("authorizationStore/setUserAva", res.data.user.ava, {
                //     root: true
                // });
                commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                  root: true
                });
                commit("setModulePhotoRemove", false);
              }));

            case 6:
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](3);
              console.log(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[3, 8]]);
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
                commit("setLikesPhoto", response.data); //отправляем уведомление адресату без перезагрузки страницы

                if (response.data.flag) {
                  _socketio["default"].sendNotice(response.data.likes.userID);
                }
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
    } //загрузить последнии добавленные фотографии через пост
    // async LOAD_LAST_PHOTOS(context, photos) {
    //     return new Promise((resolve, reject) => {
    //         axios.get('http://localhost:8000/load_last_photos', {
    //                 params: photos
    //             })
    //             .then((response) => {
    //                 resolve(response)
    //             }).catch((err) => {
    //                 reject(err)
    //             })
    //     })
    // },
    //удаление изображение с сервера
    // async DELETE_PHOTO_SERVER(context, nameAva) {
    //     try {
    //         if (nameAva !== "ava/ava_1.jpg") {
    //             axios.delete('http://localhost:8000/delete_photo_server', {
    //                 params: {
    //                     photo: nameAva,
    //                 }
    //             })
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },

  },
  namespaced: true
};
exports.loadPhotoStore = loadPhotoStore;