<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar dark color="primary" flat>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>抽獎名單</v-toolbar-title>
      </v-toolbar>
      <v-data-table :headers="headers" :items="guests" item-key="rowNum">
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "GuestListDialog",
  props: ["show", "guests"],
  data() {
    return {
      dialog: this.value,
    };
  },
  computed: {
    headers() {
      return [
        { text: "#", value: "rowNum" },
        { text: "部門", value: "dept" },
        { text: "員工編號", value: "staffNo" },
        { text: "中文名", value: "nameZh" },
        { text: "英文名", value: "nameEn" },
      ];
    },
  },
  model: { prop: "show", event: "show-changed" },
  watch: {
    dialog: function () {
      this.$emit("show-changed", this.dialog);
    },
    show: function () {
      this.dialog = this.show;
    },
  },
};
</script>