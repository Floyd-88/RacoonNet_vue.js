"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrationStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var registrationStore = {
  modulRegister: false,
  state: function state() {
    return {
      userRegister: {
        name: "",
        surname: "",
        email: "",
        password: "",
        password_confirmation: "",
        country: "",
        city: "",
        is_admin: null,
        selectedDay: "",
        selectedMonth: "",
        selectedYear: "",
        selectedGender: ""
      },
      double_email: false,
      double_password: false,
      //проверка на идентичность нового пароля и new_password_confirmation
      arrMonth: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    };
  },
  getters: {
    getModulRegister: function getModulRegister(state) {
      return state.modulRegister;
    },
    getUserRegister: function getUserRegister(state) {
      return state.userRegister;
    },
    getDouble_email: function getDouble_email(state) {
      return state.double_email;
    },
    getDouble_password: function getDouble_password(state) {
      return state.double_password;
    },
    getArrMonth: function getArrMonth(state) {
      return state.arrMonth;
    },
    //в поле option доступны года от 1900 до текущего
    years: function years() {
      var year = new Date().getFullYear();
      return Array.from({
        length: year - 1900
      }, function (value, index) {
        return year - index;
      });
    }
  },
  mutations: {
    setModulRegister: function setModulRegister(state, bool) {
      state.modulRegister = bool;
    },
    //проверка задублирование эл. почты
    setDouble_email: function setDouble_email(state, bool) {
      state.double_email = bool;
    },
    //проверка на совпадения пароля и проверочного пароля
    setCheckPassword: function setCheckPassword(state) {
      state.double_password = state.userRegister.password !== state.userRegister.password_confirmation;
    },
    setUserRegister: function setUserRegister(state) {
      state.userRegister.name = "";
      state.userRegister.surname = "";
      state.userRegister.email = "";
      state.userRegister.password = "", state.userRegister.password_confirmation = "";
      state.userRegister.country = "";
      state.userRegister.city = "";
      state.userRegister.is_admin = null;
      state.userRegister.selectedDay = "";
      state.userRegister.selectedMonth = "";
      state.userRegister.selectedYear = "";
      state.userRegister.selectedGender = "";
    },
    //двухсторонне связывание
    setUserRegisterName: function setUserRegisterName(state, name) {
      state.userRegister.name = name;
    },
    setUserRegisterSurname: function setUserRegisterSurname(state, surname) {
      state.userRegister.surname = surname;
    },
    setUserRegisterCountry: function setUserRegisterCountry(state, country) {
      state.userRegister.country = country;
    },
    setUserRegisterEmail: function setUserRegisterEmail(state, email) {
      state.userRegister.email = email;
    },
    setUserRegisterPassword: function setUserRegisterPassword(state, password) {
      state.userRegister.password = password;
    },
    setUserRegisterPasswordConfirmation: function setUserRegisterPasswordConfirmation(state, password_confirmation) {
      state.userRegister.password_confirmation = password_confirmation;
    },
    setUserRegisterCity: function setUserRegisterCity(state, city) {
      state.userRegister.city = city;
    },
    setUserRegisterYear: function setUserRegisterYear(state, year) {
      state.userRegister.selectedYear = year;
    },
    setUserRegisterMonth: function setUserRegisterMonth(state, month) {
      state.userRegister.selectedMonth = month;
    },
    setUserRegisterDay: function setUserRegisterDay(state, day) {
      state.userRegister.selectedDay = day;
    },
    setUserRegisterGender: function setUserRegisterGender(state, gender) {
      state.userRegister.selectedGender = gender;
    }
  },
  actions: {
    //регистрация нового юзера
    register: function register(_ref, user) {
      var commit = _ref.commit;
      return new Promise(function (resolve, reject) {
        commit('authorizationStore/auth_request', 'loading', {
          root: true
        });
        var url = "http://localhost:8000/register";

        if (user.is_admin === '1') {
          url = "http://localhost:8000/register-admin";
        }

        (0, _axios["default"])({
          url: url,
          data: user,
          method: 'POST'
        }).then(function (resp) {
          var token = resp.data.token;
          var refreshToken = resp.data.refreshToken;
          var user = resp.data.user;

          if (token !== null && user !== null) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            commit('authorizationStore/auth_success', token, {
              root: true
            });
            resolve(resp);
          }
        })["catch"](function (err) {
          commit('authorizationStore/auth_error', null, {
            root: true
          });
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          reject(err);
        });
      });
    }
  },
  namespaced: true
};
exports.registrationStore = registrationStore;