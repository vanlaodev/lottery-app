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
    excludedGuests: [],
    winners: []
  },
  getters: {
    needSetup: state => {
      return !state.anniversary || !state.prizeCount || !state.guests;
    },
    guestsCanBeDrawn: state => {
      return state.guests.filter(x => !state.winners.map(w => w.guest).includes(x) && !state.excludedGuests.includes(x));
    },
    nextPrize: state => {
      const drawnPrizes = state.winners.map(w => w.prize);
      const prizeList = [];
      for (let p = 1; p <= state.prizeCount; ++p) prizeList.push(p);
      const availablePrizeList = prizeList.filter(p => !drawnPrizes.includes(p)).reverse();
      return availablePrizeList.length > 0 ? availablePrizeList[0] : null;
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
    },
    newWinner(state, winner) {
      state.winners.push(winner);
    }
  },
  actions: {
    async loadOrInitializeStates({
      commit,
      // state,
      // getters
    }) {
      commit('updateAnniversary', await localforage.getItem('anniversary'));
      commit('updatePrizeCount', await localforage.getItem('prizeCount'));
      commit('updateGuests', await localforage.getItem('guests') ?? []);

      /* let fakeWinners = [];
      for (let i = state.prizeCount; i >= 20; --i) {
        fakeWinners.push({
          prize: i,
          guest: getters.guestsCanBeDrawn[Math.floor(Math.random() * getters.guestsCanBeDrawn.length)]
        })
        commit('updateWinners', fakeWinners);
      } */

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
    },
    async newWinner({
      commit,
      state
    }, winner) {
      commit('newWinner', winner);
      await localforage.setItem('winners', state.winners)
    }
  },
  modules: {}
});