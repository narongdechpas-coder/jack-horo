/**
 * Mobile opening animation: the glowing orb lights up, pulses, then dissolves into the page.
 * Pure CSS (see .splash in globals.css) so it plays before hydration and never blocks taps.
 * SPLASH_INIT_SCRIPT (init-scripts.ts) hides it after the first page of a visit.
 */

export function SplashScreen() {
  return (
    <div className="splash" aria-hidden data-testid="splash">
      <div className="splash-orb ai-orb" />
      <div className="splash-title">
        Horoscope <span>Hub</span>
      </div>
    </div>
  );
}
