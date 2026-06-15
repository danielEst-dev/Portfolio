import { useSyncExternalStore } from "react";

/**
 * Returns true if the user is on macOS/iOS, false otherwise.
 * Safe for SSR — returns false on the server.
 */
export function useIsMac() {
  return useSyncExternalStore(
    () => () => {},
    () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent),
    () => false
  );
}
