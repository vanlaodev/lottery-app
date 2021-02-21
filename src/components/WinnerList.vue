<template>
  <v-card outlined class="fill-height d-flex flex-column">
    <v-card-title class="text-h4 info"
      ><v-icon large class="mr-2">mdi-gift</v-icon>中獎名單</v-card-title
    >
    <v-divider></v-divider>
    <v-list class="py-0 flex overflow-y-auto">
      <div v-for="winner in sortedWinners" :key="winner.prize">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h6"
              >獎品 #{{ winner.prize }}</v-list-item-title
            >
            <v-list-item-subtitle class="text-h4 text-wrap"
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
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>重抽</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "WinnerList",
  computed: {
    sortedWinners: function () {
      return this.winners.map((w) => w).sort((a, b) => a.prize - b.prize);
    },
    ...mapState(["winners"]),
  },
};
</script>