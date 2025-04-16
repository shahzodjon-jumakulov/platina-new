import { defineNuxtPlugin } from "#app";
import moment from "moment";
import "moment/dist/locale/ru";
import "moment/dist/locale/uz";
import "moment/dist/locale/uz-latn";

function formatDate(dateString) {
  const date = moment(dateString);
  const now = moment();

  const isLastYear = date.year() < now.year();
  const differenceInDays = now.diff(date, "days");

  const isLatn = moment.locale() === "uz-latn";
  if (differenceInDays < 7) {
    return date.fromNow(); // Use relative time if the difference is less than 7 days
  } else if (isLastYear) {
    return date.format(`DD${isLatn ? "-" : " "}MMMM, YYYY`);
  } else {
    return date.format(`DD${isLatn ? "-" : " "}MMMM, HH:mm`);
  }
}

moment.updateLocale("uz", {
  months:
    "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split(
      "_"
    ),
  relativeTime: {
    future: "Якин %s ичида",
    past: (input) => {
      if (input === "Ҳозиргина") return input;
      return input + " аввал";
    },
    s: "Ҳозиргина",
    ss: "%d сония",
    m: "1 дақиқа",
    mm: "%d дақиқа",
    h: "1 соат",
    hh: "%d соат",
    d: "1 кун",
    dd: "%d кун",
    M: "1 ой",
    MM: "%d ой",
    y: "1 йил",
    yy: "%d йил",
  },
});

moment.updateLocale("uz-latn", {
  months:
    "yanvar_fevral_mart_aprel_may_iyun_iyul_avgust_sentabr_oktabr_noyabr_dekabr".split(
      "_"
    ),
  relativeTime: {
    future: "Yaqin %s ichida",
    past: (input) => {
      if (input === "Hozirgina") return input;
      return input + " avval";
    },
    s: "Hozirgina",
    ss: "%d soniya",
    m: "1 daqiqa",
    mm: "%d daqiqa",
    h: "1 soat",
    hh: "%d soat",
    d: "1 kun",
    dd: "%d kun",
    M: "1 oy",
    MM: "%d oy",
    y: "1 yil",
    yy: "%d yil",
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  const { locale } = useNuxtApp().$i18n;
  switch (locale.value) {
    case "o'z":
      moment.locale("uz-latn");
      break;
    case "uz":
      moment.locale("uz");
      break;
    default:
      moment.locale(locale.value);
      break;
  }
  nuxtApp.provide("moment", moment);
  nuxtApp.provide("formatDate", formatDate);
});
