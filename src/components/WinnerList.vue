<template>
  <v-card outlined class="fill-height overflow-y-auto">
    <v-card-title><v-icon class="mr-2">mdi-gift</v-icon>中獎名單</v-card-title>
    <v-divider></v-divider>
    <v-list class="py-0">
      <div v-for="winner in winners" :key="winner">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h6"
              >{{ winner.prize }}號獎品</v-list-item-title
            >
            <v-list-item-subtitle class="text-h4">{{
              winner.nameZh ? winner.nameZh : winner.nameEn
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list flat>
                <v-list-item @click="navToManagement">
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
    ...mapState(["winners"]),
  },
};
</script>