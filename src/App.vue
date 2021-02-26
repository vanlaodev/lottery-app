<template>
  <transition>
    <div class="fill-height">
      <router-view></router-view>
      <v-snackbar
        top
        app
        :value="globalSnackbar.show"
        @input="(v) => updateGlobalSnackbar({ show: v })"
        :timeout="globalSnackbar.timeout"
        :color="globalSnackbar.color"
        style="opacity: 0.9"
      >
        {{ globalSnackbar.msg }}

        <template v-slot:action="{ attrs }">
          <v-btn
            icon
            color="primary"
            text
            v-bind="attrs"
            @click="(v) => updateGlobalSnackbar({ show: false })"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </transition>
</template>

<style>
.theme--light ::-webkit-scrollbar {
  width: 15px;
}
.theme--light ::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}
.theme--light ::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}
.theme--light ::-webkit-scrollbar-thumb:hover {
  background: black;
}
.theme--dark ::-webkit-scrollbar {
  width: 15px;
}
.theme--dark ::-webkit-scrollbar-track {
  background: #202020;
  border-left: 1px solid #2c2c2c;
}
.theme--dark ::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}
.theme--dark ::-webkit-scrollbar-thumb:hover {
  background: white;
}
* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["globalSnackbar"]),
  },
  methods: {
    ...mapActions(["loadOrInitializeStates", "ensureAllSoundsReady"]),
    ...mapMutations(["updateGlobalSnackbar", "setInitialized"]),
    initialize() {
      this.loadOrInitializeStates().then(() => {
        this.setInitialized();
        this.$router.replace({ path: "/main" });
      });
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    if (this.$route.path !== "/" && !this.initialized) {
      this.$router.replace({ path: "/" });
    }
  },
};
</script>
