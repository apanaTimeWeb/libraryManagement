export const getMockData = (url: string) => {
  // Common students for reuse
  const mockStudents = [
    { id: '1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '9876543210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main', plan: 'Monthly', due: 0, joined: '01/01/2024' },
    { id: '2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '9876543211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main', plan: 'Quarterly', due: 1500, joined: '15/02/2024' },
    { id: '3', smartId: 'LIB-003', name: 'Rohan Mehta', phone: '9876543212', status: 'Suspended', shift: 'Morning', seat: 'S-22', branch: 'Main', plan: 'Half-Yearly', due: 500, joined: '10/03/2024' }
  ];

  const mockEnquiries = [
    { id: "enq_001", name: "Aarav Sharma", phone: "9876500022", preferredShift: "Morning", status: "New", createdAt: "2026-05-24T10:00:00Z", source: "Google Ads", handledBy: { name: "Sarah Jenkins" }, enquiryDate: "May 24, 2025", preferredBranch: "Downtown Hub", avatar: "AS", isOverdue: true },
    { id: "enq_002", name: "Ishani Gupta", phone: "9765444120", preferredShift: "Night", status: "New", createdAt: "2026-05-25T14:30:00Z", source: "Instagram", handledBy: { name: "Mike Ross" }, enquiryDate: "May 25, 2025", preferredBranch: "Uptown Branch", avatar: "IG", isToday: true }
  ];

  if (url.includes('/crm/enquiries')) return mockEnquiries;
  
  if (url.includes('/students')) return mockStudents;
  
  if (url.includes('/manager_dashboard')) {
    return {
      kpiData: [
        { title: 'Total Members', value: '1,293', trend: '+18 today', icon: 'Users', iconClass: 'mgr-icon-primary' },
        { title: 'Active Seats', value: '845', trend: '85% occupancy', icon: 'Armchair', iconClass: 'mgr-icon-success' },
        { title: 'Today Revenue', value: '₹14,500', trend: 'from 8 renewals', icon: 'CalendarCheck', iconClass: 'mgr-icon-warning' }
      ],
      seatData: Array.from({ length: 60 }, (_, i) => ({
        id: `S${i + 1}`,
        shift: i < 20 ? 'Morning' : i < 40 ? 'Afternoon' : 'Evening',
        status: i % 5 === 0 ? 'free' : 'occupied',
        occupant: i % 5 === 0 ? null : `Student ${i + 1}`
      })),
      actionItems: [
        { title: 'Renewals Due Today', count: 12, countClass: 'mgr-badge mgr-badge--danger', showRenew: true, href: '/manager/manager_finance/renewals' },
        { title: 'New Enquiries', count: 5, countClass: 'mgr-badge mgr-badge--warning', showRenew: false, href: '/manager/manager_crm/enquiries' },
        { title: 'Open Complaints', count: 2, countClass: 'mgr-badge mgr-badge--info', showRenew: false, href: '/manager/manager_communication/complaints' }
      ],
      recentAdmissions: mockStudents,
      recentEnquiries: mockEnquiries
    };
  }

  if (url.includes('seat-matrix') || url.includes('seats')) {
    return Array.from({ length: 120 }, (_, i) => ({
      id: String(i + 1),
      seatNumber: `S-${String(i + 1).padStart(2, '0')}`,
      isActive: i % 15 !== 0,
      shift: i < 40 ? 'Morning' : i < 80 ? 'Afternoon' : 'Evening',
      status: i % 7 === 0 ? 'free' : i % 11 === 0 ? 'expiring' : i % 15 === 0 ? 'maintenance' : 'occupied',
      student: i % 7 !== 0 && i % 15 !== 0 ? `Student ${i + 1}` : undefined,
      expiry: '10/10/2026'
    }));
  }
  
  if (url.includes('lockers') || url.includes('locker-matrix')) {
     return Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      lockerNumber: `L-${String(i + 1).padStart(2, '0')}`,
      isActive: i % 9 !== 0,
      status: i % 4 === 0 ? 'free' : i % 9 === 0 ? 'maintenance' : 'occupied',
      student: i % 4 !== 0 && i % 9 !== 0 ? `Student ${i + 1}` : undefined,
    }));
  }
  
  if (url.includes('shift')) {
    return [
      { id: '1', name: 'Morning Shift', timings: '06:00 AM - 02:00 PM', capacity: 150, occupied: 120, fee: 1500 },
      { id: '2', name: 'Afternoon Shift', timings: '02:00 PM - 10:00 PM', capacity: 150, occupied: 145, fee: 1500 },
      { id: '3', name: 'Night Shift', timings: '10:00 PM - 06:00 AM', capacity: 100, occupied: 80, fee: 1800 }
    ];
  }

  if (url.includes('reports') || url.includes('student-reports')) {
    return {
      kpiCards: [
        { title: 'Avg Attendance', value: '88%', trend: '+2% this week', icon: 'Users', iconClass: 'mgr-icon-success' },
        { title: 'New Conversions', value: '45', trend: '15% rate', icon: 'UserPlus', iconClass: 'mgr-icon-primary' },
        { title: 'Open Complaints', value: '4', trend: '-2 since yesterday', icon: 'Phone', iconClass: 'mgr-icon-warning' }
      ],
      occupancyData: [
        { name: 'Morning', value: 40 }, { name: 'Afternoon', value: 35 }, { name: 'Evening', value: 20 }, { name: 'Free', value: 5 }
      ],
      growthData: [
        { date: 'Week 1', joined: 10, exited: 2 },
        { date: 'Week 2', joined: 15, exited: 4 },
        { date: 'Week 3', joined: 25, exited: 5 },
        { date: 'Week 4', joined: 45, exited: 10 }
      ],
      attendanceData: [
        { day: 'Mon', avg: 90 }, { day: 'Tue', avg: 85 }, { day: 'Wed', avg: 88 }, { day: 'Thu', avg: 92 }, { day: 'Fri', avg: 80 }
      ],
      absenteesChartData: [
        { name: 'Alex Rivera', absences: 5 }, { name: 'Priya Sharma', absences: 3 }, { name: 'Rohan Mehta', absences: 2 }
      ],
      complaintsData: [
        { name: 'Unresolved', value: 30 }, { name: 'Resolved', value: 70 }
      ],
      absenteeRows: [
        { name: 'Alex Rivera', smartId: 'LIB-001', shift: 'Morning', daysAbsent: 5, lastPresent: '24 Sep' },
        { name: 'Priya Sharma', smartId: 'LIB-002', shift: 'Evening', daysAbsent: 3, lastPresent: '26 Sep' }
      ],
      conversionRows: [
        { month: 'September', newEnq: 120, converted: 45, rate: '37%' },
        { month: 'August', newEnq: 100, converted: 30, rate: '30%' }
      ],
      seatRows: [
        { shift: 'Morning', occupancy: '95%', avgDuration: '4.5 hrs' },
        { shift: 'Evening', occupancy: '80%', avgDuration: '3.2 hrs' }
      ],
      lockerRows: [
        { type: 'Small', occupied: 40, total: 50, pct: '80%' },
        { type: 'Large', occupied: 10, total: 20, pct: '50%' }
      ],
      maintenanceRows: [
        { item: 'AC Unit 1', location: 'Hall A', reported: '2 days ago', priority: 'High' },
        { item: 'Chair 12', location: 'Hall B', reported: '5 days ago', priority: 'Medium' }
      ]
    };
  }

  if (url.includes('complaints')) {
    return [
      { id: 'C001', student: 'Alex Rivera', issue: 'AC not working in A-Wing', status: 'Open', date: '2026-10-01' },
      { id: 'C002', student: 'Priya Sharma', issue: 'Chair broken', status: 'Resolved', date: '2026-09-28' }
    ];
  }

  if (url.includes('notices')) {
    return [
      { id: 'N001', title: 'Holiday on Friday', content: 'Library closed on Friday due to festival.', date: '2026-10-01', audience: 'All Students' },
      { id: 'N002', title: 'New Wi-Fi Password', content: 'Password changed to Library@2026', date: '2026-09-30', audience: 'Active Students' }
    ];
  }

  if (url.includes('finance') || url.includes('accounting')) {
    return [
      { id: 'TXN-001', studentName: 'Ravi Kumar', amount: 1200, type: 'Membership', date: '2026-09-30', status: 'paid' },
      { id: 'TXN-002', studentName: 'Sneha Mehta', amount: 600, type: 'Fine', date: '2026-09-29', status: 'paid' }
    ];
  }
  
  if (url.includes('assets') || url.includes('maintenance')) {
    return [
       { id: 'A001', name: 'AC Unit 1', category: 'HVAC', status: 'Active', nextService: '2026-11-01' },
       { id: 'A002', name: 'Water Cooler', category: 'Appliance', status: 'Maintenance', nextService: '2026-10-05' }
    ];
  }
  
  if (url.includes('documents')) {
    return [
      { id: 'D001', name: 'Student Rules.pdf', size: '2 MB', uploadedBy: 'Admin', date: '2026-01-10' }
    ];
  }

  // Fallback for everything else
  return [
    { id: 'mock_1', name: 'Mock Data 1', status: 'Active', value: '100' },
    { id: 'mock_2', name: 'Mock Data 2', status: 'Pending', value: '200' },
    { id: 'mock_3', name: 'Mock Data 3', status: 'Completed', value: '300' }
  ];
};
