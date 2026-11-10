import { useEffect } from "react";

/**
 * The React side of "/". The launch home page is plain HTML and scripts (see
 * home/mount.ts) booted by main.tsx on a full page load, so when the app itself
 * navigates to "/" (the "Home" tab, or the catch-all redirect) it hands over with a
 * real navigation instead of rendering anything here.
 */
export function HomeReload() {
  useEffect(() => {
    window.location.replace(window.location.href);
  }, []);
  return null;
}
