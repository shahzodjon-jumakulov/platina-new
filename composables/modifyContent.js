export default (html, fallbackAlt = "") => {
  const { baseURL } = useRuntimeConfig().public;

  let updatedHtml = String(html ?? "");

  // Rewrite each <img> in a single pass: absolutise CMS-relative sources, and
  // add the alt / lazy-loading / decoding attributes the editor doesn't emit.
  updatedHtml = updatedHtml.replace(/<img\b[^>]*>/gi, (tag) => {
    let out = tag;

    const src = out.match(/\ssrc="([^"]*)"/i)?.[1];
    if (src && src.startsWith("/")) {
      out = out.replace(`src="${src}"`, `src="${baseURL}${src}"`);
    }

    // Body images arrived with no alt at all.
    if (!/\salt=/i.test(out) && fallbackAlt) {
      out = out.replace(/<img\b/i, `<img alt="${escapeAttr(fallbackAlt)}"`);
    }

    // Everything inside the article body is below the fold.
    if (!/\sloading=/i.test(out)) {
      out = out.replace(/<img\b/i, "<img loading=\"lazy\"");
    }
    if (!/\sdecoding=/i.test(out)) {
      out = out.replace(/<img\b/i, "<img decoding=\"async\"");
    }

    return out;
  });

  updatedHtml = updatedHtml.replaceAll(
    /<oembed url="([^"]+)"><\/oembed>/g,
    (match, p1) => {
      const youtubeLink = getYtId(p1);
      return `<iframe src="${youtubeLink}" class="w-full aspect-[16/9] rounded-2xl" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    }
  );

  function cleanText(text) {
    return text.replaceAll("&nbsp;", " ");
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  updatedHtml = cleanText(updatedHtml);
  return updatedHtml;
};
