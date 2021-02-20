<template>
  <div>
    <router-view></router-view>
  </div>
</template>

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
