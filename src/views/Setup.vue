<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        v-if="!firstTimeSetup"
        @click="$router.replace({ path: '/settings' })"
        ><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon
      >
      <v-app-bar-title>{{
        firstTimeSetup ? "首次設置" : "重新設置"
      }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-alert v-if="!firstTimeSetup" type="warning"
          >當您提交後所有設定及記錄將會被重置及無法還原</v-alert
        >
        <v-card>
          <v-card-title>抽獎設定</v-card-title>
          <v-form ref="form" v-model="formValid">
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
                class="mt-2"
                v-model="prizeCount"
                label="獎品數"
                :rules="[
                  (v) => !!v || '必須輸入獎品數',
                  (v) => v > 0 || '無效的獎品數',
                  (v) =>
                    guests.length == 0 ||
                    parseInt(v) <= guests.length ||
                    '獎品數不能比抽獎名單多',
                ]"
                required
              ></v-text-field>
              <div class="mt-3">
                <v-btn class="mr-2 mb-2" @click="importGuestList" large
                  >匯入抽獎名單</v-btn
                >
                <v-btn
                  large
                  class="mb-2"
                  color="info"
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
              >確認</v-btn
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
      return this.formValid && this.guests.length >= this.prizeCount;
    },
  },
  methods: {
    validateForm() {
      this.$refs.form.validate();
    },
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
        this.validateForm();
      }
    },
    async submit() {
      if (this.canSubmit) {
        await this.setup({
          anniversary: parseInt(this.anniversary),
          prizeCount: parseInt(this.prizeCount),
          guests: this.guests,
        });
        this.$router.replace({ path: "/main" });
      }
    },
    ...mapActions(["setup"]),
  },
  mounted() {
    this.prizeCount = this.$store.state.prizeCount;
    this.anniversary = this.$store.state.anniversary;
    this.firstTimeSetup = this.$store.getters.needSetup;
  },
};
</script>