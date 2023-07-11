"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showFullPhotoStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_axios["default"];
var showFullPhotoStore = {
  state: function state() {
    return {
      isModalFullSize: false,
      //открытие модального окна с фото по клику на фото
      indexPhoto: 0,
      //ключ массива с фото для слайдера
      isShowFullAvaPhoto: false,
      //открытие модального окна для редактирования автарки
      isEditAva: "",
      //загрузка аватарки или ее редактирование
      postID: "",
      //номер поста в которм есть фотографии
      messageID: "" //номер сообщения в которм есть фотографии

    };
  },
  getters: {
    getIsModalFullSize: function getIsModalFullSize(state) {
      return state.isModalFullSize;
    },
    getIndexPhoto: function getIndexPhoto(state) {
      return state.indexPhoto;
    },
    getAllPhotosMyPage: function getAllPhotosMyPage(state, _, rootState) {
      return rootState.loadPhotoStore.isModalAllPhotos;
    },
    getShowFullAvaPhoto: function getShowFullAvaPhoto(state) {
      return state.isShowFullAvaPhoto;
    },
    getEditAva: function getEditAva(state) {
      return state.isEditAva;
    },
    getPostID: function getPostID(state) {
      return state.postID;
    },
    getMessageID: function getMessageID(state) {
      return state.messageID;
    }
  },
  mutations: {
    //открытие-закрытие модального окна
    setIsModalFullSize: function setIsModalFullSize(state, bool) {
      state.isModalFullSize = bool;
    },
    //получение картинки по которой кликнули
    setIndexPhoto: function setIndexPhoto(state, elem) {
      state.indexPhoto = elem;
    },
    //преход на одну картинку вперед
    setNextIndexPhoto: function setNextIndexPhoto(state) {
      state.indexPhoto += 1;
    },
    //преход на одну картинку назад
    setPrevIndexPhoto: function setPrevIndexPhoto(state) {
      state.indexPhoto -= 1;
    },
    setShowFullAvaPhoto: function setShowFullAvaPhoto(state, bool) {
      state.isShowFullAvaPhoto = bool;
    },
    setEditAva: function setEditAva(state, load) {
      state.isEditAva = load;
    },
    setPostID: function setPostID(state, id) {
      state.postID = id;
    },
    setMessageID: function setMessageID(state, id) {
      state.messageID = id;
    }
  },
  actions: {
    showFullAvaPhoto: function showFullAvaPhoto(_ref, body) {
      var commit = _ref.commit;
      commit("setShowFullAvaPhoto", body.bool);
      commit("setEditAva", body.load);
    },
    //открыте картинки по которой кликнули
    fullSizePhoto: function fullSizePhoto(_ref2, body) {
      var commit, bool, index, id;
      return regeneratorRuntime.async(function fullSizePhoto$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref2.commit;
              bool = body.bool;
              index = body.elem;
              id = body.id;
              commit("setIsModalFullSize", bool);
              commit("setIndexPhoto", index);
              commit('loadPhotoStore/setPhotoId', id, {
                root: true
              });
              document.body.style.overflow = "hidden";

            case 8:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    FULL_SIZE_PHOTO_POST: function FULL_SIZE_PHOTO_POST(_ref3, body) {
      var commit, bool, index, id;
      return regeneratorRuntime.async(function FULL_SIZE_PHOTO_POST$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref3.commit;
              bool = body.bool;
              index = body.elem;
              id = body.id;
              commit("setIsModalFullSize", bool);
              commit("setIndexPhoto", index);
              commit('loadPhotoStore/setPhotoId', id, {
                root: true
              });
              commit('setPostID', body.postID);
              document.body.style.overflow = "hidden";

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    FULL_SIZE_PHOTO_MESSAGE: function FULL_SIZE_PHOTO_MESSAGE(_ref4, body) {
      var commit, bool, index, id;
      return regeneratorRuntime.async(function FULL_SIZE_PHOTO_MESSAGE$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref4.commit;
              console.log(body);
              bool = body.bool;
              index = body.elem;
              id = body.id;
              commit("setIsModalFullSize", bool);
              commit("setIndexPhoto", index);
              commit('loadPhotoStore/setPhotoId', id, {
                root: true
              });
              commit('setMessageID', body.messageID);
              document.body.style.overflow = "hidden";

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    //закрытие картинки по которой кликнули
    closeModalFullSize: function closeModalFullSize(_ref5, bool) {
      var commit = _ref5.commit,
          getters = _ref5.getters;
      commit("setIsModalFullSize", bool);
      commit('setPostID', "");
      commit('setMessageID', "");

      if (bool === false && getters.getAllPhotosMyPage === false) {
        document.body.style.overflow = "auto";
      }
    }
  },
  namespaced: true
};
exports.showFullPhotoStore = showFullPhotoStore;