<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="$router.replace('/main')"
        ><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon
      >
      <v-app-bar-title>管理</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-card dark color="info" @click="exportData"
          ><v-card-title>匯出</v-card-title>
          <v-card-subtitle>抽獎記錄</v-card-subtitle></v-card
        >
        <v-card dark color="red" class="mt-3" @click="navToSettings"
          ><v-card-title>重新設置</v-card-title>
          <v-card-subtitle
            >包括週年數、抽奬名單、獎品資料等，原有設定和記錄將會被清除及覆蓋</v-card-subtitle
          >
        </v-card>
        <v-card dark class="mt-3" @click="exitApp"
          ><v-card-title>退出程式</v-card-title>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { exitApp } from "../utils/native-client";

export default {
  methods: {
    exportData() {
      // TODO
    },
    navToSettings() {
      this.$router.push({ path: "/settings" });
    },
    exitApp() {
      exitApp();
    },
  },
};
</script>