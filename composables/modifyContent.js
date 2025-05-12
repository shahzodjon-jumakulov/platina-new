export default (html) => {
  const { baseURL } = useRuntimeConfig().public;
  const regex = /<img [^>]*src="([^"]*)"/g;
  let updatedHtml = html;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith("/"))
      updatedHtml = updatedHtml.replace(src, baseURL + src);
  }

  updatedHtml = updatedHtml.replaceAll(
    /<oembed url="([^"]+)"><\/oembed>/g,
    (match, p1) => {
      const youtubeLink = getYtId(p1);
      return `<iframe src="${youtubeLink}" class="w-full aspect-[16/9] rounded-2xl" frameborder="0" allowfullscreen></iframe>`;
    }
  );

  function cleanText(text) {
    return text.replaceAll("&nbsp;", " ");
  }

  updatedHtml = cleanText(updatedHtml);
  return updatedHtml;
};
