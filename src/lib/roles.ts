export const USER_ROLES = ["owner", "member", "viewer", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    case "viewer":
      return "Viewer";
  }
}
