import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      admin: null,
    },
    mutations: {
      login(state, payload) {
        state.admin = payload;
      },
    },
  });
};

export default createStore;
