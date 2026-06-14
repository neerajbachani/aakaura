const KEY = "cartSuccessModalSeen";

export function hasSeenCartSuccessModal(): boolean {
  return typeof window !== "undefined" && sessionStorage.getItem(KEY) === "true";
}

export function markCartSuccessModalSeen(): void {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, "true");
}
