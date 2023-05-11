// import axios from "axios";
// import SocketioService from "../../services/socketio.service";

import axios from "axios";


export const noticeStore = {

    state: () => ({
        isShowModalWindowNotice: false, //открытие модального окна с уведомлениями
        noticeTextArray: ["написал что то на вашей стене", "отметил запись на Ваше стене", "отметил Вашу фотографию", "оставил новый комментарий под Вашей записью", "оставил новый комментарий под Вашей фотографией"], //массив с текстовыми уведомлениями
        noticeArray: [], //массив с уведомлениями
    }),
    getters: {
        getIsShowModalWindowNotice: state => state.isShowModalWindowNotice,
        noticeTextArray: state => state.noticeTextArray,
        getNoticeArray: state => state.noticeArray
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

        setNoticeArray(state, value) {
            state.noticeArray = value;
        },

        setNoticeArrayDelete(state, id) {
            state.noticeArray = state.noticeArray.filter(notice => notice.id !== id)
        }

    },

    actions: {
        async GET_NEW_NOTICE({ commit }) {
            try {
                await axios.get("http://localhost:8000/new_notice")
                    .then(function(res) {
                        console.log(res.data);
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

        }
    },
    namespaced: true,
}