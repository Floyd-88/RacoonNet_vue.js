import {createStore} from "vuex";
import {authorizationStore} from "@/store/module/authorizationStore";
import {postsMyPageStore} from "@/store/module/postsMyPageStore";

export default createStore( {
    modules: {
        authorizationStore,
        postsMyPageStore,
    }
});