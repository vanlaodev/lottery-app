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
        <v-card dark color="info" class="mb-3" @click="importData"
          ><v-card-title>讀取</v-card-title>
          <v-card-subtitle
            >加載儲存資料，包括週年數、抽奬名單、獎品資料等</v-card-subtitle
          ></v-card
        >
        <v-card dark color="warning" class="mb-3" @click="exportData"
          ><v-card-title>儲存</v-card-title>
          <v-card-subtitle
            >匯出儲存資料，包括週年數、抽奬名單、獎品資料等</v-card-subtitle
          ></v-card
        >
        <v-card dark color="green" class="mb-3" @click="showCurrentGuestList"
          ><v-card-title>當前抽獎名單</v-card-title>
          <v-card-subtitle>總人數：{{ guests.length }}人</v-card-subtitle>
        </v-card>
        <v-card dark color="red" class="mb-3" @click="navToSetup"
          ><v-card-title>重新設置</v-card-title>
          <v-card-subtitle
            >包括週年數、抽奬名單、獎品資料等，原有設定和記錄將會被清除</v-card-subtitle
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
import {
  exitApp,
  importDataFromFile,
  showSaveFileDialogAndExportData,
} from "../utils/native-client";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
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
    ...mapGetters(["saveData"]),
  },
  methods: {
    ...mapMutations(["updateGlobalSnackbar"]),
    ...mapActions(["loadSaveData", "showGlobalErrorSnackbar"]),
    async importData() {
      const data = importDataFromFile();
      if (data != null) {
        await this.loadSaveData(data);
        this.updateGlobalSnackbar({
          show: true,
          msg: "讀取成功",
          timeout: 2000,
          color: "success",
        });
        this.$router.replace({ path: "/main" });
      } else {
        this.updateGlobalSnackbar({
          show: true,
          msg: "讀取失敗",
          timeout: 2000,
          color: "warning",
        });
      }
    },
    exportData() {
      const result = showSaveFileDialogAndExportData(this.saveData);
      if (result.error) {
        this.showGlobalErrorSnackbar(result.error);
      } else if (result.success) {
        this.updateGlobalSnackbar({
          show: true,
          msg: "儲存成功",
          timeout: 2000,
          color: "success",
        });
      }
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