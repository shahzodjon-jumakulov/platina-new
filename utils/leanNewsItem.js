// The fields a list card shows (CardSmall, CardCover, BaseOverlayImg,
// BaseMeta and the links built with useNewsUrl). A list item from the CMS also
// carries the full article body, tags, gallery and view counts; a list that is
// rendered on the server would put all of that into the page payload, where
// nothing reads it. Cut a server-rendered list down to this before it is
// stored.
export const leanNewsItem = (item) => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  publish: item.publish,
  category: item.category && {
    name: item.category.name,
    slug: item.category.slug,
  },
  youtube_link: item.youtube_link,
  image_large: item.image_large,
  image_medium: item.image_medium,
  image_small: item.image_small,
  image_name: item.image_name,
});
