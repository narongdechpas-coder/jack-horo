// Inline <head> scripts that run before first paint. Kept out of "use client" files so the
// server layout gets the real strings, not client references.

/** Applies a saved theme so it never flashes the other one. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/** Shows the mobile opening animation (SplashScreen) only on the first page of a visit. */
export const SPLASH_INIT_SCRIPT = `try{if(sessionStorage.getItem("splash"))document.documentElement.dataset.splash="seen";else sessionStorage.setItem("splash","1")}catch(e){}`;
