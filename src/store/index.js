import { createStore } from "vuex"
import { authorizationStore } from "@/store/module/authorizationStore"
import { postsMyPageStore } from "@/store/module/postsMyPageStore"
import { modalStore } from "@/store/module/modalStore"
import { editProfileStore } from "@/store/module/editProfileStore"
import { updatePasswordStore } from "@/store/module/updatePasswordStore"
import { registrationStore } from "@/store/module/registrationStore"
import { removeUserStore } from "@/store/module/removeUserStore"
import { loadPhotoStore } from "@/store/module/loadPhotoStore"
import { showFullPhotoStore } from "@/store/module/showFullPhotoStore"
import { messageStore } from "@/store/module/messageStore"
import { friendsStore } from "@/store/module/friendsStore"
import { galleryStore } from "@/store/module/galleryStore"
import { commentsPost } from "@/store/module/commentsPost"
import { commentsPhoto } from "@/store/module/commentsPhoto"
import { feedBackStore } from "@/store/module/feedBackStore"



export default createStore({
    modules: {
        authorizationStore,
        postsMyPageStore,
        modalStore,
        editProfileStore,
        updatePasswordStore,
        registrationStore,
        removeUserStore,
        loadPhotoStore,
        showFullPhotoStore,
        messageStore,
        friendsStore,
        galleryStore,
        commentsPost,
        commentsPhoto,
        feedBackStore
    }
});