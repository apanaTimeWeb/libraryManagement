'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Printer, MessageSquare, IdCard, CheckCircle2 } from 'lucide-react';
import StudentIdCard, { type IdCardData } from './StudentIdCard';
import {
  formatIdCardMessage,
  openWhatsApp,
  calcExpiryDate,
  formatDateIN,
  type StudentWhatsAppData,
} from '@/lib/whatsappUtils';
import { printThermal } from '@/lib/thermalPrint';
import { fetchStudents } from '../manager_students_api/manager_students_api';
import type { Student } from '../manager_students_types';

export function IdCardClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [search, setSearch]         = useState('');

  useEffect(() => {
    fetchStudents().then(setStudents).catch(console.error);
  }, []);

  const filtered = useMemo(() =>
    students.filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.smartId.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
    ),
    [students, search]
  );

  const selected = useMemo(
    () => students.find(s => s.smartId === selectedId),
    [students, selectedId]
  );

  const cardData: IdCardData | null = useMemo(() => {
    if (!selected) return null;
    const [dd, mm, yyyy] = selected.joined.split('/');
    const joinDate   = new Date(`${yyyy}-${mm}-${dd}`);
    const expiryDate = calcExpiryDate(joinDate, selected.plan);
    return {
      name:       selected.name,
      smartId:    selected.smartId,
      phone:      selected.phone,
      shift:      selected.shift,
      seat:       selected.seat,
      locker:     'None',
      plan:       selected.plan,
      joinDate:   formatDateIN(joinDate),
      expiryDate: formatDateIN(expiryDate),
      branch:     selected.branch,
    };
  }, [selected]);

  const waData: StudentWhatsAppData | null = useMemo(() => {
    if (!cardData || !selected) return null;
    const paid = selected.due > 0 ? (1500 - selected.due) : 1500;
    return {
      ...cardData,
      parentPhone:  undefined,
      amountPaid:   paid,
      totalPayable: 1500,
      discount:     0,
      paymentMode:  'UPI',
    };
  }, [cardData, selected]);

  function handleSendWhatsApp() {
    if (!waData || !selected) return;
    openWhatsApp(selected.phone, formatIdCardMessage(waData));
  }

  function handlePrint() {
    if (!cardData || !selected) return;
    printThermal({
      type:        'idcard',
      shopName:    'Library OS',
      branch:      selected.branch,
      studentName: cardData.name,
      smartId:     cardData.smartId,
      phone:       cardData.phone,
      shift:       cardData.shift,
      seat:        cardData.seat,
      locker:      cardData.locker,
      plan:        cardData.plan,
      joinDate:    cardData.joinDate,
      expiryDate:  cardData.expiryDate,
    });
  }

  return (
    <div className="mgr-page">

      <div className="mgr-page-header">
        <div>
          <Link href="/manager/manager_students" className="mgr-back-link">
            <ArrowLeft size={14} /> Back to Students
          </Link>
          <h1 className="mgr-page-title">ID Card Generator</h1>
          <p className="mgr-page-subtitle">Search → click student → preview → print or send via WhatsApp</p>
        </div>
      </div>

      <div className="mgr-idcard-page-layout">

        {/* LEFT — selector */}
        <div>
          <div className="mgr-card">
            <div className="mgr-card-header">
              <h2 className="mgr-section-title">
                <IdCard size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Select Student
              </h2>
              {selected && (
                <span className="mgr-badge mgr-badge--success">
                  <CheckCircle2 size={11} /> {selected.name}
                </span>
              )}
            </div>
            <div className="mgr-card-body">
              <div className="mgr-input-icon-wrap" style={{ marginBottom: 14 }}>
                <Search size={14} className="mgr-input-icon" />
                <input
                  className="mgr-input mgr-input-with-icon"
                  placeholder="Search name, Smart ID, phone…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="mgr-idcard-student-list">
                {filtered.length === 0 && (
                  <div className="mgr-empty-state">
                    <div className="mgr-empty-icon">🔍</div>
                    <p className="mgr-empty-title">No students found</p>
                  </div>
                )}
                {filtered.map(s => {
                  const initials = s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={s.smartId}
                      onClick={() => setSelectedId(s.smartId)}
                      className={`mgr-idcard-student-row${s.smartId === selectedId ? ' mgr-idcard-student-row--active' : ''}`}
                    >
                      <div className="mgr-avatar-sm">{initials}</div>
                      <div className="mgr-idcard-student-info">
                        <p className="mgr-cell-name">{s.name}</p>
                        <p className="mgr-cell-sub">{s.smartId} · {s.shift} · Seat {s.seat}</p>
                      </div>
                      <span className={
                        s.status === 'Active'    ? 'mgr-badge mgr-badge--success' :
                        s.status === 'Suspended' ? 'mgr-badge mgr-badge--warning' :
                                                   'mgr-badge mgr-badge--danger'
                      }>{s.status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selected && cardData && (
            <div className="mgr-card mgr-idcard-actions-card">
              <div className="mgr-card-header">
                <h2 className="mgr-section-title">Actions</h2>
              </div>
              <div className="mgr-card-body mgr-idcard-actions-body">
                <button className="mgr-btn-whatsapp" onClick={handleSendWhatsApp}>
                  <MessageSquare size={16} />
                  Send ID Card via WhatsApp
                </button>
                <button
                  className="mgr-btn-ghost"
                  onClick={handlePrint}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Printer size={15} />
                  Print ID Card (Thermal)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — preview */}
        <div className="mgr-idcard-preview-panel">
          {cardData ? (
            <>
              <p className="mgr-page-subtitle mgr-idcard-preview-label">
                Preview — {selected?.name}
              </p>
              <StudentIdCard data={cardData} />
              <p className="mgr-cell-sub mgr-idcard-preview-hint">
                Use buttons on the left to print (80mm thermal) or send via WhatsApp
              </p>
            </>
          ) : (
            <div className="mgr-card mgr-idcard-empty-card">
              <div className="mgr-empty-state">
                <div className="mgr-empty-icon">🪪</div>
                <p className="mgr-empty-title">No student selected</p>
                <p className="mgr-empty-sub">Search and click a student to preview their ID card.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
