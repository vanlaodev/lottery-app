<template>
  <v-card
    id="lottery-root"
    outlined
    class="fill-height d-flex flex-column orange darken-1"
  >
    <v-card-title class="text-h4 amber darken-4"
      ><v-icon large class="mr-2">mdi-party-popper</v-icon
      >{{ title }}</v-card-title
    >
    <div
      class="flex-grow-1 d-flex flex-column overflow-y-auto justify-center align-center py-1"
    >
      <div v-if="drawingGuest" class="text-center drawing-guest-text">
        <div class="text-h1 mt-3">{{ drawingGuest.staffNo }}</div>
        <div class="text-h1 mt-3">
          {{ drawingGuest.nameZh ? drawingGuest.nameZh : drawingGuest.nameEn }}
        </div>
      </div>
      <div
        v-else-if="lastWinner && (state == 'ready' || state == 'ended')"
        class="text-center winner-text"
      >
        <div class="text-h3 mt-3">{{ lastWinner.prize }}號獎得主</div>
        <div class="text-h1 mt-3">{{ lastWinner.guest.staffNo }}</div>
        <div class="text-h1 mt-3">
          {{
            lastWinner.guest.nameZh
              ? lastWinner.guest.nameZh
              : lastWinner.guest.nameEn
          }}
        </div>
      </div>
      <div v-else>
        <v-img
          contain
          max-width="400"
          :src="require('@/assets/colorful-gifts.png')"
        >
        </v-img>
      </div>
    </div>
    <v-btn
      id="btn-draw"
      tile
      block
      :class="[{ 'text-h3': true, 'darken-2': true }, state]"
      style="flex: 0 0 140px"
      color="red"
      @click="startDraw"
      :disabled="drawBtnDisabled"
      v-if="drawBtnVisible"
      ><span>{{ drawBtnText }}</span></v-btn
    >
  </v-card>
</template>

<style scoped>
@keyframes animated-border {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
  }
  100% {
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
}

#btn-draw.ready {
  animation: animated-border 1.2s infinite;
}

#lottery-root {
  background: rgb(245, 219, 143);
  background: radial-gradient(
    circle,
    rgba(245, 219, 143, 1) 3%,
    rgba(233, 150, 32, 1) 100%
  );
}

.winner-text {
  text-shadow: 2px 2px 0px rgba(201, 226, 240, 1);
}

.drawing-guest-text {
  text-shadow: 2px 2px 0px rgba(201, 226, 240, 1);
}
</style>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Lottery",
  data() {
    return {
      state: "unknown",
      drawingGuest: null,
      lastWinner: null,
      hndDelayUnsetLastWinner: null,
    };
  },
  beforeDestroy() {
    this.stopConfetti();
    this.unwatchStore();
    this.cancelDelayUnsetLastWinner();
  },
  methods: {
    ...mapMutations(["updateMainOverlay"]),
    showConfetti(duration) {
      if ("showConfetti" in window) {
        window.showConfetti(duration);
      }
    },
    stopConfetti() {
      if ("stopConfetti" in window) {
        window.stopConfetti();
      }
    },
    startDelayUnsetLastWinner(delay) {
      this.cancelDelayUnsetLastWinner();
      this.hndDelayUnsetLastWinner = setTimeout(() => {
        this.lastWinner = null;
      }, delay);
    },
    cancelDelayUnsetLastWinner() {
      if (this.hndDelayUnsetLastWinner) {
        clearTimeout(this.hndDelayUnsetLastWinner);
        this.hndDelayUnsetLastWinner = null;
      }
    },
    async startDraw() {
      this.stopConfetti();
      this.cancelDelayUnsetLastWinner();
      this.lastWinner = null;
      const prize = this.nextPrize;
      if (prize != null && this.randomSortedGuestsCanBeDrawn) {
        this.state = "drawing";
        this.updateMainOverlay(true);
        this.sounds.drumRoll.currentTime = 0;
        await this.sounds.drumRoll.play();
        let drumRollEnded = false;
        const drumRollEndedCb = () => {
          drumRollEnded = true;
          this.sounds.drumRoll.removeEventListener("ended", drumRollEndedCb);
        };
        this.sounds.drumRoll.addEventListener("ended", drumRollEndedCb);
        while (!drumRollEnded) {
          this.drawingGuest = this.randomSortedGuestsCanBeDrawn[
            Math.floor(Math.random() * this.randomSortedGuestsCanBeDrawn.length)
          ];
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
        }
        /*  for (let i = 0; i < 200; ++i) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          this.drawingGuest = this.randomSortedGuestsCanBeDrawn[
            Math.floor(Math.random() * this.randomSortedGuestsCanBeDrawn.length)
          ];
        }
        this.sounds.drumRoll.pause(); */
        this.sounds.taDa.currentTime = 0;
        this.sounds.taDa.play();
        this.updateMainOverlay(false);
        this.showConfetti(prize == 1 ? 15000 : 3500);
        const newWinner = {
          prize: prize,
          guest: this.drawingGuest,
        };
        await this.newWinner(newWinner);
        this.lastWinner = newWinner;
        this.drawingGuest = null;
        this.state = this.canDraw ? "ready" : "ended";
        if (this.state == "ready" || this.prize != 1) {
          this.startDelayUnsetLastWinner(15000);
        }
      }
    },
    ...mapActions(["newWinner"]),
  },
  watch: {
    canDraw() {
      if (this.canDraw && this.state == "ended") {
        this.state = "ready";
      }
    },
  },
  computed: {
    ...mapState(["sounds"]),
    drawBtnVisible: function () {
      // return this.state == "ready" || this.state == "drawing";
      return true;
    },
    drawBtnDisabled: function () {
      return (
        this.state != "ready" ||
        this.nextPrize == null ||
        !(this.guestsCanBeDrawn && this.guestsCanBeDrawn.length > 0)
      );
    },
    canDraw: function () {
      return this.nextPrize != null;
    },
    drawBtnText: function () {
      switch (this.state) {
        case "ready":
          return "開始抽獎 START";
        case "drawing":
          return "抽獎中 DRAWING";
        case "ended":
          return "抽獎結束 FINISHED";
        default:
          return "";
      }
    },
    title: function () {
      if (this.state == "drawn") {
        return "";
      }
      return !this.canDraw
        ? "抽獎結束"
        : this.state == "drawing"
        ? `正在抽取${this.nextPrize}號獎品`
        : `即將抽出${this.nextPrize}號獎品`;
    },
    randomSortedGuestsCanBeDrawn: function () {
      return this.guestsCanBeDrawn == null
        ? null
        : this.guestsCanBeDrawn.map((x) => x).sort(() => 0.5 - Math.random());
    },
    ...mapGetters(["nextPrize", "guestsCanBeDrawn"]),
  },
  mounted() {
    this.state = this.canDraw ? "ready" : "ended";
    this.unwatchStore = this.$store.watch(
      (state) => state.excludedGuests,
      () => {
        this.cancelDelayUnsetLastWinner();
        this.lastWinner = null;
        this.stopConfetti();
      }
    );
  },
};
</script>