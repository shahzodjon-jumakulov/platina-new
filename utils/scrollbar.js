const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

export const disableScroll = () => {
  const scrollbarWidth = getScrollbarWidth();
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
};

export const enableScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};
