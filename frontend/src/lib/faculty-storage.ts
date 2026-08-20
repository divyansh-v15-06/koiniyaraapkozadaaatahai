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

import departmentsRegistry from "@/lib/departments-registry.json";

export function resolveFacultyDepartment(faculty: any, user?: any) {
  const deptSlug = faculty?.department_slug || user?.department_slug;
  const deptCode = faculty?.department_code || user?.department_code;
  const deptName = faculty?.department_name || user?.department_name;

  if (deptSlug) {
    const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === deptSlug.toLowerCase());
    if (found) return found;
  }
  if (deptCode) {
    const found = departmentsRegistry.find((d) => d.code.toLowerCase() === deptCode.toLowerCase());
    if (found) return found;
  }
  if (deptName) {
    const found = departmentsRegistry.find(
      (d) =>
        d.name.toLowerCase().includes(deptName.toLowerCase()) ||
        deptName.toLowerCase().includes(d.name.toLowerCase())
    );
    if (found) return found;
  }

  const identifier = (
    faculty?.employee_code ||
    user?.employee_code ||
    faculty?.email ||
    user?.email ||
    ""
  ).toLowerCase();

  if (identifier.startsWith("ec") || identifier.includes("ece") || identifier.includes("electronics")) {
    return departmentsRegistry.find((d) => d.slug === "ece") || departmentsRegistry[1];
  }
  if (identifier.startsWith("ee") || identifier.includes("elec")) {
    return departmentsRegistry.find((d) => d.slug === "ee") || departmentsRegistry[2];
  }
  if (identifier.startsWith("me") || identifier.includes("mech")) {
    return departmentsRegistry.find((d) => d.slug === "me") || departmentsRegistry[3];
  }
  if (identifier.startsWith("ce") || identifier.includes("civil")) {
    return departmentsRegistry.find((d) => d.slug === "ce") || departmentsRegistry[4];
  }
  if (identifier.startsWith("ch") || identifier.includes("chem")) {
    return departmentsRegistry.find((d) => d.slug === "che") || departmentsRegistry[5];
  }
  if (identifier.startsWith("ar") || identifier.includes("arch")) {
    return departmentsRegistry.find((d) => d.slug === "arch") || departmentsRegistry[7];
  }
  if (identifier.startsWith("ma") || identifier.includes("math")) {
    return departmentsRegistry.find((d) => d.slug === "maths") || departmentsRegistry[8];
  }
  if (identifier.startsWith("ph") || identifier.includes("phys")) {
    return departmentsRegistry.find((d) => d.slug === "physics") || departmentsRegistry[9];
  }
  if (identifier.startsWith("cy") || identifier.includes("chemistry")) {
    return departmentsRegistry.find((d) => d.slug === "chemistry") || departmentsRegistry[10];
  }
  if (identifier.startsWith("ms") || identifier.includes("mgmt")) {
    return departmentsRegistry.find((d) => d.slug === "management") || departmentsRegistry[12];
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("active_department_slug");
    if (saved) {
      const found = departmentsRegistry.find((d) => d.slug.toLowerCase() === saved.toLowerCase());
      if (found) return found;
    }
  }

  return departmentsRegistry[0]; // CSE default
}

