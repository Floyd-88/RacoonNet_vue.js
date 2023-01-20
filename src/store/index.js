// import Vue from 'vue'
// import Vuex from 'vuex'
import {createStore} from "vuex";
import {authorizationStore} from "./module/authorizationStore";
// import {postsMyPageStore} from "./module//postsMyPageStore";

export default createStore( {
    modules: {
        authorizationStore,
        // postsMyPageStore,
    }
});