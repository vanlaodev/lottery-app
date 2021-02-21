<template>
  <v-card outlined class="fill-height d-flex flex-column"> </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Lottery",
  computed: {
    ...mapGetters(["nextPrize", "guestsCanBeDrawn"]),
  },
};
</script>