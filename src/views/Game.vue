<template>
  <v-app id="view-root" class="fill-height">
    <v-app-bar flat app dark height="80" color="transparent">
      <img
        class="mr-2"
        :src="require('@/assets/ctt-logo-only.png')"
        height="70"
      />
      <span class="text-h3">{{ `郵電局${anniversary}週年晚宴遊戲環節` }}</span>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$router.replace('/main')">
            <v-list-item-content>
              <v-list-item-title class="text-h5">抽獎環節</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="fill-height">
      <v-container
        class="fill-height flex-column flex-nowrap align-stretch"
        fluid
      >
        <v-row style="flex: 0 1 auto">
          <v-col cols="12" class="pt-1">
            <v-card id="setup-card">
              <v-card-title>遊戲人數：{{ numOfPlayers }}人</v-card-title>
              <v-card-text class="pb-2">
                <v-slider
                  :disabled="state != 'setup'"
                  class="mx-0"
                  color="red"
                  hide-details
                  v-model="numOfPlayers"
                  min="1"
                  :max="guests.length"
                ></v-slider>
              </v-card-text>
              <v-card-actions class="px-5 pb-5">
                <v-btn
                  v-if="state == 'setup'"
                  large
                  color="success"
                  @click="confirmSetup"
                  >確定</v-btn
                >
                <v-btn
                  v-else
                  :disabled="state != 'ready' && state != 'finished'"
                  large
                  color="warning"
                  @click="resetSetup"
                  >重設</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row
          v-if="state != 'setup' && remainingNumOfPlayers > 0"
          style="flex: 0 1 auto"
        >
          <v-col cols="12" class="pt-1">
            <v-card id="draw-player-card">
              <v-card-title
                >抽人玩遊戲(尚欠{{ remainingNumOfPlayers }}人)</v-card-title
              >
              <v-card-text>
                <div v-if="drawingGuest" class="text-center drawing-guest-text">
                  <div class="text-h3 mt-3 red white--text pa-3">
                    {{ drawingGuest.staffNo }} -
                    {{
                      drawingGuest.nameZh
                        ? drawingGuest.nameZh
                        : drawingGuest.nameEn
                    }}
                  </div>
                </div>
              </v-card-text>
              <v-card-actions
                v-if="remainingNumOfPlayers > 0"
                class="px-5 pb-5"
              >
                <v-btn
                  :disabled="state != 'ready'"
                  color="red"
                  large
                  @click="startDraw(1)"
                  ><span>抽一個</span></v-btn
                >
                <v-btn
                  :disabled="state != 'ready'"
                  v-if="remainingNumOfPlayers > 1"
                  color="red"
                  large
                  @click="startDraw(remainingNumOfPlayers)"
                  ><span>抽全部({{ remainingNumOfPlayers }}個)</span></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="state != 'setup'" class="flex-grow-1">
          <v-col cols="12" class="fill-height pt-1">
            <v-card id="result-card" class="fill-height d-flex flex-column">
              <v-card-title>結果</v-card-title>
              <v-card-text
                class="overflow-y-auto"
                style="flex: 1 1 auto; height: 0px"
              >
                <v-chip
                color="info"
                  label
                  v-for="player in players"
                  :key="player.rowNum"
                  class="ma-2 text-h4"
                  close
                  x-large
                  @click:close="excludePlayer(player)"
                >
                  {{ player.staffNo }} -
                  {{ player.nameZh ? player.nameZh : player.nameEn }}
                </v-chip>
              </v-card-text>
            </v-card>
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

<style scoped>
#view-root {
  background: #020316;
  background: -webkit-linear-gradient(to left, #242424, #09090a);
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      updateClockIntervalId: null,
      clock: null,
      numOfPlayers: null,
      state: "setup",
      players: [],
      excludedGuests: [],
      drawingGuest: null,
    };
  },
  computed: {
    guestsCanBeDrawn: function () {
      return this.guests.filter(
        (x) =>
          !this.players.map((p) => p.staffNo).includes(x.staffNo) &&
          !this.excludedGuests.map((g) => g.staffNo).includes(x.staffNo)
      );
    },
    remainingNumOfPlayers: function () {
      const remainingNumOfPlayers = this.numOfPlayers - this.players.length;
      return remainingNumOfPlayers < 0 ? 0 : remainingNumOfPlayers;
    },
    randomSortedGuestsCanBeDrawn: function () {
      return this.guestsCanBeDrawn == null
        ? null
        : this.guestsCanBeDrawn.map((x) => x).sort(() => 0.5 - Math.random());
    },
    ...mapState(["anniversary", "guests"]),
  },
  methods: {
    ...mapActions(["appendLog"]),
    async excludePlayer(player) {
      this.players = this.players.filter((p) => p.staffNo != player.staffNo);
      this.excludedGuests.push(player);

      this.state = this.remainingNumOfPlayers > 0 ? "ready" : "finished";

      await this.appendLog(
        `Exclude player: guest=${player.staffNo}/${
          player.nameZh ? player.nameZh : player.nameEn
        }`
      );
    },
    async startDraw(count) {
      if (
        this.remainingNumOfPlayers >= count &&
        this.randomSortedGuestsCanBeDrawn
      ) {
        for (let i = 0; i < count; ++i) {
          this.state = "drawing";

          for (let i = 0; i < 100; ++i) {
            await new Promise((resolve) => {
              setTimeout(resolve, 10);
            });
            this.drawingGuest = this.randomSortedGuestsCanBeDrawn[
              Math.floor(
                Math.random() * this.randomSortedGuestsCanBeDrawn.length
              )
            ];
          }

          this.players.push(this.drawingGuest);

          await this.appendLog(
            `Player drawn: guest=${this.drawingGuest.staffNo}/${
              this.drawingGuest.nameZh
                ? this.drawingGuest.nameZh
                : this.drawingGuest.nameEn
            }`
          );

          await new Promise((resolve) => setTimeout(resolve, 500));

          this.drawingGuest = null;
        }
        this.state = this.remainingNumOfPlayers > 0 ? "ready" : "finished";
      }
    },
    async confirmSetup() {
      this.state = "ready";

      await this.appendLog(
        `Confirm game player draw setup: number of players=${this.numOfPlayers}`
      );
    },
    async resetSetup() {
      this.state = "setup";
      this.players = [];
      this.excludedGuests = [];

      await this.appendLog("Reset game player draw setup.");
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
    this.numOfPlayers = this.guests.length >= 10 ? 10 : this.guests.length;
  },
  beforeDestroy() {
    this.stopUpdateClockInterval();
  },
};
</script>