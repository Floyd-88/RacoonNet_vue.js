import { createRouter, createWebHistory } from "vue-router";

// import Vue from 'vue'
// import Router from 'vue-router'
// import store from "@/store/store";

import MainPage from "@/pages/MainPage";
import MyPage from "@/pages/MyPage";
import MessagePage from "@/pages/MessagePage";
import FriendsPage from "@/pages/FriendsPage";
import GalleryPage from "@/pages/GalleryPage";
import NewsPage from "@/pages/NewsPage";
// import LoginNet from "@/components/LoginNet";
// import RegisterNet from "@/components/RegisterNet";
import AdminNet from "@/components/authorizationUser/AdminNet";
// import SecureNet from "@/components/SecureNet";
import NotFound from "@/components/authorizationUser/NotFound";

import MyPageContent from "@/components/MyPage/MyPageContent";


// import PhotoMyPage from "@/components/MyPage/PhotoMyPage";
// import AddPost from "@/components/MyPage/AddPost";
// import PostMyPage from "@/components/MyPage/PostMyPage";
// import MyFriends from "@/components/MyPage/MyFriends";



// Vue.use(Router)

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
            guest: true
        },

        children: [{
            path: 'info',
            component: MyPageContent,
            meta: {
                requiresAuth: true
            },
        }]
    },

    {
        path: "/message",
        component: MessagePage,
        name: "messagepage",
        meta: {
            requiresAuth: true
        }
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
        path: "/:pathMatch(.*)*",
        name: "notFound",
        component: NotFound,
        meta: {
            guest: true
        }
    }

    // {
    //     path: "/:pathMatch(.*)*",
    //     name: "mainpage",
    //     component: MainPage,
    //     meta: {
    //         guest: true
    //     }
    // }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});






// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (localStorage.getItem('token') === null) {
//             next({
//                 path: '/',
//                 params: { nextUrl: to.fullPath } //???????????????????????????
//             })
//         } else {
//             let user = JSON.parse(localStorage.getItem('user'))
//             if (to.matched.some(record => record.meta.is_admin)) {
//                 if (user.is_admin === 1) {
//                     next()
//                 } else {
//                     next({ name: 'mypage' })
//                 }
//             } else {
//                 next()
//             }
//         }
//     } else if (to.matched.some(record => record.meta.guest)) {
//         if (localStorage.getItem('token') === null) {
//             next()
//         } else {
//             next({ name: 'mypage' })
//         }
//     } else {
//         next()
//     }
// })

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token')) {
            next()
            return
        }
        next('/')
    } else {
        next()
    }
})

export default router;