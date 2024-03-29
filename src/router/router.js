import {
    createRouter,
    createWebHistory
} from "vue-router";

import MainPage from "@/pages/MainPage";
import MyPage from "@/pages/MyPage";
import MessagePage from "@/pages/MessagePage";
import FriendsPage from "@/pages/FriendsPage";
import GalleryPage from "@/pages/GalleryPage";
import NewsPage from "@/pages/NewsPage";
import AdminNet from "@/components/authorizationUser/AdminNet";
import NotFound from "@/components/authorizationUser/NotFound";
import AllUsersMessages from "@/components/MessagePage/AllUsersMessages";
import DialogUser from "@/components/MessagePage/DialogUser";
import ResetPassword from "@/components/authorizationUser/ResetPassword";

import store from "@/store/index";

const routes = [{
        path: "/",
        component: MainPage,
        name: "mainpage",
        meta: {
            guest: true
        }
    },
    {
        path: "/id:id",
        component: MyPage,
        name: "mypage",
        meta: {
            partGuest: true
        },
    },
    {
        path: "/message",
        component: MessagePage,
        name: "messagepage",
        meta: {
            requiresAuth: true
        },

        children: [{
                path: "",
                component: AllUsersMessages,
            },
            {
                path: "id:id",
                component: DialogUser,
                name: "dialoguser",
                props: {
                    id: {
                        type: [String, Number],
                        default: null,
                    },
                },
            },
        ],
    },
    {
        path: "/friends",
        component: FriendsPage,
        name: "friendspage",
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/gallery",
        component: GalleryPage,
        name: "gallerypage",
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/news",
        component: NewsPage,
        name: "newspage",
        meta: {
            requiresAuth: true
        }
    },
    // {
    //     path: "/secure",
    //     component: SecureNet,
    //     name: "secure",
    //     meta: {
    //         requiresAuth: true
    //     }
    // },
    {
        path: "/admin",
        component: AdminNet,
        name: "admin",
        meta: {
            requiresAuth: true,
            is_admin: true
        }
    },
    {
        path: "/reset-password",
        component: ResetPassword,
        name: "resetpassword",
        meta: {
            // requiresAuth: true,
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notFound",
        component: NotFound,
        meta: {
            guest3: true
        }
    }
];

const router = createRouter({
    routes,
    history: createWebHistory(),

    scrollBehavior() {
        return {
            top: 0
        }
    },
});


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.partGuest)) {
        if (localStorage.getItem('token')) {
            next()
            return
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token')) {
            store.dispatch('cancelLoadAxios/CANCEL_PENDING_REQUESTS')
            next()
        } else {
            next('/')
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('token') === null) {
            next()
        } else {
            let id = JSON.parse(localStorage.getItem('user')).userID
            next(`/id${id}`)
        }
    } else {
        next()
    }
});

export default router