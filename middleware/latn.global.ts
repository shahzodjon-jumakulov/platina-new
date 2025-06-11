export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/o%27z"))
    return navigateTo(to.path.replace("o%27z", "o'z"), { redirectCode: 301 });
});
