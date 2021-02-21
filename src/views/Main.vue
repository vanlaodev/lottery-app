<template>
  <v-app class="fill-height">
    <v-app-bar color="primary" app dark>
      <v-app-bar-nav-icon><v-icon>mdi-cake-variant</v-icon></v-app-bar-nav-icon>
      <v-app-bar-title>郵電局{{ anniversary }}週年晚宴抽獎程式</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list flat>
          <v-list-item @click="navToManagement">
            <v-list-item-content>
              <v-list-item-title>管理</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="fill-height">
      <v-container class="fill-height" fluid>
        <v-row class="fill-height">
          <v-col class="fill-height" cols="5">
            <winner-list></winner-list>
          </v-col>
          <v-col class="fill-height" cols="7">
            <lottery></lottery>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer height="48" padless app>
      <v-col class="text-center">
        <small>{{ clock | moment("YYYY年MM月DD日 HH:mm:ss") }}</small>
      </v-col>
    </v-footer>
  </v-app>
</template>

<style>
html,
body {
  height: 100%;
  overflow-y: hidden !important;
}
</style>

<script>
import { mapState, mapGetters } from "vuex";
import WinnerList from "../components/WinnerList";
import Lottery from "../components/Lottery";

export default {
  components: { WinnerList, Lottery },
  data() {
    return {
      updateClockIntervalId: null,
      clock: null,
    };
  },
  computed: {
    ...mapState(["anniversary"]),
    ...mapGetters(["needSetup"]),
  },
  methods: {
    navToSettings() {
      this.$router.push({ path: "/settings" });
    },
    navToManagement() {
      this.$router.push({ path: "/mgmt" });
    },
    updateClock() {
      this.clock = new Date();
    },
    startUpdateClockInterval() {
      this.stopUpdateClockInterval();
      this.updateClockIntervalId = setInterval(this.updateClock, 1000);
    },
    stopUpdateClockInterval() {
      if (this.updateClockIntervalId) {
        clearInterval(this.updateClockIntervalId);
        this.updateClockIntervalId = null;
      }
    },
  },
  mounted() {
    this.updateClock();
    this.startUpdateClockInterval();
    if (this.needSetup) {
      this.navToSettings();
    }
  },
  beforeDestroy() {
    this.stopUpdateClockInterval();
  },
};
</script>