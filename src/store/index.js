import {createStore} from "vuex";
import {authorizationStore} from "@/store/module/authorizationStore";
import {postsMyPageStore} from "@/store/module/postsMyPageStore";
import {modalStore} from '@/store/module/modalStore'

export default createStore( {
    modules: {
        authorizationStore,
        postsMyPageStore,
        modalStore
    }
});