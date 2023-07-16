"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editProfileStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var editProfileStore = {
  state: function state() {
    return {
      editingUser: JSON.parse(localStorage.getItem('user')) || {},
      //получаем данные юзера для внесения изменений в профиль (данные изменения не влияют на информацию о пользователе до того как юзер не нажмет кнопку сохранить изменения)
      modulEditProfile: false,
      changeAva: ""
    };
  },
  getters: {
    getEditingUser: function getEditingUser(state) {
      return state.editingUser;
    },
    getUser: function getUser(state, _, rootState) {
      return rootState.authorizationStore.user;
    },
    getModulEditProfile: function getModulEditProfile(state) {
      return state.modulEditProfile;
    },
    getChangeAva: function getChangeAva(state) {
      return state.changeAva;
    }
  },
  mutations: {
    setModulEditProfile: function setModulEditProfile(state, bool) {
      state.modulEditProfile = bool;
      document.body.style.overflow = "hidden";

      if (bool === false) {
        document.body.style.overflow = "auto";
      }
    },
    //записываем в state данные при авторизации или регистрации для возможности манипулировать этим при редкатировании профиля
    setEditingUser: function setEditingUser(state, user) {
      state.editingUser.name = user.name;
      state.editingUser.surname = user.surname;
      state.editingUser.country = user.country;
      state.editingUser.email = user.email;
      state.editingUser.city = user.city;
      state.editingUser.year_user = user.year_user;
      state.editingUser.month_user = user.month_user;
      state.editingUser.day_user = user.day_user;
      state.editingUser.selectedGender = user.selectedGender;
    },
    // редактирование профиля пользователя
    setName: function setName(state, name) {
      state.editingUser.name = name;
    },
    setSurname: function setSurname(state, surname) {
      state.editingUser.surname = surname;
    },
    setCountry: function setCountry(state, country) {
      state.editingUser.country = country;
    },
    setEmail: function setEmail(state, email) {
      state.editingUser.email = email;
    },
    setCity: function setCity(state, city) {
      state.editingUser.city = city;
    },
    setYear: function setYear(state, year) {
      state.editingUser.year_user = year;
    },
    setMonth: function setMonth(state, month) {
      state.editingUser.month_user = month;
    },
    setDay: function setDay(state, day) {
      state.editingUser.day_user = day;
    },
    setGender: function setGender(state, gender) {
      state.editingUser.selectedGender = gender;
    },
    setChangeAva: function setChangeAva(state, img) {
      state.changeAva = img;
    }
  },
  actions: {
    closeModalEditProfile: function closeModalEditProfile(_ref) {
      var commit = _ref.commit,
          getters = _ref.getters;
      commit("setModulEditProfile", false);
      commit('setEditingUser', getters.getUser); //если изменения небыли внесены возвращаем полям старые значения при закрытии окна
    },
    //редактирование профиля
    updateProfile: function updateProfile(_ref2, user) {
      var commit = _ref2.commit,
          getters = _ref2.getters;
      return new Promise(function (resolve, reject) {
        var url = "http://localhost:8000/editProfile";
        user.id = getters.getUser.userID;
        (0, _axios["default"])({
          url: url,
          data: user,
          method: 'PUT'
        }).then(function (resp) {
          var user = resp.data.user;

          if (user !== null) {
            localStorage.setItem('user', JSON.stringify(user));
            commit("setModulEditProfile", false);
            resolve(resp);
          }
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  },
  namespaced: true
};
exports.editProfileStore = editProfileStore;