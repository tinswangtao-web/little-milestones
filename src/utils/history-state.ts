interface KidScoreHistoryState {
  kidScoreOverlayId?: unknown;
}

export function hasKidScoreOverlayId(
  state: unknown,
  overlayStateId: string
): boolean {
  return (
    typeof state === "object" &&
    state !== null &&
    (state as KidScoreHistoryState).kidScoreOverlayId === overlayStateId
  );
}
