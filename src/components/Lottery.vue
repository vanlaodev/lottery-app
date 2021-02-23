<template>
  <v-card outlined class="fill-height d-flex flex-column orange darken-1">
    <v-card-title class="text-h4 amber darken-4"
      ><v-icon large class="mr-2">mdi-party-popper</v-icon
      >{{ title }}</v-card-title
    >
    <div
      class="flex-grow-1 d-flex flex-column overflow-y-auto"
      style="justify-content: center; align-items: center"
    >
      <div v-if="drawingGuest" class="text-center">
        <div class="text-h2 mt-3">{{ drawingGuest.staffNo }}</div>
        <div class="text-h2 mt-3">
          {{ drawingGuest.nameZh ? drawingGuest.nameZh : drawingGuest.nameEn }}
        </div>
      </div>
      <div
        v-else-if="lastWinner && (state == 'ready' || state == 'ended')"
        class="text-center"
      >
        <div class="text-h3 mt-3">{{ lastWinner.prize }}號獎得主</div>
        <div class="text-h2 mt-3">{{ lastWinner.guest.staffNo }}</div>
        <div class="text-h2 mt-3">
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
</style>

<script>
import { mapGetters, mapActions } from "vuex";

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
      if (this.nextPrize && this.guestsCanBeDrawn) {
        this.state = "drawing";
        for (let i = 0; i < 200; ++i) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          this.drawingGuest = this.guestsCanBeDrawn[
            Math.floor(Math.random() * this.guestsCanBeDrawn.length)
          ];
        }
        this.showConfetti(this.nextPrize == 1 ? 15000 : 3500);
        const newWinner = {
          prize: this.nextPrize,
          guest: this.drawingGuest,
        };
        await this.newWinner(newWinner);
        this.lastWinner = newWinner;
        this.drawingGuest = null;
        this.state = this.canDraw ? "ready" : "ended";
        if (this.state == "ready") {
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
    drawBtnVisible: function () {
      return this.state == "ready" || this.state == "drawing";
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
          return "抽獎 START";
        case "drawing":
          return "抽獎中 DRAWING";
        case "ended":
          return "抽獎已完成 FINISHED";
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