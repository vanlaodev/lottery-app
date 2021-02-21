import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initialized: false,
    anniversary: null,
    prizeCount: null,
    guests: [],
    winners: []
  },
  getters: {
    needSetup: state => {
      return !state.anniversary || !state.prizeCount || !state.guests;
    }
  },
  mutations: {
    updateAnniversary(state, anniversary) {
      state.anniversary = anniversary;
    },
    updatePrizeCount(state, prizeCount) {
      state.prizeCount = prizeCount;
    },
    updateGuests(state, guests) {
      state.guests = guests;
    },
    updateWinners(state, winners) {
      state.winners = winners;
    },
    setInitialized(state) {
      state.initialized = true;
    }
  },
  actions: {
    async loadOrInitializeStates({
      commit
    }) {
      commit('updateAnniversary', await localforage.getItem('anniversary'));
      commit('updatePrizeCount', await localforage.getItem('prizeCount'));
      commit('updateGuests', await localforage.getItem('guests') ?? []);
      commit('updateWinners', await localforage.getItem('winners') ?? []);
      commit('setInitialized');
    },
    async updateAnniversary({
      commit
    }, anniversary) {
      await localforage.setItem('anniversary', anniversary)
      commit('updateAnniversary', anniversary);
    },
    async updatePrizeCount({
      commit
    }, prizeCount) {
      await localforage.setItem('prizeCount', prizeCount)
      commit('updatePrizeCount', prizeCount);
    },
    async updateGuests({
      commit
    }, guests) {
      await localforage.setItem('guests', guests)
      commit('updateGuests', guests);
    },
    async updateWinners({
      commit
    }, winners) {
      await localforage.setItem('winners', winners)
      commit('updateWinners', winners);
    }
  },
  modules: {}
});