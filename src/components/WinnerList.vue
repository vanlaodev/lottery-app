<template>
  <v-card
    id="winner-list-root"
    outlined
    class="fill-height d-flex flex-column blue-grey darken-4"
  >
    <v-card-title class="text-h4 info"
      ><v-icon large class="mr-2">mdi-gift</v-icon>中獎名單</v-card-title
    >
    <v-list
      v-if="winners != null && winners.length > 0"
      class="py-0 flex overflow-y-auto transparent"
    >
      <div v-for="winner in sortedWinners" :key="winner.prize">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5"
              >獎品 #{{ winner.prize }}</v-list-item-title
            >
            <v-list-item-subtitle class="text-h4 text-wrap mt-1"
              >{{ winner.guest.staffNo }} -
              {{
                winner.guest.nameZh ? winner.guest.nameZh : winner.guest.nameEn
              }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list flat>
                <v-list-item @click="redrawWinner(winner)">
                  <v-list-item-content>
                    <v-list-item-title class="text-h5"
                      >重抽{{ winner.prize }}號獎品</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    <div
      v-else
      class="d-flex flex-column justify-center align-center fill-height"
    >
      <span class="text-h3 grey--text">等待開始</span>
    </div>
  </v-card>
</template>

<style scoped>
#winner-list-root {
  background: rgb(62, 81, 91);
  background: linear-gradient(
    180deg,
    rgba(62, 81, 91, 1) 0%,
    rgba(38, 50, 56, 1) 50%
  );
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "WinnerList",
  methods: {
    ...mapActions(["redrawWinner"]),
  },
  computed: {
    sortedWinners: function () {
      return this.winners.map((w) => w).sort((a, b) => a.prize - b.prize);
    },
    ...mapState(["winners"]),
  },
};
</script>