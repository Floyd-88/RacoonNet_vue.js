"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.galleryStore = void 0;
var galleryStore = {
  state: function state() {
    return {
      selectedLoadThemaPhoto: "",
      //выбранная категория фотографии при загрузки
      isShowCat: false,
      //отображение блока с категориями
      checkedCat: [],
      //выбранные категории при фильтрации
      arrayFilterPhotos: [] //массив фотографий полсе фильтрации

    };
  },
  getters: {
    getSelectedLoadThemaPhoto: function getSelectedLoadThemaPhoto(state) {
      return state.selectedLoadThemaPhoto;
    },
    getIsShowCat: function getIsShowCat(state) {
      return state.isShowCat;
    },
    getCheckedCat: function getCheckedCat(state) {
      return state.checkedCat;
    },
    getArrayFilterPhotos: function getArrayFilterPhotos(state) {
      return state.arrayFilterPhotos;
    }
  },
  mutations: {
    setSelectedLoadThemaPhoto: function setSelectedLoadThemaPhoto(state, cat) {
      state.selectedLoadThemaPhoto = cat;
    },
    setIsShowCat: function setIsShowCat(state) {
      state.isShowCat = !state.isShowCat;
    },
    setCheckedCat: function setCheckedCat(state, value) {
      state.checkedCat = value;
    },
    setArrayFilterPhotos: function setArrayFilterPhotos(state, value) {
      state.arrayFilterPhotos = value;
    },
    removeArrayFilterPhotos: function removeArrayFilterPhotos(state, id) {
      state.arrayFilterPhotos = state.arrayFilterPhotos.filter(function (photo) {
        return photo.id !== id;
      });
    }
  },
  actions: {
    GET_PHOTO_FILTER_THEMA: function GET_PHOTO_FILTER_THEMA(_ref) {
      var state, commit, rootGetters, allPhotos, categoryPhotos;
      return regeneratorRuntime.async(function GET_PHOTO_FILTER_THEMA$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              state = _ref.state, commit = _ref.commit, rootGetters = _ref.rootGetters;
              allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
              _context.next = 4;
              return regeneratorRuntime.awrap(commit("setArrayFilterPhotos", allPhotos));

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(state.arrayFilterPhotos.filter(function (photo) {
                if (state.checkedCat.length > 0) {
                  return state.checkedCat.includes(photo.category);
                } else {
                  return photo;
                }
              }));

            case 6:
              categoryPhotos = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(commit("setArrayFilterPhotos", categoryPhotos));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    GET_PHOTO_NOT_FILTER: function GET_PHOTO_NOT_FILTER(_ref2) {
      var commit, rootGetters, allPhotos;
      return regeneratorRuntime.async(function GET_PHOTO_NOT_FILTER$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit, rootGetters = _ref2.rootGetters;
              commit("setCheckedCat", []);
              commit("setIsShowCat", false);
              commit("loadPhotoStore/setLimitAllPhotoRemove", null, {
                root: true
              });
              allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
              _context2.next = 7;
              return regeneratorRuntime.awrap(commit("setArrayFilterPhotos", allPhotos));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  },
  namespaced: true
};
exports.galleryStore = galleryStore;