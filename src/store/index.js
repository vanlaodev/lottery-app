import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
    anniversary: null,
    prizeCount: null,
    guests: [],
    excludedGuests: [], // mainly for exlcude the redrawn guest
    winners: [],
  },
  getters: {
    eventTitle: (state)=>{
      return `郵電局${ state.anniversary }週年晚宴抽獎環節`;
    },
    needSetup: (state) => {
      return !state.anniversary || !state.prizeCount || !state.guests;
    },
    guestsCanBeDrawn: (state) => {
      return state.guests.filter(
        (x) =>
          !state.winners.map((w) => w.guest.staffNo).includes(x.staffNo) &&
          !state.excludedGuests.map((w) => w.guest.staffNo).includes(x.staffNo)
      );
    },
    nextPrize: (state) => {
      const drawnPrizes = state.winners.map((w) => w.prize);
      const prizeList = [];
      for (let p = 1; p <= state.prizeCount; ++p) prizeList.push(p);
      const availablePrizeList = prizeList
        .filter((p) => !drawnPrizes.includes(p))
        .reverse();
      return availablePrizeList.length > 0 ? availablePrizeList[0] : null;
    },
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
    updateExcludedGuests(state, excludedGuests) {
      state.excludedGuests = excludedGuests;
    },
    setInitialized(state) {
      state.initialized = true;
    },
    newWinner(state, winner) {
      state.winners.push(winner);
    },
    redrawWinner(state, winner) {
      state.winners = state.winners.filter((w) => w.prize != winner.prize);
    },
    addExcludedGuest(state, payload) {
      state.excludedGuests.push({
        guest: payload.guest,
        prize: payload.prize,
      });
    },
  },
  actions: {
    async loadOrInitializeStates({ commit }) {
      commit("updateAnniversary", await localforage.getItem("anniversary"));
      commit("updatePrizeCount", await localforage.getItem("prizeCount"));
      commit("updateGuests", (await localforage.getItem("guests")) ?? []);
      commit(
        "updateExcludedGuests",
        (await localforage.getItem("excludedGuests")) ?? []
      );
      commit("updateWinners", (await localforage.getItem("winners")) ?? []);
      commit("setInitialized");
    },
    async updateAnniversary({ commit }, anniversary) {
      await localforage.setItem("anniversary", anniversary);
      commit("updateAnniversary", anniversary);
    },
    async updatePrizeCount({ commit }, prizeCount) {
      await localforage.setItem("prizeCount", prizeCount);
      commit("updatePrizeCount", prizeCount);
    },
    async updateGuests({ commit }, guests) {
      await localforage.setItem("guests", guests);
      commit("updateGuests", guests);
    },
    async updateWinners({ commit }, winners) {
      await localforage.setItem("winners", winners);
      commit("updateWinners", winners);
    },
    async updateExcludedGuests({ commit }, excludedGuests) {
      await localforage.setItem("excludedGuests", excludedGuests);
      commit("updateExcludedGuests", excludedGuests);
    },
    async newWinner({ commit, state }, winner) {
      commit("newWinner", winner);
      await localforage.setItem("winners", state.winners);
    },
    async redrawWinner({ commit, state }, winner) {
      commit("redrawWinner", winner);
      await localforage.setItem("winners", state.winners);
      commit("addExcludedGuest", {
        guest: winner.guest,
        prize: winner.prize,
      });
      await localforage.setItem("excludedGuests", state.excludedGuests);
    },
  },
  modules: {},
});
