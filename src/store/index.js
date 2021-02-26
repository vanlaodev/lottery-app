import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";
import { autoSaveDataToFile } from "../utils/native-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
    anniversary: null,
    prizeCount: null,
    guests: [],
    excludedGuests: [], // mainly for exlcude the redrawn guest
    winners: [],
    mainOverlay: false,
    logs: [],
    globalSnackbar: {},
    sounds: {
      drumRoll: new Audio(
        require("@/assets/Drum Roll Gaming Sound Effect HD.mp3")
      ),
    },
  },
  getters: {
    eventTitle: (state) => {
      return `郵電局${state.anniversary}週年晚宴抽獎環節`;
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
    saveData: (state) => {
      return {
        anniversary: state.anniversary,
        prizeCount: state.prizeCount,
        guests: state.guests,
        excludedGuests: state.excludedGuests,
        winners: state.winners,
        logs: state.logs,
      };
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
    updateLogs(state, logs) {
      state.logs = logs;
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
    addExcludedGuest(state, excludedGuest) {
      state.excludedGuests.push({
        guest: excludedGuest.guest,
        prize: excludedGuest.prize,
      });
    },
    updateMainOverlay(state, show) {
      state.mainOverlay = show;
    },
    updateGlobalSnackbar(state, globalSnackbar) {
      state.globalSnackbar = globalSnackbar;
    },
    appendLog(state, msg) {
      state.logs.push({
        msg: msg,
        time: new Date(),
      });
    },
    clearLogs(state) {
      state.logs = [];
    },
  },
  actions: {
    ensureAllSoundsReady({ state }) {
      const promises = [];
      for (const soundKey in state.sounds) {
        const sound = state.sounds[soundKey];
        const promise = new Promise((resolve, reject) => {
          try {
            const cb = () => {
              sound.removeEventListener("canplaythrough", cb);
              resolve();
            };
            sound.addEventListener("canplaythrough", cb);
          } catch (err) {
            reject(err);
          }
        });
        promises.push(promise);
      }
      return Promise.all(promises);
    },
    showGlobalErrorSnackbar({ commit }, error) {
      commit("updateGlobalSnackbar", {
        show: true,
        msg: `發生錯誤：${error}`,
        timeout: 30000,
        color: "error",
      });
    },
    async loadSaveData({ dispatch }, data) {
      await dispatch("updateAnniversary", data.data.anniversary);
      await dispatch("updatePrizeCount", data.data.prizeCount);
      await dispatch("updateGuests", data.data.guests ?? []);
      await dispatch("updateExcludedGuests", data.data.excludedGuests ?? []);
      await dispatch("updateWinners", data.data.winners ?? []);
      await dispatch("updateLogs", data.data.logs ?? []);
    },
    async loadOrInitializeStates({ commit }) {
      commit("updateAnniversary", await localforage.getItem("anniversary"));
      commit("updatePrizeCount", await localforage.getItem("prizeCount"));
      commit("updateGuests", (await localforage.getItem("guests")) ?? []);
      commit(
        "updateExcludedGuests",
        (await localforage.getItem("excludedGuests")) ?? []
      );
      commit("updateWinners", (await localforage.getItem("winners")) ?? []);
      commit("updateLogs", (await localforage.getItem("logs")) ?? []);
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
    async newWinner({ commit, state, dispatch }, winner) {
      commit("newWinner", winner);
      await localforage.setItem("winners", state.winners);
      await dispatch(
        "appendLog",
        `New winner: prize=${winner.prize}, guest=${winner.guest.staffNo}/${
          winner.guest.nameZh ? winner.guest.nameZh : winner.guest.nameEn
        }`
      );
    },
    async redrawWinner({ commit, state, dispatch }, winner) {
      commit("redrawWinner", winner);
      await localforage.setItem("winners", state.winners);
      await dispatch(
        "appendLog",
        `Redraw: prize=${winner.prize}, guest=${winner.guest.staffNo}/${
          winner.guest.nameZh ? winner.guest.nameZh : winner.guest.nameEn
        }`
      );
      commit("addExcludedGuest", {
        guest: winner.guest,
        prize: winner.prize,
      });
      await localforage.setItem("excludedGuests", state.excludedGuests);
    },
    async appendLog({ commit, state }, msg) {
      commit("appendLog", msg);
      await localforage.setItem("logs", state.logs);
    },
    async clearLogs({ commit, state }) {
      commit("clearLogs");
      await localforage.setItem("logs", state.logs);
    },
    async updateLogs({ commit }, logs) {
      await localforage.setItem("logs", logs);
      commit("updateLogs", logs);
    },
    async setup({ dispatch, getters }, payload) {
      await dispatch("updateAnniversary", payload.anniversary);
      await dispatch("updatePrizeCount", payload.prizeCount);
      await dispatch("updateGuests", payload.guests);
      await dispatch("updateExcludedGuests", []);
      await dispatch("updateWinners", []);

      if (!getters.needSetup) {
        autoSaveDataToFile(getters.saveData);
      }

      await dispatch("clearLogs");
      await dispatch(
        "appendLog",
        `Setup: anniversary=${payload.anniversary}, prizeCount=${payload.prizeCount}, guests=${payload.guests.length}`
      );
    },
  },
  modules: {},
});
