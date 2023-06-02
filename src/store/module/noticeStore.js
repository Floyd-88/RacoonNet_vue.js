// import axios from "axios";
// import SocketioService from "../../services/socketio.service";

import axios from "axios";


export const noticeStore = {

    state: () => ({
        isShowModalWindowNotice: false, //открытие модального окна с уведомлениями
        isShowModalWindowOneNotice: false, //открытие модального окна с конкретным уведомлением
        noticeTextArray: ["написал что то на вашей стене", "отметил запись на Ваше стене", "отметил Вашу фотографию", "оставил новый комментарий под Вашей записью", "оставил новый комментарий под Вашей фотографией"], //массив с текстовыми уведомлениями
        noticeArray: [], //массив с уведомлениями
        selectNotice: {}, //выбранное уведомление
        photosPostNotice: [] //массив с фотографиями из поста который показан в уведомлении
    }),
    getters: {
        getIsShowModalWindowNotice: state => state.isShowModalWindowNotice,
        getIsShowModalWindowOneNotice: state => state.isShowModalWindowOneNotice,
        noticeTextArray: state => state.noticeTextArray,
        getNoticeArray: state => state.noticeArray,
        getSelectNotice: state => state.selectNotice,
        getPhotosPostNotice: state => state.photosPostNotice,
    },

    mutations: {
        setIsShowModalWindowNotice(state, bool) {
            state.isShowModalWindowNotice = bool;

            if (bool === true) {
                document.body.style.overflow = "hidden"
            } else {
                document.body.style.overflow = "auto"
            }
        },

        setIsShowModalWindowOneNotice(state, bool) {
            state.isShowModalWindowOneNotice = bool;
        },

        setNoticeArray(state, value) {
            state.noticeArray = value;
        },

        setNoticeArrayDelete(state, id) {
            state.noticeArray = state.noticeArray.filter(notice => notice.id !== id)
        },

        setSelectNotice(state, value) {
            state.selectNotice = value;
        },

        setPhotosPostNotice(state, value) {
            state.photosPostNotice = value;
        }

    },

    actions: {
        //получение массива с уведомлениями
        async GET_NEW_NOTICE({ commit }) {
            try {
                await axios.get("http://localhost:8000/new_notice")
                    .then(function(res) {
                        // res.data.map(notice => {
                        //     if (notice.selectedGender === "woman") {
                        //         notice.text = state.noticeTextArray
                        //     }
                        // })

                        commit("setNoticeArray", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //удаление уведомления из списка
        async NOTICE_ARRAY_DELETE({ commit }, id) {
            commit("setNoticeArrayDelete", id);
            try {
                await axios.delete("http://localhost:8000/notice_delete", {
                        data: { noticeID: id }
                    })
                    .then(function(res) {
                        console.log(res.data);
                    })
            } catch (err) {
                console.log(err)
            }

        },

        //получение фотографий к посту в уведомлении
        async GET_PHOTOS_POST_NOTICE({ commit }, post_id) {
            try {
                await axios.get("http://localhost:8000/new_notice_photos", {
                        params: { post_id }
                    })
                    .then(function(res) {
                        commit("setPhotosPostNotice", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //убрать уведомление из шапки после его просмотра
        async REMOVE_COUNT_NOTICE_LIST(context, id) {
            try {
                await axios.put("http://localhost:8000/notice_remove_count", {
                        noticeID: id
                    })
                    .then(function() {})
            } catch (err) {
                console.log(err)
            }

        },

    },
    namespaced: true,
}