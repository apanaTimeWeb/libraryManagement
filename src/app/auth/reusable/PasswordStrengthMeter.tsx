'use client';

type Score = 0 | 1 | 2 | 3 | 4;

const SEGMENT_CLASS: Record<number, string> = {
  1: 'auth-strength-segment--weak',
  2: 'auth-strength-segment--fair',
  3: 'auth-strength-segment--good',
  4: 'auth-strength-segment--strong',
};

const LABEL: Record<number, { text: string; color: string }> = {
  1: { text: 'Weak',   color: 'var(--danger)'  },
  2: { text: 'Fair',   color: 'var(--warning)'  },
  3: { text: 'Good',   color: 'var(--success)'  },
  4: { text: 'Strong', color: 'var(--success)'  },
};

function calcScore(pwd: string): Score {
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s as Score;
}

export default function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = calcScore(password);
  const segClass = SEGMENT_CLASS[score] ?? '';
  const label = LABEL[score];

  return (
    <div className="pt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`auth-strength-segment ${i < score ? segClass : ''}`}
          />
        ))}
      </div>
      {label && (
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: label.color }}>
          {label.text}
        </p>
      )}
    </div>
  );
}
