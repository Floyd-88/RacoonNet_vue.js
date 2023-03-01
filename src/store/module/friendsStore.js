import axios from "axios"

axios
export const friendsStore = {

    state: () => ({
        textBtnFfriend: "Добавить в друзья",
        isFriend: false,
    }),

    getters: {
        getTextBtnFfriend: (state) => state.textBtnFfriend,
        getIsFriend: (state) => state.isFriend
    },

    mutations: {
        setTextBtnFfriend(state, value) {
            state.textBtnFfriend = value;
        },

        setIsFriend(state, bool) {
            state.isFriend = bool;
        }
    },

    actions: {
        //добавление в друзья
        async ADD_FRIEND({ commit }, id) {
            try {
                await axios.post("http://localhost:8000/add_friend", { id })
                    .then(function(res) {
                        // console.log(res.data)
                        commit("setTextBtnFfriend", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //проверка на заявку в друзью после обновления страницы
        async CHECK_REQUEST_FRIEND({ commit }, id) {
            try {
                await axios.get("http://localhost:8000/check_request_friend", { params: { id } })
                    .then(function(res) {
                        console.log(res.data)
                        if (res.data === "Это Ваш друг") {
                            commit("setIsFriend", true)
                        } else {
                            commit("setTextBtnFfriend", res.data);
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        }
    },


    namespaced: true,
}