import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/pages/MainPage";
import MyPage from "@/pages/MyPage";
import MessagePage from "@/pages/MessagePage";
import FriendsPage from "@/pages/FriendsPage";
import GalleryPage from "@/pages/GalleryPage";
import NewsPage from "@/pages/NewsPage";

const routes = [
    { path: "/", component: MainPage},
    { path: "/mypage", component: MyPage },
    { path: "/message", component: MessagePage},
    { path: "/friends", component: FriendsPage},
    { path: "/gallery", component: GalleryPage},
    { path: "/news", component: NewsPage},
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;