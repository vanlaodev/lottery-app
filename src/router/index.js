import Vue from "vue";
import VueRouter from "vue-router";
import Startup from "../views/Startup.vue";
import Main from "../views/Main.vue";
import Settings from "../views/Settings.vue";
import Setup from "../views/Setup.vue";
import Game from "../views/Game.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Startup",
    component: Startup,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/setup",
    name: "Setup",
    component: Setup,
  },
  {
    path: "/game",
    name: "Game",
    component: Game,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
