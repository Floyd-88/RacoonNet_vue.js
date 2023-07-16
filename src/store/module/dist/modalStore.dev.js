"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modalStore = void 0;
var modalStore = {
  state: function state() {
    return {
      modal: ""
    };
  },
  getters: {
    getModal: function getModal(state) {
      return state.modal;
    }
  },
  mutations: {
    showModalTrue: function showModalTrue(state) {
      state.modal = true;
    },
    setNotShowModalWindow: function setNotShowModalWindow(state) {
      state.modal = false;
    }
  },
  namespaced: true
};
exports.modalStore = modalStore;