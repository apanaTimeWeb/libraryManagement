import './crm.css';

export default function CrmInnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="crm-theme h-full">{children}</div>;
}
