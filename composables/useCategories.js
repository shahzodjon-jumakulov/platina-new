export default function () {
  const categories = ref({ categories: [], lang: "" });
  const loading = ref(false);
  const error = ref(null);

  const { locale } = useI18n();

  const load = async () => {
    if (
      categories.value.categories.length &&
      categories.value.lang === locale.value
    ) {
      // already loaded
      return;
    }
    loading.value = true;
    try {
      const { data, error: fetchError } = await useMyFetch("/categories/list", {
        transform: (data) => data.results,
      });
      console.log("categories", data.value);
      if (fetchError.value) throw fetchError.value;
      categories.value.categories = data.value || [];
      categories.value.lang = locale.value;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  watch(locale, async () => {
    console.log("locale changed", locale.value);
    await load();
  });

  watchEffect(async () => {
    await load();
  });

  return {
    categories,
    loading,
    error,
    load,
  };
}
