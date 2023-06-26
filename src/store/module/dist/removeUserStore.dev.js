"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeUserStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var removeUserStore = {
  state: function state() {
    return {
      moduleDelete: false,
      password: ""
    };
  },
  getters: {
    getModuleDelete: function getModuleDelete(state) {
      return state.moduleDelete;
    },
    getPassword: function getPassword(state) {
      return state.password;
    },
    getUser: function getUser(state, _, rootState) {
      return rootState.authorizationStore.user;
    },
    allPhoto: function allPhoto(state, _, rootState) {
      return rootState.loadPhotoStore.allPhotos;
    },
    postPhoto: function postPhoto(state, _, rootState) {
      return rootState.postsMyPageStore.photosPostsArray;
    }
  },
  mutations: {
    setModuleDelete: function setModuleDelete(state, bool) {
      state.moduleDelete = bool;
    },
    setPassword: function setPassword(state, password) {
      state.password = password;
    }
  },
  actions: {
    removeUser: function removeUser(_ref, user) {
      var getters = _ref.getters,
          dispatch = _ref.dispatch;
      return new Promise(function (resolve, reject) {
        var url = "http://localhost:8000/delete_user"; // user.email = getters.getUser.email;

        user.id = getters.getUser.userID;
        user.allPhoto = [].concat(_toConsumableArray(getters.allPhoto), _toConsumableArray(getters.postPhoto));
        user.nameAva = getters.getUser.ava;
        console.log(user.allPhoto);
        (0, _axios["default"])({
          url: url,
          data: user,
          method: 'DELETE'
        }).then(function (resp) {
          dispatch('authorizationStore/logout', null, {
            root: true
          });
          resolve(resp);
        })["catch"](function (err) {
          reject(err.response.data);
        });
      });
    }
  },
  namespaced: true
};
exports.removeUserStore = removeUserStore;