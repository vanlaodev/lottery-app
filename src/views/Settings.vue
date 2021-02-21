<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        v-if="!firstTimeSetup"
        @click="$router.replace({ path: '/mgmt' })"
        ><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon
      >
      <v-app-bar-title>{{
        firstTimeSetup ? "首次設置" : "設置"
      }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-alert v-if="!firstTimeSetup" type="warning"
          >當您提交後所有設定及記錄將會被重置及無法還原，建議您在重置前先使用匯出功能匯出相關資料</v-alert
        >
        <v-card>
          <v-card-title>抽獎設定</v-card-title>
          <v-form v-model="formValid">
            <v-container fluid>
              <v-text-field
                v-model="anniversary"
                label="週年數"
                :rules="[
                  (v) => !!v || '必須輸入週年數',
                  (v) => v > 0 || '無效的週年數',
                ]"
                required
              ></v-text-field>
              <v-text-field
                v-model="prizeCount"
                label="獎品數"
                :rules="[
                  (v) => !!v || '必須輸入獎品數',
                  (v) => v > 0 || '無效的獎品數',
                ]"
                required
              ></v-text-field>
              <div class="mt-1">
                <v-btn @click="importGuestList" large>匯入抽獎名單</v-btn>
                <v-btn
                  large
                  color="info"
                  class="ml-2"
                  @click="previewImportedGuestList"
                  v-if="guests.length > 0"
                  >預覽已匯入抽獎名單(共{{ guests.length }}人)</v-btn
                >
              </div>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-btn
              class="ml-1"
              :disabled="!canSubmit"
              large
              color="success"
              @click="submit"
              >提交</v-btn
            ></v-card-actions
          ></v-card
        >
      </v-container>
    </v-main>
    <guest-list-dialog
      v-model="showGuestListDialog"
      :guests="guests"
    ></guest-list-dialog>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import { openAndReadFile } from "../utils/native-client";
import { parseGuestList } from "../utils/parse-guest-list";
import GuestListDialog from "../components/GuestListDialog";

export default {
  components: { GuestListDialog },
  data() {
    return {
      anniversary: null,
      prizeCount: null,
      formValid: null,
      firstTimeSetup: null,
      guests: [],
      showGuestListDialog: false,
    };
  },
  computed: {
    canSubmit() {
      return this.formValid && this.guests.length > 0;
    },
  },
  methods: {
    previewImportedGuestList() {
      this.showGuestListDialog = true;
    },
    importGuestList() {
      const openAndReadFileResult = openAndReadFile([
        { name: "Excel", extensions: ["xls", "xlsx"] },
      ]);
      if (
        !openAndReadFileResult.error &&
        !openAndReadFileResult.cancel &&
        openAndReadFileResult.data
      ) {
        const guests = parseGuestList(openAndReadFileResult.data);
        this.guests = guests;
      }
      // TODO: show error
    },
    async submit() {
      if (this.canSubmit) {
        await this.updateAnniversary(parseInt(this.anniversary));
        await this.updatePrizeCount(parseInt(this.prizeCount));
        await this.updateGuests(this.guests);
        await this.updateWinners([]);
        this.$router.replace({ path: "/main" });
      }
    },
    ...mapActions([
      "updateAnniversary",
      "updatePrizeCount",
      "updateGuests",
      "updateWinners",
    ]),
  },
  mounted() {
    this.prizeCount = this.$store.state.prizeCount;
    this.anniversary = this.$store.state.anniversary;
    this.firstTimeSetup = this.$store.getters.needSetup;
  },
};
</script>