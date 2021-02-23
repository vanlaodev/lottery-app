<template>
  <v-app id="view-root" class="fill-height">
    <v-app-bar flat app dark height="80" color="transparent">
      <img
        class="mr-2"
        :src="require('@/assets/ctt-logo-only.png')"
        height="70"
      />
      <span class="text-h3">{{ eventTitle }}</span>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navToSettings">
            <v-list-item-content>
              <v-list-item-title class="text-h5">設定</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="fill-height">
      <v-container class="fill-height pt-0" fluid>
        <v-row class="fill-height">
          <v-col class="fill-height pr-2" cols="4">
            <winner-list></winner-list>
          </v-col>
          <v-col class="fill-height pl-2" cols="8">
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
    <canvas id="confetti-canvas"></canvas>
    <v-overlay :value="mainOverlay" z-index="2500"></v-overlay>
  </v-app>
</template>

<style>
html,
body {
  height: 100%;
  overflow-y: hidden !important;
}
</style>

<style scoped>
#confetti-canvas {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2333;
  border: 0px solid #000;
  pointer-events: none;
}

#view-root {
  background: #020316;
  background: -webkit-linear-gradient(to left, #242424, #09090a);
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
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
    ...mapState(["mainOverlay"]),
    ...mapGetters(["needSetup", "eventTitle"]),
  },
  methods: {
    navToSettings() {
      this.$router.push({ path: "/settings" });
    },
    navToSetup() {
      this.$router.push({ path: "/setup" });
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
    window.readyConfetti("confetti-canvas");
    this.updateClock();
    this.startUpdateClockInterval();
    if (this.needSetup) {
      this.navToSetup();
    }
  },
  beforeDestroy() {
    this.stopUpdateClockInterval();
  },
};
</script>