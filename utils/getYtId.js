export default function (url, onlyId = false) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  if (onlyId) {
    return match && match[8].length > 0 ? match[8] : null;
  }

  if (match && match[8].length > 0) {
    return `https://youtube.com/embed/${match[8]}?rel=0&modestbranding=1`;
  }

  if (match && match[7].length == 11)
    return `https://youtube.com/embed/${match[7]}?rel=0&modestbranding=1`;
  const regexp2 = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match2 = url.match(regexp2);
  if (match2)
    return `https://youtube.com/embed/${match2[1]}?rel=0&modestbranding=1`;
}
