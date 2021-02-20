<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon
        v-if="!firstTimeSetup"
        @click="$router.replace({ path: '/mgmt' })"
        ><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon
      >
      <v-app-bar-title>設置</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-card>
          <v-form v-model="valid">
            <v-container>
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
            </v-container>
          </v-form>
          <v-card-actions>
            <v-btn :disabled="!valid" color="success" @click="submit"
              >提交</v-btn
            ></v-card-actions
          ></v-card
        >
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      anniversary: null,
      prizeCount: null,
      valid: null,
      firstTimeSetup: null,
    };
  },
  methods: {
    async submit() {
      if (this.valid) {
        await this.updateAnniversary(this.anniversary);
        await this.updatePrizeCount(this.prizeCount);
        await this.updateGuests([]); // TODO
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