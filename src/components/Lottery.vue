<template>
  <v-card outlined class="fill-height d-flex flex-column">
    <v-card-title class="text-h4 success"
      ><v-icon large class="mr-2">mdi-party-popper</v-icon
      >{{ title }}</v-card-title
    >
    <v-divider></v-divider>
    <v-container fluid class="flex-grow-1">
      <v-row class="fill-height">
        <v-col cols="12" class="text-center d-flex flex-column">
          <div class="mt-auto mb-auto">
            <div v-if="drawingGuest">
              <div class="text-h1">{{ drawingGuest.staffNo }}</div>
              <div class="text-h1">
                {{
                  drawingGuest.nameZh
                    ? drawingGuest.nameZh
                    : drawingGuest.nameEn
                }}
              </div>
            </div>
            <div v-if="lastWinner && (state == 'ready' || state == 'ended')">
              <div class="text-h3">{{ lastWinner.prize }}號獎得主</div>
              <div class="text-h1 mt-3">{{ lastWinner.guest.staffNo }}</div>
              <div class="text-h1 mt-3">
                {{
                  lastWinner.guest.nameZh
                    ? lastWinner.guest.nameZh
                    : lastWinner.guest.nameEn
                }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      id="btn-draw"
      tile
      block
      :class="[{ 'text-h3': true }, state]"
      style="flex: 0 0 130px"
      color="red"
      @click="startDraw"
      :disabled="state != 'ready'"
      v-if="state == 'ready' || state == 'drawing'"
      >{{ drawBtnText }}</v-btn
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
    };
  },
  methods: {
    async startDraw() {
      this.state = "drawing";
      for (let i = 0; i < 200; ++i) {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        this.drawingGuest = this.guestsCanBeDrawn[
          Math.floor(Math.random() * this.guestsCanBeDrawn.length)
        ];
      }
      this.lastWinner = {
        prize: this.nextPrize,
        guest: this.drawingGuest,
      };
      await this.newWinner(this.lastWinner);
      this.drawingGuest = null;
      this.state = this.canDraw ? "ready" : "ended";
    },
    ...mapActions(["newWinner"]),
  },
  computed: {
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
          return "完成抽獎 FINISHED";
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
        ? `正在抽取第${this.nextPrize}號獎品`
        : `即將抽出第${this.nextPrize}號獎品`;
    },
    ...mapGetters(["nextPrize", "guestsCanBeDrawn"]),
  },
  mounted() {
    this.state = this.canDraw ? "ready" : "ended";
  },
};
</script>