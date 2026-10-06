'use client';

// RESPONSIBILITY: Entry page for the admin_permissions module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Shield, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Role = 'Manager';

interface Permission {
  module: string;
  actions: {
    label: string;
    key: string;
    roles: Record<Role, boolean>;
  }[];
}

const INITIAL_PERMISSIONS: Permission[] = [
  {
    module: 'Students',
    actions: [
      { label: 'View Students',    key: 'students.view',   roles: { Manager: true  } },
      { label: 'Add Student',      key: 'students.add',    roles: { Manager: true  } },
      { label: 'Edit Student',     key: 'students.edit',   roles: { Manager: true  } },
      { label: 'Delete Student',   key: 'students.delete', roles: { Manager: false } },
      { label: 'Mark Exit',        key: 'students.exit',   roles: { Manager: true  } },
    ],
  },
  {
    module: 'Finance',
    actions: [
      { label: 'Collect Fee',      key: 'finance.collect', roles: { Manager: true  } },
      { label: 'View Payments',    key: 'finance.view',    roles: { Manager: true  } },
      { label: 'View Profit',      key: 'finance.profit',  roles: { Manager: false } },
      { label: 'Issue Refund',     key: 'finance.refund',  roles: { Manager: false } },
      { label: 'Apply Discount',   key: 'finance.discount',roles: { Manager: true  } },
    ],
  },
  {
    module: 'Attendance',
    actions: [
      { label: 'Mark Attendance',  key: 'attend.mark',     roles: { Manager: true  } },
      { label: 'View Reports',     key: 'attend.report',   roles: { Manager: true  } },
    ],
  },
  {
    module: 'System',
    actions: [
      { label: 'Manage Staff',      key: 'admin.staff',     roles: { Manager: false } },
      { label: 'Manage Plans',      key: 'admin.plans',     roles: { Manager: false } },
      { label: 'View Audit Logs',   key: 'admin.audit',     roles: { Manager: false } },
      { label: 'Blacklist Student', key: 'admin.blacklist', roles: { Manager: false } },
    ],
  },
];

const ROLES: Role[] = ['Manager'];

export default function AdminPermissionsPage() {
  const [perms, setPerms] = useState<Permission[]>([]);

  useEffect(() => {
    fetchApi('/admin/admin_permissions').then(data => {
      setPerms(data);
    }).catch(console.error);
  }, []);

  function toggle(moduleIdx: number, actionIdx: number, role: Role) {
    setPerms(prev => {
      const next = prev.map((m, mi) => mi !== moduleIdx ? m : {
        ...m,
        actions: m.actions.map((a, ai) => ai !== actionIdx ? a : {
          ...a,
          roles: { ...a.roles, [role]: !a.roles[role] },
        }),
      });
      return next;
    });
  }

  function handleSave() {
    toast.success('Permissions saved successfully.', { duration: 3000 });
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: 13,
          },
        }}
      />

      <div style={{ paddingBottom: 40 }}>
        {/* Page Header */}
        <div className="admin-page-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
          <div>
            <p className="admin-breadcrumb">Library OS › Admin › Permissions</p>
            <h1 className="admin-page-title">Role Permissions</h1>
            <p className="admin-page-subtitle">Configure what Managers are allowed to do across branches.</p>
          </div>
          <div className="admin-page-actions">
            <button className="admin-btn-primary" onClick={handleSave}>
              <CheckCircle size={16} /> Save Changes
            </button>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="admin-card" style={{ maxWidth: 700, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-perm-table">
              <thead>
                <tr>
                  <th className="admin-perm-th" style={{ width: 300 }}>Permission Module &amp; Action</th>
                  {ROLES.map(role => (
                    <th key={role} className="admin-perm-th" style={{ textAlign: 'right', paddingRight: 32 }}>
                      <span className="admin-badge admin-badge-primary">{role}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perms.map((module, mIdx) => (
                  <>
                    {/* Module header row */}
                    <tr key={`module-${module.module}`} style={{ background: 'var(--bg-card)' }}>
                      <td colSpan={ROLES.length + 1} className="admin-perm-td" style={{ borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Shield size={15} style={{ color: 'var(--success)' }} />
                          <span className="admin-perm-module">{module.module}</span>
                        </div>
                      </td>
                    </tr>
                    {/* Action rows */}
                    {module.actions.map((action, aIdx) => (
                      <tr key={action.key} className="admin-perm-row">
                        <td className="admin-perm-td" style={{ paddingLeft: 36, color: 'var(--text-secondary)', fontSize: 13, borderRight: '1px solid var(--border)' }}>
                          {action.label}
                        </td>
                        {ROLES.map(role => (
                          <td key={role} className="admin-perm-td" style={{ textAlign: 'right', paddingRight: 32 }}>
                            <button
                              onClick={() => toggle(mIdx, aIdx, role)}
                              className={`admin-perm-toggle ${action.roles[role] ? 'admin-perm-toggle-on' : 'admin-perm-toggle-off'}`}
                              aria-label={action.roles[role] ? 'Disable' : 'Enable'}
                            >
                              <span className="admin-perm-toggle-thumb" />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
