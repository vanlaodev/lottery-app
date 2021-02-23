<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="$router.replace('/main')"
        ><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon
      >
      <v-app-bar-title>設定</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <!-- <v-card dark color="info" class="mb-3" @click="exportData"
          ><v-card-title>匯出</v-card-title>
          <v-card-subtitle>抽獎記錄</v-card-subtitle></v-card
        > -->
        <v-card dark color="green" class="mb-3" @click="showCurrentGuestList"
          ><v-card-title>顯示當前抽獎名單 ({{ guests.length }}人)</v-card-title>
        </v-card>
        <v-card dark color="red" class="mb-3" @click="navToSetup"
          ><v-card-title>重新設置</v-card-title>
          <v-card-subtitle
            >包括週年數、抽奬名單、獎品資料等，原有設定和記錄將會被清除及覆蓋</v-card-subtitle
          >
        </v-card>
        <v-card dark class="mb-3" @click="exitApp"
          ><v-card-title>退出程式</v-card-title>
        </v-card>
      </v-container>
    </v-main>
    <guest-list-dialog
      v-model="showGuestListDialog"
      :guests="guests"
    ></guest-list-dialog>
  </v-app>
</template>

<script>
import { exitApp } from "../utils/native-client";
import { mapState } from "vuex";
import GuestListDialog from "../components/GuestListDialog";

export default {
  components: { GuestListDialog },
  data() {
    return {
      showGuestListDialog: false,
    };
  },
  computed: {
    ...mapState(["guests"]),
  },
  methods: {
    exportData() {
      // TODO
    },
    navToSetup() {
      this.$router.push({ path: "/setup" });
    },
    exitApp() {
      exitApp();
    },
    showCurrentGuestList() {
      this.showGuestListDialog = true;
    },
  },
};
</script>