import { createStore } from "vuex"
import { authorizationStore } from "@/store/module/authorizationStore"
import { postsMyPageStore } from "@/store/module/postsMyPageStore"
import { modalStore } from "@/store/module/modalStore"
import { editProfileStore } from "@/store/module/editProfileStore"
import { updatePasswordStore } from "@/store/module/updatePasswordStore"
import { registrationStore } from "@/store/module/registrationStore"
import { removeUserStore } from "@/store/module/removeUserStore"

export default createStore({
    modules: {
        authorizationStore,
        postsMyPageStore,
        modalStore,
        editProfileStore,
        updatePasswordStore,
        registrationStore,
        removeUserStore,
    }
});