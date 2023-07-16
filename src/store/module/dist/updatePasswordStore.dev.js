"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePasswordStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var updatePasswordStore = {
  state: function state() {
    return {
      modulePassword: false,
      //показывать/не показывать окно с изменение пароля
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
      double_new_password: false,
      //проверка на идентичность нового пароля и new_password_confirmation
      errorPassword: "",
      //ошибка возникающая при вводе неверного старого пароля
      modalSave: true //информационное окошко после сохранения пароля

    };
  },
  getters: {
    getModulePassword: function getModulePassword(state) {
      return state.modulePassword;
    },
    getNew_password: function getNew_password(state) {
      return state.new_password;
    },
    getNew_password_confirmation: function getNew_password_confirmation(state) {
      return state.new_password_confirmation;
    },
    getOld_password: function getOld_password(state) {
      return state.old_password;
    },
    getDouble_new_password: function getDouble_new_password(state) {
      return state.double_new_password;
    },
    getUserEmail: function getUserEmail(state, _, rootState) {
      return rootState.authorizationStore.user.email;
    },
    getUserID: function getUserID(state, _, rootState) {
      return rootState.authorizationStore.user.userID;
    },
    getErrorPassword: function getErrorPassword(state) {
      return state.errorPassword;
    },
    getModalSave: function getModalSave(state) {
      return state.modalSave;
    }
  },
  mutations: {
    setOpenChangePassword: function setOpenChangePassword(state) {
      state.modulePassword = true;
    },
    setCloseChangePassword: function setCloseChangePassword(state) {
      state.modulePassword = false;
      state.new_password = "", state.new_password_confirmation = "", state.old_password = "", state.double_password = false, state.errorPassword = "", state.modalSave = true;
    },
    setCheckNewPassword: function setCheckNewPassword(state) {
      state.double_new_password = state.new_password !== state.new_password_confirmation;
    },
    setOld_password: function setOld_password(state, password) {
      state.old_password = password;
    },
    setNew_password: function setNew_password(state, password) {
      state.new_password = password;
    },
    setNew_password_confirmation: function setNew_password_confirmation(state, password) {
      state.new_password_confirmation = password;
    },
    setErrorPassword: function setErrorPassword(state, error) {
      state.errorPassword = error;
    },
    setModalSave: function setModalSave(state, bool) {
      state.modalSave = bool;
    }
  },
  actions: {
    //обновление пароля
    updatePasword: function updatePasword(_ref, user) {
      var getters = _ref.getters;
      return new Promise(function (resolve, reject) {
        var url = "http://localhost:8000/password";
        user.id = getters.getUserID;
        (0, _axios["default"])({
          url: url,
          data: user,
          method: 'PUT'
        }).then(function (resp) {
          resolve(resp);
        })["catch"](function (err) {
          reject(err.response.data);
        });
      });
    },
    //обновление пароля при входе в свой профиль
    UPDATE_PASSWORD_RESTORE: function UPDATE_PASSWORD_RESTORE(context, pass) {
      return new Promise(function (resolve, reject) {
        var url = "http://localhost:8000/update_password_restore";
        (0, _axios["default"])({
          url: url,
          data: pass,
          method: 'PUT'
        }).then(function (resp) {
          resolve(resp);
        })["catch"](function (err) {
          reject(err.response.data);
        });
      });
    }
  },
  namespaced: true
};
exports.updatePasswordStore = updatePasswordStore;