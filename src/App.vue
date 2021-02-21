<template>
  <router-view></router-view>
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
</style>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    ...mapState(["initialized"]),
  },
  watch: {
    initialized() {
      if (this.initialized) {
        this.$router.replace({ path: "/main" });
      }
    },
  },
  methods: {
    ...mapActions(["loadOrInitializeStates"]),
  },
  created() {
    this.loadOrInitializeStates();
  },
};
</script>
