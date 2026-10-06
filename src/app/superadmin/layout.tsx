import { SuperadminRoute } from "./SuperadminRoute";

export default function SuperAdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SuperadminRoute>{children}</SuperadminRoute>;
}
