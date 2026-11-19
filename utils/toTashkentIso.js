/**
 * Naive Tashkent wall-clock timestamp from the CMS ("2026-10-01T13:04:48")
 * → ISO 8601 with its offset ("2026-10-01T13:04:48+05:00"). Uzbekistan has no
 * DST, so the offset is always +05:00. Values that already carry an offset are
 * returned unchanged; empty values give undefined so meta tags are omitted.
 */
export default (value) => {
  if (!value) return undefined;
  const s = String(value).trim().replace(" ", "T").replace(/\.\d+/, "");
  return /(Z|[+-]\d\d:?\d\d)$/i.test(s) ? s : `${s}+05:00`;
};
