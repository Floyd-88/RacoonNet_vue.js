"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _MainPage = _interopRequireDefault(require("@/pages/MainPage"));

var _MyPage = _interopRequireDefault(require("@/pages/MyPage"));

var _MessagePage = _interopRequireDefault(require("@/pages/MessagePage"));

var _FriendsPage = _interopRequireDefault(require("@/pages/FriendsPage"));

var _GalleryPage = _interopRequireDefault(require("@/pages/GalleryPage"));

var _NewsPage = _interopRequireDefault(require("@/pages/NewsPage"));

var _AdminNet = _interopRequireDefault(require("@/components/authorizationUser/AdminNet"));

var _NotFound = _interopRequireDefault(require("@/components/authorizationUser/NotFound"));

var _AllUsersMessages = _interopRequireDefault(require("@/components/MessagePage/AllUsersMessages"));

var _DialogUser = _interopRequireDefault(require("@/components/MessagePage/DialogUser"));

var _ResetPassword = _interopRequireDefault(require("@/components/authorizationUser/ResetPassword"));

var _index = _interopRequireDefault(require("@/store/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = [{
  path: "/",
  component: _MainPage["default"],
  name: "mainpage",
  meta: {
    guest: true
  }
}, {
  path: "/id:id",
  component: _MyPage["default"],
  name: "mypage",
  meta: {
    partGuest: true
  }
}, {
  path: "/message",
  component: _MessagePage["default"],
  name: "messagepage",
  meta: {
    requiresAuth: true
  },
  children: [{
    path: "",
    component: _AllUsersMessages["default"]
  }, {
    path: "id:id",
    component: _DialogUser["default"],
    name: "dialoguser",
    props: {
      id: {
        type: [String, Number],
        "default": null
      }
    }
  }]
}, {
  path: "/friends",
  component: _FriendsPage["default"],
  name: "friendspage",
  meta: {
    requiresAuth: true
  }
}, {
  path: "/gallery",
  component: _GalleryPage["default"],
  name: "gallerypage",
  meta: {
    requiresAuth: true
  }
}, {
  path: "/news",
  component: _NewsPage["default"],
  name: "newspage",
  meta: {
    requiresAuth: true
  }
}, // {
//     path: "/secure",
//     component: SecureNet,
//     name: "secure",
//     meta: {
//         requiresAuth: true
//     }
// },
{
  path: "/admin",
  component: _AdminNet["default"],
  name: "admin",
  meta: {
    requiresAuth: true,
    is_admin: true
  }
}, {
  path: "/reset-password",
  component: _ResetPassword["default"],
  name: "resetpassword",
  meta: {// requiresAuth: true,
  }
}, {
  path: "/:pathMatch(.*)*",
  name: "notFound",
  component: _NotFound["default"],
  meta: {
    guest3: true
  }
}];
var router = (0, _vueRouter.createRouter)({
  routes: routes,
  history: (0, _vueRouter.createWebHistory)(),
  scrollBehavior: function scrollBehavior() {
    return {
      top: 0
    };
  }
});
router.beforeEach(function (to, from, next) {
  if (to.matched.some(function (record) {
    return record.meta.partGuest;
  })) {
    if (localStorage.getItem('token')) {
      next();
      return;
    } else {
      next();
    }
  } else if (to.matched.some(function (record) {
    return record.meta.requiresAuth;
  })) {
    if (localStorage.getItem('token')) {
      _index["default"].dispatch('cancelLoadAxios/CANCEL_PENDING_REQUESTS');

      next();
    } else {
      next('/');
    }
  } else if (to.matched.some(function (record) {
    return record.meta.guest;
  })) {
    if (localStorage.getItem('token') === null) {
      next();
    } else {
      var id = JSON.parse(localStorage.getItem('user')).userID;
      next("/id".concat(id));
    }
  } else {
    next();
  }
});
var _default = router;
exports["default"] = _default;