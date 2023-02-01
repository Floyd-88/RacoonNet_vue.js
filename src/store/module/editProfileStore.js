import axios from "axios"

export const editProfileStore = {

    state: () => ({
        editingUser: JSON.parse(localStorage.getItem('user')) || {}, //получаем данные юзера для внесения изменений в профиль (данные изменения не влияют на информацию о пользователе до того как юзер не нажмет кнопку сохранить изменения)
        modulEditProfile: false,
    }),
    getters: {
        getEditingUser: (state) => state.editingUser,
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,
        getModulEditProfile: (state) => state.modulEditProfile,
    },

    mutations: {

        setModulEditProfile(state, bool) {
            state.modulEditProfile = bool;
            document.body.style.overflow = "hidden"

            if (bool === false) {
                document.body.style.overflow = "auto"
            }
        },

        //записываем в state данные при авторизации или регистрации для возможно манипулировать этими при редкатировании профиля
        setEditingUser(state, user) {
            state.editingUser.name = user.name
            state.editingUser.surname = user.surname
            state.editingUser.country = user.country
            state.editingUser.email = user.email
            state.editingUser.city = user.city
            state.editingUser.year_user = user.year_user
            state.editingUser.month_user = user.month_user
            state.editingUser.day_user = user.day_user
            state.editingUser.selectedGender = user.selectedGender
        },

        // редактирование профиля пользователя
        setName(state, name) {
            state.editingUser.name = name;
        },
        setSurname(state, surname) {
            state.editingUser.surname = surname;
        },
        setCountry(state, country) {
            state.editingUser.country = country;
        },
        setEmail(state, email) {
            state.editingUser.email = email;
        },
        setCity(state, city) {
            state.editingUser.city = city;
        },
        setYear(state, year) {
            state.editingUser.year_user = year;
        },
        setMonth(state, month) {
            state.editingUser.month_user = month;
        },
        setDay(state, day) {
            state.editingUser.day_user = day;
        },
        setGender(state, gender) {
            state.editingUser.selectedGender = gender;
        },

    },

    actions: {

        // showModalEditProfile({ commit }) {
        //     commit("setModulEditProfile", true);
        //     // commit("modalStore/showModalTrue", null, { root: true });

        // },



        //редактирование профиля
        updateProfile({ getters }, user) {
            return new Promise((resolve, reject) => {

                let url = "http://localhost:8000/editProfile";
                user.id = getters.getUserID;

                axios({
                        url: url,
                        data: user,
                        method: 'PUT'
                    })
                    .then(resp => {
                        const user = resp.data.user;
                        if (user !== null) {
                            localStorage.setItem('user', JSON.stringify(user));
                            window.location.href = '/';
                        }
                    })
                    .catch(err => {
                        // commit('auth_error', err);
                        reject(err.response.data);
                    })
            })
        },

    },

    namespaced: true,
}