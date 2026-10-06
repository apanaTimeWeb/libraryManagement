'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle, X, RefreshCw } from 'lucide-react';

interface ScanResult {
  name: string; initials: string; smartId: string;
  shift: string; validTill: string; plan: string;
}

const MOCK_STUDENT: ScanResult = {
  name: 'Rahul Sharma', initials: 'RS',
  smartId: 'SL-001', shift: 'Morning',
  validTill: '30 Jun 2026', plan: 'Premium – 6 Month',
};

type ScanState = 'idle' | 'scanning' | 'detected' | 'success';

export default function QrScannerPage() {
  const [scanState, setScanState]   = useState<ScanState>('idle');
  const [result, setResult]         = useState<ScanResult | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [history, setHistory]       = useState<{name:string;type:string;time:string;id:string}[]>([]);
  const [manualId, setManualId]     = useState('');
  const [showManual, setShowManual] = useState(false);

  const startScan = () => setScanState('scanning');

  const simulateScan = () => {
    if (scanState !== 'scanning') return;
    setScanState('detected');
    setResult(MOCK_STUDENT);
  };

  const markAttendance = (type: 'IN' | 'OUT') => {
    const student = result;
    if (!student) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    setSuccessMsg(`${student.name} marked ${type} at ${time}`);
    setHistory(h => [{
      name: student.name, type, time,
      id: student.smartId + '-' + Date.now(),
    }, ...h.slice(0, 4)]);
    setScanState('success');
    setTimeout(() => { setScanState('idle'); setResult(null); setSuccessMsg(''); }, 3000);
  };

  const handleManual = (type: 'IN' | 'OUT') => {
    if (!manualId.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    setSuccessMsg(`Smart ID ${manualId} marked ${type} at ${time}`);
    setHistory(h => [{ name: `#${manualId}`, type, time, id: manualId + Date.now() }, ...h.slice(0,4)]);
    setScanState('success');
    setManualId(''); setShowManual(false);
    setTimeout(() => { setScanState('idle'); setSuccessMsg(''); }, 3000);
  };

  const reset = () => { setScanState('idle'); setResult(null); setSuccessMsg(''); };

  return (
    <div className="eng-page">
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href="/superadmin/superadmin_engagement/attendance">Engagement</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep"/>
        <span>QR Scanner</span>
      </div>

      <div className="eng-page-header">
        <h1 className="eng-page-title">📷 QR Scanner</h1>
        <p className="eng-page-subtitle">Scan student ID cards to instantly mark attendance.</p>
      </div>

      <div className="eng-qr-page">

        {/* ── Camera Viewport ── */}
        <div className="eng-card eng-mb-4">
          <div className="eng-card-header">
            <div>
              <div className="eng-card-title">Camera Feed</div>
              <div className="eng-card-desc">
                {scanState === 'idle'     && 'Click Start Scan to activate camera'}
                {scanState === 'scanning' && 'Point camera at student ID card QR code'}
                {scanState === 'detected' && 'QR code detected — confirm attendance below'}
                {scanState === 'success'  && 'Attendance recorded successfully!'}
              </div>
            </div>
            {scanState !== 'idle' && (
              <button onClick={reset} className="eng-btn eng-btn--ghost eng-btn--sm">
                <RefreshCw size={13}/> Reset
              </button>
            )}
          </div>

          <div
            className="eng-qr-viewport"
            data-scanning={scanState === 'scanning' ? 'true' : undefined}
            onClick={scanState === 'scanning' ? simulateScan : undefined}
          >
            <div className="eng-qr-feed">
              {scanState === 'success' ? (
                <div className="eng-qr-success-anim">
                  <CheckCircle size={72} className="eng-qr-success-icon"/>
                  <p className="eng-qr-success-msg">{successMsg}</p>
                </div>
              ) : scanState === 'detected' ? (
                <div className="eng-qr-success-anim">
                  <div className="eng-qr-detected-icon">✅</div>
                  <p className="eng-qr-success-msg">QR Code Detected!</p>
                </div>
              ) : (
                <>
                  <div className="eng-qr-feed-icon">
                    {scanState === 'scanning' ? '📷' : '🔲'}
                  </div>
                  <p className="eng-qr-feed-label">
                    {scanState === 'idle' ? 'Camera inactive' : 'Tap to simulate scan'}
                  </p>
                  {scanState === 'scanning' && (
                    <p className="eng-qr-feed-hint">Click anywhere in this area</p>
                  )}
                </>
              )}
            </div>

            {/* Corner guides */}
            <div className="eng-corner eng-corner--tl"/>
            <div className="eng-corner eng-corner--tr"/>
            <div className="eng-corner eng-corner--bl"/>
            <div className="eng-corner eng-corner--br"/>

            {/* Scan animation line */}
            {scanState === 'scanning' && <div className="eng-scan-line"/>}
          </div>

          {/* Start button */}
          {scanState === 'idle' && (
            <button onClick={startScan} className="eng-btn eng-btn--primary eng-qr-start-btn">
              📷 Start Scanning
            </button>
          )}
        </div>

        {/* ── Detected Student Card ── */}
        {scanState === 'detected' && result && (
          <div className="eng-result-card">
            <div className="eng-result-header">
              <div className="eng-result-avatar">{result.initials}</div>
              <div className="eng-result-info">
                <div className="eng-result-name">{result.name}</div>
                <div className="eng-result-meta">
                  <span className="eng-result-id">{result.smartId}</span>
                  <span className="eng-badge eng-badge--primary">{result.shift}</span>
                  <span className="eng-badge eng-badge--success">{result.plan}</span>
                </div>
                <div className="eng-result-valid">Valid till: {result.validTill}</div>
              </div>
              <button onClick={reset} className="eng-btn eng-btn--icon">
                <X size={15}/>
              </button>
            </div>
            <div className="eng-result-actions">
              <button onClick={() => markAttendance('IN')} className="eng-btn eng-btn--success">
                ✅ Mark IN
              </button>
              <button onClick={() => markAttendance('OUT')} className="eng-btn eng-btn--danger">
                🔚 Mark OUT
              </button>
            </div>
          </div>
        )}

        {/* ── Recent History ── */}
        {history.length > 0 && (
          <div className="eng-card eng-mt-4">
            <div className="eng-card-title eng-mb-4">Recent Scans</div>
            {history.map((h: any) => (
              <div key={h.id} className="eng-scan-history-row">
                <span className={`eng-badge ${h.type==='IN' ? 'eng-badge--success' : 'eng-badge--danger'}`}>
                  {h.type}
                </span>
                <span className="eng-flex-1">{h.name}</span>
                <span className="eng-td-muted">{h.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Manual Fallback ── */}
        <div className="eng-manual-toggle">
          {!showManual ? (
            <button onClick={() => setShowManual(true)} className="eng-link-btn">
              Can't scan? Enter Smart ID manually →
            </button>
          ) : (
            <div className="eng-card eng-manual-card">
              <div className="eng-card-title--manual">Manual Entry</div>
              <div className="eng-field">
                <label className="eng-label">Smart ID <span className="eng-required">*</span></label>
                <input className="eng-input" placeholder="e.g. SL-001"
                  value={manualId} onChange={e => setManualId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManual('IN')} />
              </div>
              <div className="eng-manual-actions">
                <button onClick={() => handleManual('IN')} disabled={!manualId.trim()}
                  className="eng-btn eng-btn--success">✅ Mark IN</button>
                <button onClick={() => handleManual('OUT')} disabled={!manualId.trim()}
                  className="eng-btn eng-btn--danger">🔚 Mark OUT</button>
                <button onClick={() => setShowManual(false)} className="eng-btn eng-btn--ghost">Cancel</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
