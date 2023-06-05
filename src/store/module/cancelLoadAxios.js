export const cancelLoadAxios = {
    strict: true,
    state: {
        cancelTokens: [], //массив отмененных запросов
    },

    getters: {
        cancelTokens(state) {
            return state.cancelTokens;
        }
    },

    mutations: {
        setCancelTokens(state, token) {
            state.cancelTokens.push(token);
        },

        setCancelTokensClear(state) {
            state.cancelTokens = [];
        }
    },

    actions: {
        //отмена запросов на сервер
        async CANCEL_PENDING_REQUESTS({
            state,
            commit
        }) {
            // return new Response((resolve, reject) => {
            //     try {
            state.cancelTokens.forEach((request) => {
                if (request.cancel) {
                    request.cancel();
                }
            })
            commit('setCancelTokensClear');
            // resolve();
            //     } catch (err) {
            //         reject(err)
            //     }
            // })
        }
    },

    namespaced: true
}