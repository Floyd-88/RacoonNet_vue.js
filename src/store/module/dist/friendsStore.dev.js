"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.friendsStore = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

_axios["default"];
var friendsStore = {
  state: function state() {
    return {
      textBtnFfriend: "Добавить в друзья",
      isFriend: false,
      titleFriend: "Друзья",
      //заголовок на странице друзей
      usersFriendsMe: [],
      //пользователи которые хотят дружить со мной
      usersFriendsFromMe: [],
      //пользователи с которыми я хочу дружить
      usersMyFriends: [],
      //массив моих друзей
      usersMyFriendsFilter: [],
      //массив моих друзей отфильтрованный по имени
      searchUsersFriends: [],
      //массив пользователй при поиске
      isFriendShow: "allFriends",
      //какую вкладку показывать - все друзья или заявки
      nameFriendUser: "",
      //имя друга в поле поиска среди друзей 
      countFriends: 0,
      //с какого пользователя начинать вести счет
      limitFriends: 8,
      // лимит пользователей на странице
      searchFriend: {
        name: "",
        //имя в фильтре поиска
        surname: "",
        //фамилия в фильтре поиска
        country: "",
        //страна в фильтре поиска
        city: "",
        //город в фильтре поиска
        ageAfter: "",
        //возраст от в фильтре поиска
        ageBefore: "",
        //возраст до в фильтре поиска
        sex: "" //пол в фильтре поиска

      },
      isUIloadMoreFriends: false,
      //отображать индикатор загрузки
      isNotFriends: false //отображать надпись об отсутствии друзей

    };
  },
  getters: {
    getTextBtnFfriend: function getTextBtnFfriend(state) {
      return state.textBtnFfriend;
    },
    getIsFriend: function getIsFriend(state) {
      return state.isFriend;
    },
    getTitleFriend: function getTitleFriend(state) {
      return state.titleFriend;
    },
    // getNotificationAddFriends: (state) => state.notificationAddFriends,
    getUsersFriendsMe: function getUsersFriendsMe(state) {
      return state.usersFriendsMe;
    },
    getUsersMyFriends: function getUsersMyFriends(state) {
      return state.usersMyFriends;
    },
    getUsersMyFriendsFilter: function getUsersMyFriendsFilter(state) {
      return state.usersMyFriendsFilter.filter(function (users) {
        return users.name.toLowerCase().includes(state.nameFriendUser.toLowerCase()) || users.surname.toLowerCase().includes(state.nameFriendUser.toLowerCase());
      });
    },
    getSearchUsersFriends: function getSearchUsersFriends(state) {
      return state.searchUsersFriends;
    },
    getIsFriendShow: function getIsFriendShow(state) {
      return state.isFriendShow;
    },
    getUsersFriendsFromMe: function getUsersFriendsFromMe(state) {
      return state.usersFriendsFromMe;
    },
    getNameFriendUser: function getNameFriendUser(state) {
      return state.nameFriendUser;
    },
    getSearchFriendName: function getSearchFriendName(state) {
      return state.searchFriend.name;
    },
    getSearchFriendSurname: function getSearchFriendSurname(state) {
      return state.searchFriend.surname;
    },
    getSearchFriendCountry: function getSearchFriendCountry(state) {
      return state.searchFriend.country;
    },
    getSearchFriendCity: function getSearchFriendCity(state) {
      return state.searchFriend.city;
    },
    getSearchFriendAgeAfter: function getSearchFriendAgeAfter(state) {
      return state.searchFriend.ageAfter;
    },
    getSearchFriendAgeBefore: function getSearchFriendAgeBefore(state) {
      return state.searchFriend.ageBefore;
    },
    getSearchFriendSex: function getSearchFriendSex(state) {
      return state.searchFriend.sex;
    },
    getCountFriends: function getCountFriends(state) {
      return state.countFriends;
    },
    getIsUIloadMoreFriends: function getIsUIloadMoreFriends(state) {
      return state.isUIloadMoreFriends;
    },
    getIsNotFriends: function getIsNotFriends(state) {
      return state.isNotFriends;
    }
  },
  mutations: {
    setTextBtnFfriend: function setTextBtnFfriend(state, value) {
      state.textBtnFfriend = value;
    },
    //показываеть или нет кнопку добавить в друзья
    setIsFriend: function setIsFriend(state, bool) {
      state.isFriend = bool;
    },
    // setNotificationAddFriends(state, value) {
    //     state.notificationAddFriends = value
    // },
    setTitleFriend: function setTitleFriend(state, value) {
      state.titleFriend = value;
    },
    setUsersFriendsMe: function setUsersFriendsMe(state, users) {
      state.usersFriendsMe = users;
    },
    setUsersMyFriends: function setUsersMyFriends(state, users) {
      state.usersMyFriends = users;
    },
    setUsersMyFriendsFilter: function setUsersMyFriendsFilter(state, users) {
      state.usersMyFriendsFilter = users;
    },
    setSearchUsersFriends: function setSearchUsersFriends(state, users) {
      state.searchUsersFriends = users;
    },
    setIsFriendShow: function setIsFriendShow(state, value) {
      state.isFriendShow = value;
    },
    setUsersFriendsFromMe: function setUsersFriendsFromMe(state, users) {
      state.usersFriendsFromMe = users;
    },
    setNameFriendUser: function setNameFriendUser(state, value) {
      state.nameFriendUser = value;
    },
    setSearchFriendName: function setSearchFriendName(state, value) {
      state.searchFriend.name = value;
    },
    setSearchFriendSurname: function setSearchFriendSurname(state, value) {
      state.searchFriend.surname = value;
    },
    setSearchFriendCountry: function setSearchFriendCountry(state, value) {
      state.searchFriend.country = value;
    },
    setSearchFriendCity: function setSearchFriendCity(state, value) {
      state.searchFriend.city = value;
    },
    setSearchFriendAgeAfter: function setSearchFriendAgeAfter(state, value) {
      state.searchFriend.ageAfter = value;
    },
    setSearchFriendAgeBefore: function setSearchFriendAgeBefore(state, value) {
      state.searchFriend.ageBefore = value;
    },
    setSearchFriendSex: function setSearchFriendSex(state, value) {
      state.searchFriend.sex = value;
    },
    setSearchFriend: function setSearchFriend(state) {
      state.searchFriend.name = "";
      state.searchFriend.surname = "";
      state.searchFriend.country = "";
      state.searchFriend.city = "";
      state.searchFriend.ageAfter = "";
      state.searchFriend.ageBefore = "";
      state.searchFriend.sex = "";
    },
    setCountFriends: function setCountFriends(state, count) {
      state.countFriends += count;
    },
    setCountFriendsNull: function setCountFriendsNull(state) {
      state.countFriends = 0;
    },
    setIsUIloadMoreFriends: function setIsUIloadMoreFriends(state, bool) {
      state.isUIloadMoreFriends = bool;
    },
    setIsNotFriends: function setIsNotFriends(state, bool) {
      state.isNotFriends = bool;
    }
  },
  actions: {
    //добавление в друзья
    ADD_FRIEND: function ADD_FRIEND(_ref, id) {
      var commit, dispatch, date;
      return regeneratorRuntime.async(function ADD_FRIEND$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit, dispatch = _ref.dispatch;
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 4:
              date = _context.sent;
              _context.next = 7;
              return regeneratorRuntime.awrap(_axios["default"].post("http://localhost:8000/add_friend", {
                id: id,
                date: date
              }).then(function (res) {
                console.log(res.data);
                commit("setTextBtnFfriend", res.data);
              }));

            case 7:
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);
              console.log(_context.t0);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 9]]);
    },
    //принять заявку в друзья
    AGREE_ADD_FRIEND_USER: function AGREE_ADD_FRIEND_USER(_ref2, value) {
      var getters, commit, dispatch, date;
      return regeneratorRuntime.async(function AGREE_ADD_FRIEND_USER$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              getters = _ref2.getters, commit = _ref2.commit, dispatch = _ref2.dispatch;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(dispatch("postsMyPageStore/newDate", null, {
                root: true
              }));

            case 4:
              date = _context2.sent;
              _context2.next = 7;
              return regeneratorRuntime.awrap(_axios["default"].put("http://localhost:8000/add_friends_me", {
                id: value.id,
                userID: value.userID,
                date: date
              }).then(function () {
                var users = getters.getUsersFriendsMe.filter(function (user) {
                  return user.id != value.id;
                });
                commit("setUsersFriendsMe", users);
                dispatch("GET_USER_MY_FRIENDS", JSON.parse(localStorage.getItem('user')).userID);
              }));

            case 7:
              _context2.next = 12;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              console.log(_context2.t0);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 9]]);
    },
    //проверка на заявку в друзья после обновления страницы
    CHECK_REQUEST_FRIEND: function CHECK_REQUEST_FRIEND(_ref3, id) {
      var commit;
      return regeneratorRuntime.async(function CHECK_REQUEST_FRIEND$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit;
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/check_request_friend", {
                params: {
                  id: id
                }
              }).then(function (res) {
                if (res.data === "Это Ваш друг") {
                  commit("setIsFriend", false);
                } else if (res.data === "Добавить в друзья") {
                  commit("setIsFriend", true);
                  commit("setTextBtnFfriend", res.data);
                } else if (res.data === "Заявка отправлена") {
                  commit("setTextBtnFfriend", res.data);
                  commit("setIsFriend", true);
                } else if (res.data === "Рассмотреть заявку") {
                  commit("setTextBtnFfriend", res.data);
                  commit("setIsFriend", true);
                } else {
                  commit("setTextBtnFfriend", res.data);
                }
              }));

            case 4:
              _context3.next = 9;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](1);
              console.log(_context3.t0);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //получить пользователей отправивших мне заявку в друзья
    GET_USER_ADD_FRIENDS_ME: function GET_USER_ADD_FRIENDS_ME(_ref4) {
      var commit, state;
      return regeneratorRuntime.async(function GET_USER_ADD_FRIENDS_ME$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              commit = _ref4.commit, state = _ref4.state;
              _context4.next = 3;
              return regeneratorRuntime.awrap(commit("setIsNotFriends", false));

            case 3:
              _context4.next = 5;
              return regeneratorRuntime.awrap(commit("setIsUIloadMoreFriends", true));

            case 5:
              _context4.prev = 5;
              _context4.next = 8;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/add_friends_me", {
                params: {
                  _count: state.countFriends,
                  _limit: state.limitFriends
                }
              }).then(function (res) {
                commit("setIsUIloadMoreFriends", false);
                commit("setUsersFriendsMe", [].concat(_toConsumableArray(state.usersFriendsMe), _toConsumableArray(res.data)));

                if (res.data.length > 0) {
                  commit("setCountFriends", 8);
                } else {
                  commit("setIsNotFriends", true);
                }
              }));

            case 8:
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](5);
              console.log(_context4.t0);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[5, 10]]);
    },
    //получить пользователей котрым я отправил заявку в друзья
    GET_USER_ADD_FRIENDS_FROM_ME: function GET_USER_ADD_FRIENDS_FROM_ME(_ref5) {
      var commit, state;
      return regeneratorRuntime.async(function GET_USER_ADD_FRIENDS_FROM_ME$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              commit = _ref5.commit, state = _ref5.state;
              _context5.next = 3;
              return regeneratorRuntime.awrap(commit("setIsNotFriends", false));

            case 3:
              _context5.next = 5;
              return regeneratorRuntime.awrap(commit("setIsUIloadMoreFriends", true));

            case 5:
              _context5.prev = 5;
              _context5.next = 8;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/add_friends_from_me", {
                params: {
                  _count: state.countFriends,
                  _limit: state.limitFriends
                }
              }).then(function (res) {
                commit("setIsUIloadMoreFriends", false);
                commit("setUsersFriendsFromMe", [].concat(_toConsumableArray(state.usersFriendsFromMe), _toConsumableArray(res.data)));

                if (res.data.length > 0) {
                  commit("setCountFriends", 8);
                } else {
                  commit("setIsNotFriends", true);
                }
              }));

            case 8:
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](5);
              console.log(_context5.t0);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[5, 10]]);
    },
    //получить пользователей которые являются моими друзьями
    GET_USER_MY_FRIENDS: function GET_USER_MY_FRIENDS(_ref6, id) {
      var commit, state;
      return regeneratorRuntime.async(function GET_USER_MY_FRIENDS$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              commit = _ref6.commit, state = _ref6.state;
              _context6.next = 3;
              return regeneratorRuntime.awrap(commit("setIsNotFriends", false));

            case 3:
              _context6.next = 5;
              return regeneratorRuntime.awrap(commit("setIsUIloadMoreFriends", true));

            case 5:
              _context6.prev = 5;
              _context6.next = 8;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/my_friends", {
                params: {
                  id: id,
                  _count: state.countFriends,
                  _limit: state.limitFriends
                }
              }).then(function (res) {
                commit("setIsUIloadMoreFriends", false);
                commit("setUsersMyFriends", [].concat(_toConsumableArray(state.usersMyFriends), _toConsumableArray(res.data)));
                commit("setUsersMyFriendsFilter", [].concat(_toConsumableArray(state.usersMyFriendsFilter), _toConsumableArray(res.data)));

                if (res.data.length > 0) {
                  commit("setCountFriends", 8);
                } else {
                  commit("setIsNotFriends", true);
                }
              }));

            case 8:
              _context6.next = 13;
              break;

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](5);
              console.log(_context6.t0);

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[5, 10]]);
    },
    //удалить друга
    DELETE_FRIEND: function DELETE_FRIEND(_ref7, params) {
      var state, commit;
      return regeneratorRuntime.async(function DELETE_FRIEND$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              state = _ref7.state, commit = _ref7.commit;
              _context7.prev = 1;
              _context7.next = 4;
              return regeneratorRuntime.awrap(_axios["default"]["delete"]("http://localhost:8000/delete_friends", {
                data: {
                  params: params
                }
              }).then(function () {
                if (state.usersMyFriends) {
                  var friends = state.usersMyFriends.filter(function (user) {
                    return user.id !== params.id;
                  });
                  commit("setUsersMyFriends", friends);
                }

                if (state.usersMyFriendsFilter) {
                  var friendsFilter = state.usersMyFriendsFilter.filter(function (user) {
                    return user.id !== params.id;
                  });
                  commit("setUsersMyFriendsFilter", friendsFilter);
                }

                if (state.usersFriendsMe) {
                  var friendsMe = state.usersFriendsMe.filter(function (user) {
                    return user.id !== params.id;
                  });
                  commit("setUsersFriendsMe", friendsMe);
                }

                if (state.usersFriendsFromMe) {
                  var friendsFromMe = state.usersFriendsFromMe.filter(function (user) {
                    return user.id !== params.id;
                  });
                  commit("setUsersFriendsFromMe", friendsFromMe);
                }
              }));

            case 4:
              _context7.next = 9;
              break;

            case 6:
              _context7.prev = 6;
              _context7.t0 = _context7["catch"](1);
              console.log(_context7.t0);

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[1, 6]]);
    },
    //поиск пользователей
    SEARCH_USERS_FRIENDS: function SEARCH_USERS_FRIENDS(_ref8, params) {
      var commit, state;
      return regeneratorRuntime.async(function SEARCH_USERS_FRIENDS$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              commit = _ref8.commit, state = _ref8.state;
              _context8.next = 3;
              return regeneratorRuntime.awrap(commit("setUsersMyFriends", []));

            case 3:
              _context8.next = 5;
              return regeneratorRuntime.awrap(commit("setUsersMyFriendsFilter", []));

            case 5:
              _context8.next = 7;
              return regeneratorRuntime.awrap(commit("setIsNotFriends", false));

            case 7:
              _context8.next = 9;
              return regeneratorRuntime.awrap(commit("setIsUIloadMoreFriends", true));

            case 9:
              _context8.prev = 9;
              //если возрастной диапазон не указан, по умолчанию от 0 до 100
              !params.ageAfter ? params.ageAfter = 0 : params.ageAfter;
              !params.ageBefore ? params.ageBefore = 100 : params.ageBefore;
              params._count = state.countFriends, params._limit = state.limitFriends;
              _context8.next = 15;
              return regeneratorRuntime.awrap(commit("setTitleFriend", "Поиск друзей"));

            case 15:
              _context8.next = 17;
              return regeneratorRuntime.awrap(commit("setIsFriendShow", 'allFriends'));

            case 17:
              _context8.next = 19;
              return regeneratorRuntime.awrap(_axios["default"].get("http://localhost:8000/search_friends", {
                params: params
              }).then(function (res) {
                commit("setIsUIloadMoreFriends", false);
                commit("setSearchUsersFriends", [].concat(_toConsumableArray(state.searchUsersFriends), _toConsumableArray(res.data)));

                if (res.data.length > 0) {
                  commit("setCountFriends", 8);
                } else {
                  commit("setIsNotFriends", true);
                }
              }));

            case 19:
              _context8.next = 24;
              break;

            case 21:
              _context8.prev = 21;
              _context8.t0 = _context8["catch"](9);
              console.log(_context8.t0);

            case 24:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[9, 21]]);
    }
  },
  namespaced: true
};
exports.friendsStore = friendsStore;