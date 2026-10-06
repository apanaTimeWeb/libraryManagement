import { ManagerRoute } from "./ManagerRoute";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerRoute>{children}</ManagerRoute>;
}
