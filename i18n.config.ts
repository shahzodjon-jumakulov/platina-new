import uz from "~/locales/uz.json";
import latn from "~/locales/latn.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "uz",
  messages: {
    uz: uz,
    "o'z": latn,
  },
}));
