import bobur_jalolov from "~/assets/team/bobur_jalolov.png";
import bobur_jalolov_shadow from "~/assets/team/bobur_jalolov_shadow.png";
import abulfayz_sayidasqarov from "~/assets/team/abulfayz_sayidasqarov.png";
import abulfayz_sayidasqarov_shadow from "~/assets/team/abulfayz_sayidasqarov_shadow.png";
import murodjon_mahmudov from "~/assets/team/murodjon_mahmudov.png";
import murodjon_mahmudov_shadow from "~/assets/team/murodjon_mahmudov_shadow.png";
import adhamjon_saxodullayev from "~/assets/team/adhamjon_saxodullayev.png";
import adhamjon_saxodullayev_shadow from "~/assets/team/adhamjon_saxodullayev_shadow.png";
import dilnoza_yusupova from "~/assets/team/dilnoza_yusupova.png";
import dilnoza_yusupova_shadow from "~/assets/team/dilnoza_yusupova_shadow.png";
import ulugbek_oripov from "~/assets/team/ulugbek_oripov.png";
import ulugbek_oripov_shadow from "~/assets/team/ulugbek_oripov_shadow.png";
import mirodil_ortiqov from "~/assets/team/mirodil_ortiqov.png";
import mirodil_ortiqov_shadow from "~/assets/team/mirodil_ortiqov_shadow.png";
import shahzodjon from "~/assets/team/shahzodjon.png";
import shahzodjon_shadow from "~/assets/team/shahzodjon_shadow.png";
import samandar from "~/assets/team/samandar.png";
import samandar_shadow from "~/assets/team/samandar_shadow.png";
import sevara from "~/assets/team/sevara.png";
import sevara_shadow from "~/assets/team/sevara_shadow.png";

export default () => {
  const { t } = useI18n();

  const staffs = [
    {
      name: t("staffs.bobur.name"),
      position: t("staffs.bobur.position"),
      image: bobur_jalolov,
      shadow: bobur_jalolov_shadow,
    },
    {
      name: t("staffs.abulfayz.name"),
      position: t("staffs.abulfayz.position"),
      image: abulfayz_sayidasqarov,
      shadow: abulfayz_sayidasqarov_shadow,
    },
    {
      name: t("staffs.murodjon.name"),
      position: t("staffs.murodjon.position"),
      image: murodjon_mahmudov,
      shadow: murodjon_mahmudov_shadow,
    },
    {
      name: t("staffs.adhamjon.name"),
      position: t("staffs.adhamjon.position"),
      image: adhamjon_saxodullayev,
      shadow: adhamjon_saxodullayev_shadow,
    },
    {
      name: t("staffs.dilnoza.name"),
      position: t("staffs.dilnoza.position"),
      image: dilnoza_yusupova,
      shadow: dilnoza_yusupova_shadow,
    },
    {
      name: t("staffs.sevara.name"),
      position: t("staffs.sevara.position"),
      image: sevara,
      shadow: sevara_shadow,
    },
    {
      name: t("staffs.ulugbek.name"),
      position: t("staffs.ulugbek.position"),
      image: ulugbek_oripov,
      shadow: ulugbek_oripov_shadow,
    },
    {
      name: t("staffs.mirodil.name"),
      position: t("staffs.mirodil.position"),
      image: mirodil_ortiqov,
      shadow: mirodil_ortiqov_shadow,
    },
    {
      name: t("staffs.shahzod.name"),
      position: t("staffs.shahzod.position"),
      image: shahzodjon,
      shadow: shahzodjon_shadow,
    },
    {
      name: t("staffs.samandar.name"),
      position: t("staffs.samandar.position"),
      image: samandar,
      shadow: samandar_shadow,
    },
  ];

  return staffs;
};
