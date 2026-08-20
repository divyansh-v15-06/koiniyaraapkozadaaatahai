"use client";

/**
 * Faculty Persistent Storage Manager
 * Ensures that all added, edited, and deleted records (publications, projects, patents,
 * consultancies, supervisions, events, qualifications, teaching exp, admin exp, honors,
 * expert talks, exposures, and profile info) persist across page reloads and sync seamlessly.
 */

export function getFacultyStorageKey(faculty: any, section: string): string {
  const identifier =
    faculty?.employee_code?.toLowerCase() ||
    faculty?.id?.toLowerCase() ||
    faculty?.email?.toLowerCase() ||
    "default";
  return `nith_faculty_${section}_${identifier}`;
}

export function getStoredData<T>(faculty: any, section: string, defaultFallback: T[]): T[] {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const key = getFacultyStorageKey(faculty, section);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error(`Error reading persistent storage for ${section}:`, err);
  }
  return defaultFallback;
}

export function setStoredData<T>(faculty: any, section: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    const key = getFacultyStorageKey(faculty, section);
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for cross-tab or cross-component reactivity
    window.dispatchEvent(
      new CustomEvent("nith_faculty_storage_update", {
        detail: { section, key, count: data.length },
      })
    );
  } catch (err) {
    console.error(`Error writing persistent storage for ${section}:`, err);
  }
}

export function getStoredObject<T>(faculty: any, section: string, defaultFallback: T): T {
  if (typeof window === "undefined") return defaultFallback;
  try {
    const key = getFacultyStorageKey(faculty, section);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading persistent object for ${section}:`, err);
  }
  return defaultFallback;
}

export function setStoredObject<T>(faculty: any, section: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const key = getFacultyStorageKey(faculty, section);
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("nith_faculty_storage_update", {
        detail: { section, key },
      })
    );
  } catch (err) {
    console.error(`Error writing persistent object for ${section}:`, err);
  }
}
