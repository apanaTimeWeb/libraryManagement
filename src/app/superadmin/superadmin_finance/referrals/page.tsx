'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/superadmin/superadmin_finance/lib/format';
import { Users, Trophy, Gift, IndianRupee } from 'lucide-react';

type Referrer = {
  id: number;
  name: string;
  smartId: string;
  referredNames: string[];
  referredCount: number;
  bonusEarned: number;
  redeemed: number;
  balance: number;
};

const MOCK_REFERRERS: Referrer[] = [
  { id: 1, name: 'Rahul Kumar',  smartId: 'STU101', referredNames: ['Priya S', 'Aman V', 'Sneha P', 'Vikas S', 'Neha G'], referredCount: 8, bonusEarned: 800, redeemed: 300, balance: 500 },
  { id: 2, name: 'Priya Singh',  smartId: 'STU102', referredNames: ['Aman V', 'Rohan M'],                                   referredCount: 5, bonusEarned: 500, redeemed: 200, balance: 300 },
  { id: 3, name: 'Aman Verma',   smartId: 'STU103', referredNames: ['Sneha P', 'Vikas S'],                                  referredCount: 4, bonusEarned: 400, redeemed: 0,   balance: 400 },
  { id: 4, name: 'Sneha Patel',  smartId: 'STU104', referredNames: ['Neha G', 'Rohan M', 'Kiran D'],                        referredCount: 3, bonusEarned: 300, redeemed: 100, balance: 200 },
  { id: 5, name: 'Vikas Sharma', smartId: 'STU105', referredNames: ['Kiran D'],                                             referredCount: 2, bonusEarned: 200, redeemed: 0,   balance: 200 },
  { id: 6, name: 'Neha Gupta',   smartId: 'STU106', referredNames: ['Rohan M'],                                             referredCount: 1, bonusEarned: 100, redeemed: 0,   balance: 100 },
];

const totalReferrals = MOCK_REFERRERS.reduce((a, r) => a + r.referredCount, 0);
const totalBonus = MOCK_REFERRERS.reduce((a, r) => a + r.bonusEarned, 0);
const topReferrer = MOCK_REFERRERS[0];

export default function Referrals() {
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">Referrals &amp; Bonuses</h1>
        <p className="fin-page-subtitle">Student referral leaderboard and bonus tracking.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">Total Referrals Made</span>
            <Users size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{totalReferrals}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">Total Bonus Issued ₹</span>
            <IndianRupee size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value fin-text-success">{formatCurrency(totalBonus)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">Top Referrer</span>
            <Trophy size={16} className="fin-text-warning" />
          </div>
          <p className="fin-kpi-value">{topReferrer.name}</p>
          <p className="fin-cell-subtext">{topReferrer.referredCount} referrals</p>
        </div>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">Referrer</th>
              <th className="text-left py-3 px-4">Referred Students</th>
              <th className="text-center py-3 px-4">Referred Count</th>
              <th className="text-right py-3 px-4">Bonus Earned ₹</th>
              <th className="text-right py-3 px-4">Redeemed ₹</th>
              <th className="text-right py-3 px-4">Balance ₹</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="fin-table-row">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="fin-skeleton h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : MOCK_REFERRERS.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">👥</div>
                    <p className="fin-empty-state__title">No referrals recorded yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              MOCK_REFERRERS.map((r, idx) => (
                <tr key={r.id} className="fin-table-hover-row fin-table-row">
                    <td className="py-3 px-4">
                      <span className={idx === 0 ? 'fin-text-warning font-bold' : 'fin-text-muted'}>#{idx + 1}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="fin-cell-name">{r.name}</div>
                      <div className="fin-cell-subtext">{r.smartId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      >
                        {expanded === r.id ? '▲' : '▼'} {r.referredCount} students
                      </button>
                      {expanded === r.id && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.referredNames.map((name, i) => (
                            <span key={i} className="fin-badge fin-badge--neutral">{name}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold fin-text-body">{r.referredCount}</td>
                    <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(r.bonusEarned)}</td>
                    <td className="py-3 px-4 text-right fin-text-body">{formatCurrency(r.redeemed)}</td>
                    <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(r.balance)}</td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
