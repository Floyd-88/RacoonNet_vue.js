"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authorizationStore = {
  state: function state() {
    return {
      status: "success",
      token: localStorage.getItem('token') || '',
      //получаем токен создаваемый при авторизации
      user: {},
      //получаем данные юзера при авторизаци
      errorLogin: "",
      //ошибка возникающая при вводе неверного пароля или почты
      isForgetPassword: true,
      //показывать ввод логина и пароля или восстановление пароля
      messageEmailPassword: "",
      //сообщение о восстановлении пароля
      isShowMenu: false //показывать бургер-меню

    };
  },
  getters: {
    getToken: function getToken(state) {
      return state.token;
    },
    getStatus: function getStatus(state) {
      return state.status;
    },
    isLoggedIn: function isLoggedIn(state) {
      return !!state.token;
    },
    //показываем кнопку выход в header
    getUser: function getUser(state) {
      return state.user;
    },
    getErrorLogin: function getErrorLogin(state) {
      return state.errorLogin;
    },
    getIsForgetPassword: function getIsForgetPassword(state) {
      return state.isForgetPassword;
    },
    getMessageEmailPassword: function getMessageEmailPassword(state) {
      return state.messageEmailPassword;
    },
    getIsShowMenu: function getIsShowMenu(state) {
      return state.isShowMenu;
    }
  },
  mutations: {
    auth_request: function auth_request(state, status) {
      state.status = status;
    },
    auth_success: function auth_success(state, token) {
      state.status = 'success';
      state.token = token;
    },
    auth_error: function auth_error(state) {
      state.status = 'error';
    },
    //при выходе обнуляем
    logout: function logout(state) {
      state.status = '';
      state.token = '';
      state.user = {};
    },
    setErrorLogin: function setErrorLogin(state, error) {
      state.errorLogin = error;
    },
    setUser: function setUser(state, user) {
      state.user = user;
    },
    setUserEdit: function setUserEdit(state, user) {
      state.user.name = user.name;
      state.user.surname = user.surname;
      state.user.city = user.city;
      state.user.country = user.country;
      state.user.day_user = user.day_user;
      state.user.month_user = user.month_user;
      state.user.year_user = user.year_user;
      state.user.selectedGender = user.selectedGender;
    },
    setUserAva: function setUserAva(state, ava) {
      state.user.ava = ava;
    },
    setUserEditProfile: function setUserEditProfile(state, bool) {
      state.user.is_editProfile = bool;
    },
    setIsForgetPassword: function setIsForgetPassword(state, bool) {
      state.isForgetPassword = bool;
    },
    setMessageEmailPassword: function setMessageEmailPassword(state, value) {
      state.messageEmailPassword = value;
    },
    setIsShowMenu: function setIsShowMenu(state) {
      state.isShowMenu = !state.isShowMenu;
    },
    setIsShowMenuClose: function setIsShowMenuClose(state) {
      state.isShowMenu = false;
    }
  },
  actions: {
    //авторизация зарегистрированого юзера
    login: function login(_ref, user) {
      var commit = _ref.commit;
      return new Promise(function (resolve, reject) {
        commit('auth_request', 'loading');
        (0, _axios["default"])({
          url: 'http://localhost:8000/login',
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
            commit('auth_success', token);
            resolve(resp);
          }
        })["catch"](function (err) {
          commit('auth_error');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          reject(err);
        });
      });
    },
    //выход из профиля
    logout: function logout(_ref2) {
      var commit = _ref2.commit;
      return new Promise(function (resolve) {
        if (localStorage.getItem('refreshToken')) {
          (0, _axios["default"])({
            url: "http://localhost:8000/del_refresh_token",
            data: {
              refreshToken: localStorage.getItem('refreshToken')
            },
            method: "POST"
          });
        }

        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        delete _axios["default"].defaults.headers.common['Authorization'];
        resolve();
      });
    },
    //получение данных по пользователю
    loadUser: function loadUser(_ref3, id) {
      var commit = _ref3.commit;
      return new Promise(function (resolve, reject) {
        commit("auth_request", "loading");
        (0, _axios["default"])({
          url: "http://localhost:8000/load_user",
          data: id,
          method: "POST"
        }).then(function (resp) {
          var user = resp.data.user;

          if (user !== null) {
            commit("setUser", user);
            commit("editProfileStore/setEditingUser", user, {
              root: true
            });
            commit("postsMyPageStore/setPostText", "", {
              root: true
            });
            commit("auth_request", "success");
            resolve(resp);
          }
        })["catch"](function (err) {
          reject(err);
        });
      });
    },
    //отправка почты для восстановление пароля
    RESSTORE_PASSWORD_USER: function RESSTORE_PASSWORD_USER(context, email) {
      return new Promise(function (resolve, reject) {
        (0, _axios["default"])({
          url: "http://localhost:8000/restore_password",
          data: email,
          method: "POST"
        }).then(function (resp) {
          resolve(resp);
        })["catch"](function (err) {
          reject(err);
        });
      });
    },
    //обновление токена
    UPDATE_TOKEN: function UPDATE_TOKEN(_ref4) {
      var _this = this;

      var commit = _ref4.commit,
          dispatch = _ref4.dispatch;
      commit("auth_request", "loading");
      return new Promise(function (resolve, reject) {
        if (localStorage.getItem('refreshToken')) {
          (0, _axios["default"])({
            url: "http://localhost:8000/refresh",
            data: {
              refreshToken: localStorage.getItem('refreshToken')
            },
            method: "POST"
          }).then(function (response) {
            var token = response.data.token;

            if (token !== null) {
              localStorage.setItem('token', token);
              commit("auth_request", "success");
              resolve(response);
            } else {
              dispatch("logout");

              _this.$router.push('/');
            }
          })["catch"](function (err) {
            if (err) {
              if (err.code !== "ERR_CANCELED") {
                dispatch("logout");
              }

              reject(err);
            }
          });
        } else {
          dispatch("logout");
        }
      });
    }
  },
  namespaced: true
};
exports.authorizationStore = authorizationStore;