"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var _authorizationStore = require("@/store/module/authorizationStore");

var _postsMyPageStore = require("@/store/module/postsMyPageStore");

var _modalStore = require("@/store/module/modalStore");

var _editProfileStore = require("@/store/module/editProfileStore");

var _updatePasswordStore = require("@/store/module/updatePasswordStore");

var _registrationStore = require("@/store/module/registrationStore");

var _removeUserStore = require("@/store/module/removeUserStore");

var _loadPhotoStore = require("@/store/module/loadPhotoStore");

var _showFullPhotoStore = require("@/store/module/showFullPhotoStore");

var _messageStore = require("@/store/module/messageStore");

var _friendsStore = require("@/store/module/friendsStore");

var _galleryStore = require("@/store/module/galleryStore");

var _commentsPost = require("@/store/module/commentsPost");

var _commentsPhoto = require("@/store/module/commentsPhoto");

var _feedBackStore = require("@/store/module/feedBackStore");

var _noticeStore = require("@/store/module/noticeStore");

var _cancelLoadAxios = require("@/store/module/cancelLoadAxios");

var _default = (0, _vuex.createStore)({
  modules: {
    authorizationStore: _authorizationStore.authorizationStore,
    postsMyPageStore: _postsMyPageStore.postsMyPageStore,
    modalStore: _modalStore.modalStore,
    editProfileStore: _editProfileStore.editProfileStore,
    updatePasswordStore: _updatePasswordStore.updatePasswordStore,
    registrationStore: _registrationStore.registrationStore,
    removeUserStore: _removeUserStore.removeUserStore,
    loadPhotoStore: _loadPhotoStore.loadPhotoStore,
    showFullPhotoStore: _showFullPhotoStore.showFullPhotoStore,
    messageStore: _messageStore.messageStore,
    friendsStore: _friendsStore.friendsStore,
    galleryStore: _galleryStore.galleryStore,
    commentsPost: _commentsPost.commentsPost,
    commentsPhoto: _commentsPhoto.commentsPhoto,
    feedBackStore: _feedBackStore.feedBackStore,
    noticeStore: _noticeStore.noticeStore,
    cancelLoadAxios: _cancelLoadAxios.cancelLoadAxios
  }
});

exports["default"] = _default;