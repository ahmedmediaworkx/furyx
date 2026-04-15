import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Crown, Eye, KeyRound, Palette, Shield, Users } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canCreateWorkspace, canEditWorkspace, canManageWorkspace } from "@/lib/permissions";
import { getRoleLabel, type UserRole } from "@/lib/roles";

const roleDetails: Record<
  UserRole,
  {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  owner: {
    title: "Owner",
    description: "Full workspace control. Can create boards, manage access, and delete anything.",
    icon: Crown
  },
  admin: {
    title: "Admin",
    description: "Can manage boards and team access, but does not own the workspace by default.",
    icon: Shield
  },
  member: {
    title: "Member",
    description: "Can collaborate on boards and update work items, but cannot manage access.",
    icon: Users
  },
  viewer: {
    title: "Viewer",
    description: "Read-only access for stakeholders who need visibility without edit permissions.",
    icon: Eye
  }
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = session.user.role ?? "member";
  const details = roleDetails[role];
  const canCreateBoard = canCreateWorkspace(role);
  const canEditBoard = canEditWorkspace(role);
  const canManageBoard = canManageWorkspace(role);
  const displayName = session.user.name ?? "User";
  const email = session.user.email ?? "";

  const permissions = [
    {
      label: "Create boards",
      allowed: canCreateBoard,
      description: canCreateBoard ? "You can spin up new workspaces from the dashboard." : "Board creation is reserved for owners and admins."
    },
    {
      label: "Edit tasks and columns",
      allowed: canEditBoard,
      description: canEditBoard ? "You can move cards, edit details, and keep work flowing." : "Viewers can inspect work but cannot change it."
    },
    {
      label: "Manage members",
      allowed: canManageBoard,
      description: canManageBoard ? "You can invite teammates, remove members, and govern access." : "Ask an owner or admin to adjust team access."
    }
  ];

  const matrix = ["owner", "admin", "member", "viewer"] as const;

  return (
    <div className="flex h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Button asChild variant="ghost" className="w-fit px-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
            <div className="space-y-1">
              <Badge className="w-fit rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em]">
                {getRoleLabel(role)} Access
              </Badge>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight">Settings</h1>
              <p className="text-lg text-muted-foreground">Your workspace access and personal preferences, organized around your role.</p>
            </div>
          </div>

          <Card className="w-full max-w-md border-primary/20 bg-primary/5 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <details.icon className="h-5 w-5" />
                </div>
                {details.title}
              </CardTitle>
              <CardDescription>{details.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Signed in as</p>
                <p className="mt-2 text-lg font-bold text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Can edit</p>
                  <p className="mt-1 font-bold text-foreground">{canEditBoard ? "Yes" : "No"}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Can manage</p>
                  <p className="mt-1 font-bold text-foreground">{canManageBoard ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {permissions.map((permission) => (
            <Card key={permission.label} className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${permission.allowed ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  {permission.label}
                </CardTitle>
                <CardDescription>{permission.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <KeyRound className="h-5 w-5 text-primary" />
                Role Matrix
              </CardTitle>
              <CardDescription>Every role in FuryX, from full control to read-only visibility.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {matrix.map((matrixRole) => {
                const active = matrixRole === role;
                const meta = roleDetails[matrixRole];
                const Icon = meta.icon;

                return (
                  <div
                    key={matrixRole}
                    className={`rounded-3xl border p-4 transition-all ${active ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border/70 bg-background/60"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-heading text-lg font-bold">{meta.title}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{active ? "Current role" : "Other role"}</p>
                        </div>
                      </div>
                      {active ? <Badge className="rounded-full px-3 py-1">Active</Badge> : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{meta.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Palette className="h-5 w-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Your theme and accent color are managed from the user menu for now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4">
                <p className="font-semibold text-foreground">Appearance</p>
                <p className="mt-1 leading-6">Use the avatar menu in the header to switch light and dark mode or change the accent color.</p>
              </div>
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4">
                <p className="font-semibold text-foreground">Role guidance</p>
                <p className="mt-1 leading-6">
                  {canManageBoard
                    ? "Owners and admins can invite teammates and manage board access from the team endpoints."
                    : "Your workspace owner controls access. Ask them if you need a different role."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}