<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon><v-icon>mdi-cake-variant</v-icon></v-app-bar-nav-icon>
      <v-app-bar-title>郵電局{{ anniversary }}週年晚宴抽獎程式</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon dark v-bind="attrs" v-on="on">
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
    <v-main>
      <!--  -->
    </v-main>
    <v-footer app padless>
      <v-col class="text-center">
        <small>{{ clock | moment("YYYY年MM月DD日 HH:mm:ss") }}</small>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
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