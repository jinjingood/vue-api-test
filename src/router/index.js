import { createRouter, createWebHashHistory } from "vue-router";
import MusicPlayer1 from "../views/MusicPlayer1.vue";

const routes = [
  {
    path: "/",
    name: "MusicPlayer1",
    component: MusicPlayer1,
  },
  {
    path: "/MusicPlayer2",
    name: "MusicPlayer2",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MusicPlayer2.vue"),
  },

  {
    path: "/MusicItem",
    name: "MusicItem",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MusicItem.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
