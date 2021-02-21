<template>
  <v-card outlined class="fill-height d-flex flex-column">
    <v-card-title class="text-h4 success"
      ><v-icon large class="mr-2">mdi-party-popper</v-icon
      >{{ title }}</v-card-title
    >
    <v-divider></v-divider>
    <div class="flex-grow-1"></div>
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
import { mapGetters } from "vuex";

export default {
  name: "Lottery",
  data() {
    return {
      state: "unknown",
    };
  },
  methods: {
    startDraw() {
      this.state = "drawing";
      setTimeout(() => {
        this.state = "ready";
      }, 3000);
    },
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
      return !this.canDraw
        ? "抽獎結束，感謝大家參與！"
        : `正準備抽出第${this.nextPrize}號獎品`;
    },
    ...mapGetters(["nextPrize", "guestsCanBeDrawn"]),
  },
  mounted() {
    this.state = this.canDraw ? "ready" : "ended";
  },
};
</script>