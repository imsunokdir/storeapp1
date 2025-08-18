import { useEffect } from "react";

export const saveScrollPosition = (key = "storesScroll") => {
  sessionStorage.setItem(key, window.scrollY);
};

export const restoreScrollPosition = (key = "storesScroll") => {
  const pos = sessionStorage.getItem(key);
  if (pos) {
    window.scrollTo(0, parseInt(pos, 10));
  }
};

export const useRestoreScroll = (key = "storesScroll") => {
  useEffect(() => {
    restoreScrollPosition(key);
  }, [key]);
};
