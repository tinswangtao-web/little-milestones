export function toYamlInline(value: unknown): string {
  const safe = String(value == null ? "" : value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n/g, "\\n")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
  return '"' + safe + '"';
}
