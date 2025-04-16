export default (localeValue) => {
  const { $moment } = useNuxtApp();

  switch (localeValue) {
    case "o'z":
      $moment.locale("uz-latn");
      break;
    case "uz":
      $moment.locale("uz");
      break;
    default:
      $moment.locale(localeValue);
  }
};
