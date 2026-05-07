import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../store/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../pages/Home.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.isLoggedIn()) {
    await authStore.fetchCurrentUser();
    if (!authStore.isLoggedIn()) {
      return next({ name: "Login" });
    }
  }

  if (
    !requiresAuth &&
    authStore.isLoggedIn() &&
    (to.name === "Login" || to.name === "Register")
  ) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
