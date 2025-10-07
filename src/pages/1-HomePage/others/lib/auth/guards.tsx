import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import { ROLE_BASE, UserRole } from "./role";

type AuthGuardProps = {
  required?: "any" | UserRole | UserRole[];
  children: ReactNode;
};

export function AuthGuard({ required = "any", children }: AuthGuardProps) {
  const { isAuthenticated, profile } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (required === "any") return <>{children}</>;

  const allowed = Array.isArray(required) ? required : [required];
  if (profile?.role && allowed.includes(profile.role as UserRole)) {
    return <>{children}</>;
  }

  const fallback = profile?.role ? ROLE_BASE[profile.role as UserRole] : "/";
  return <Navigate to={fallback} replace />;
}

type RoleGuardProps = {
  allow: UserRole[];
  children: ReactNode;
};

export function RoleGuard({ allow, children }: RoleGuardProps) {
  return <AuthGuard required={allow}>{children}</AuthGuard>;
}


