import type { UserRole } from "@/lib/roles";

export function canCreateWorkspace(role: UserRole) {
  return role === "owner" || role === "admin";
}

export function canManageWorkspace(role: UserRole) {
  return role === "owner" || role === "admin";
}

export function canEditWorkspace(role: UserRole) {
  return role === "owner" || role === "admin" || role === "member";
}
