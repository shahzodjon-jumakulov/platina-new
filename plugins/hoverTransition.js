import { defineNuxtPlugin } from "#app";

const hoverTransition = {
  mounted(el) {
    el.classList.add("group-hover:transition-colors");

    const transitionClasses = ["transition-colors", "duration-150"];
    const transitionDuration = 150;

    const addTransition = () => el.classList.add(...transitionClasses);
    const removeTransition = () => {
      setTimeout(() => {
        el.classList.remove(...transitionClasses);
      }, transitionDuration);
    };

    const findGroupParent = (element) => {
      let parent = element.parentElement;
      while (parent) {
        if (parent.classList.contains("group")) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const target = findGroupParent(el) || el;

    target.addEventListener("mouseenter", addTransition);
    target.addEventListener("mouseleave", removeTransition);
  },

  unmounted(el) {
    const handlers = el._hoverTransitionHandlers;
    if (handlers && handlers.target) {
      handlers.target.removeEventListener("mouseenter", handlers.addTransition);
      handlers.target.removeEventListener(
        "mouseleave",
        handlers.removeTransition
      );
    }
  },
};

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive("hover-transition", hoverTransition);
});
