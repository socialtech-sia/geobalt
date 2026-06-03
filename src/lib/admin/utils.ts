export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[āăą]/g, "a")
    .replace(/[čć]/g, "c")
    .replace(/[ēėę]/g, "e")
    .replace(/[ģ]/g, "g")
    .replace(/[īį]/g, "i")
    .replace(/[ķ]/g, "k")
    .replace(/[ļł]/g, "l")
    .replace(/[ņń]/g, "n")
    .replace(/[ōøő]/g, "o")
    .replace(/[ŗ]/g, "r")
    .replace(/[šś]/g, "s")
    .replace(/[ūų]/g, "u")
    .replace(/[žźż]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function useUnsavedGuard(dirty: boolean) {
  if (typeof window === "undefined") return;
  // attach beforeunload
  if (dirty) {
    window.onbeforeunload = () => "Есть несохранённые изменения";
  } else {
    window.onbeforeunload = null;
  }
}
