const app = document.getElementById('app');

// State
let state = {
    user: null,
    view: 'login',
    loginRole: 'student',
    captcha: '',
    loading: false
};

// --- HELPERS ---

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    state.captcha = result;
    return result;
}

function showLoading() {
    state.loading = true;
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.8); z-index: 9999;
        display: flex; justify-content: center; align-items: center;
        backdrop-filter: blur(5px);
    `;
    loader.innerHTML = '<div class="spinner"><i class="fas fa-circle-notch fa-spin fa-3x" style="color: var(--primary)"></i></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    state.loading = false;
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
}

// --- RENDER FUNCTIONS ---

async function render() {
    app.innerHTML = '';

    if (state.view === 'login') {
        renderLogin();
    } else {
        await renderDashboardLayout();
    }
}

function renderLogin() {
    if (!state.captcha) generateCaptcha();

    const container = document.createElement('div');
    container.className = 'glass-panel login-container fade-in';

    container.innerHTML = `
        <div class="login-header">
            <h1><i class="fas fa-university"></i> VTOP Login</h1>
            <p>Student & Faculty Portal</p>
        </div>
        
        <div class="role-toggle">
            <button class="role-btn ${state.loginRole === 'student' ? 'active' : ''}" onclick="setLoginRole('student')">Student</button>
            <button class="role-btn ${state.loginRole === 'faculty' ? 'active' : ''}" onclick="setLoginRole('faculty')">Faculty</button>
        </div>

        <form onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>Username / ID</label>
                <input type="text" class="glass-input" placeholder="Registration No." value="${state.loginRole === 'student' ? 'alice@student.com' : 'sarah@faculty.com'}" required id="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="glass-input" placeholder="••••••••" value="password" required id="password">
            </div>
            
            <div class="form-group">
                <label>Captcha Verification</label>
                <div class="captcha-container">
                    <div class="captcha-box" id="captcha-display">${state.captcha}</div>
                    <button type="button" class="refresh-btn" onclick="refreshCaptcha()"><i class="fas fa-sync-alt"></i></button>
                </div>
                <input type="text" class="glass-input" placeholder="Enter Captcha" required id="captcha-input">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%">
                Login <i class="fas fa-sign-in-alt"></i>
            </button>
        </form>
    `;

    app.appendChild(container);
}

async function renderDashboardLayout() {
    const layout = document.createElement('div');
    layout.className = 'dashboard-layout fade-in';

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'glass-panel sidebar';

    const menuItems = state.user.type === 'student'
        ? [
            { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
            { id: 'academics', icon: 'fa-book', label: 'Academics' },
            { id: 'attendance', icon: 'fa-calendar-check', label: 'Attendance' },
            { id: 'results', icon: 'fa-graduation-cap', label: 'Examinations' },
            { id: 'research', icon: 'fa-flask', label: 'Research' },
            { id: 'services', icon: 'fa-concierge-bell', label: 'Services' }
        ]
        : [
            { id: 'dashboard', icon: 'fa-home', label: 'Faculty Home' },
            { id: 'entry', icon: 'fa-edit', label: 'Attendance Entry' },
            { id: 'upload', icon: 'fa-upload', label: 'Result Upload' },
            { id: 'leaves', icon: 'fa-plane', label: 'Leave Request' }
        ];

    sidebar.innerHTML = `
        <div style="padding: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border)">
            <h2 style="color: var(--primary); font-size: 1.5rem;"><i class="fas fa-university"></i> VTOP</h2>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">${new Date().toLocaleDateString()}</p>
        </div>
        ${menuItems.map(item => `
            <div class="nav-item ${state.view === item.id ? 'active' : ''}" onclick="setView('${item.id}')">
                <i class="fas ${item.icon}" style="width: 20px;"></i> ${item.label}
            </div>
        `).join('')}
        <div style="margin-top: auto;">
            <div class="nav-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </div>
        </div>
    `;

    // Main Content
    const main = document.createElement('div');
    main.className = 'main-content';

    // Header
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <h2>${menuItems.find(i => i.id === state.view)?.label || 'Dashboard'}</h2>
        <div class="user-profile glass-panel" style="padding: 0.5rem 1rem; border-radius: 50px;">
            <span>${state.user.name} (${state.user.id})</span>
            <div class="avatar">${state.user.name.charAt(0)}</div>
        </div>
    `;

    main.appendChild(header);

    // Content Body
    const contentBody = document.createElement('div');

    try {
        showLoading();
        if (state.user.type === 'student') {
            if (state.view === 'dashboard') await renderStudentDashboard(contentBody);
            else if (state.view === 'attendance') await renderStudentAttendance(contentBody);
            else if (state.view === 'results') await renderStudentResults(contentBody);
            else contentBody.innerHTML = `<div class="glass-panel"><p>Module under maintenance.</p></div>`;
        } else {
            if (state.view === 'dashboard') await renderFacultyDashboard(contentBody);
            else if (state.view === 'entry') await renderAttendanceEntry(contentBody);
            else if (state.view === 'upload') await renderResultUpload(contentBody);
            else contentBody.innerHTML = `<div class="glass-panel"><p>Module under maintenance.</p></div>`;
        }
    } catch (error) {
        console.error(error);
        contentBody.innerHTML = `<div class="glass-panel" style="color: red"><p>Error loading data: ${error.message}</p></div>`;
    } finally {
        hideLoading();
    }

    main.appendChild(contentBody);
    layout.appendChild(sidebar);
    layout.appendChild(main);
    app.appendChild(layout);
}

// --- STUDENT VIEWS ---

async function renderStudentDashboard(container) {
    const attendance = await api.getStudentAttendance(state.user.id);
    const attendancePct = attendance.length ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 0;

    container.innerHTML = `
        <div class="info-grid" style="margin-bottom: 2rem;">
            <!-- Profile Card -->
            <div class="glass-panel profile-card">
                <div class="profile-img"></div>
                <div class="profile-details">
                    <h3>${state.user.name}</h3>
                    <p><strong>Reg No:</strong> ${state.user.id}</p>
                    <p><strong>Program:</strong> ${state.user.course}</p>
                    <p><strong>School:</strong> SITE</p>
                    <p><strong>Proctor:</strong> Dr. Alan Turing</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="glass-panel" style="display: flex; flex-direction: column; justify-content: center; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Attendance</span>
                    <span style="color: var(--primary); font-weight: bold;">${attendancePct}%</span>
                </div>
                <div style="width: 100%; background: rgba(0,0,0,0.05); height: 8px; border-radius: 4px;">
                    <div style="width: ${attendancePct}%; background: var(--primary); height: 100%; border-radius: 4px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>CGPA</span>
                    <span style="color: var(--secondary); font-weight: bold;">8.94</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Credits Earned</span>
                    <span style="font-weight: bold;">124 / 160</span>
                </div>
            </div>
        </div>

        <h3 class="section-title">Today's Timetable</h3>
        <div class="glass-panel" style="margin-bottom: 2rem;">
            <div class="timetable-grid">
                <div class="tt-cell tt-header">08:00 - 09:00</div>
                <div class="tt-cell tt-header">09:00 - 10:00</div>
                <div class="tt-cell tt-header">10:00 - 11:00</div>
                <div class="tt-cell tt-header">11:00 - 12:00</div>
                <div class="tt-cell tt-header">12:00 - 01:00</div>
                <div class="tt-cell tt-header">02:00 - 03:00</div>
                
                <div class="tt-cell tt-active">STS4001<br>Soft Skills</div>
                <div class="tt-cell">Free</div>
                <div class="tt-cell tt-active">ITE1002<br>Web Tech</div>
                <div class="tt-cell">Free</div>
                <div class="tt-cell" style="background: rgba(236, 72, 153, 0.1);">Lunch</div>
                <div class="tt-cell tt-active">CSE3001<br>Software Eng</div>
            </div>
        </div>
    `;
}

async function renderStudentAttendance(container) {
    const attendance = await api.getStudentAttendance(state.user.id);

    // Calculate Summary
    const summary = {};
    attendance.forEach(a => {
        if (!summary[a.subject]) {
            summary[a.subject] = { total: 0, present: 0, code: 'CSE' + (Math.floor(Math.random() * 3000) + 1000) };
        }
        summary[a.subject].total++;
        if (a.status === 'Present') summary[a.subject].present++;
    });

    // Generate Summary Cards HTML
    const summaryHTML = Object.entries(summary).map(([subject, stats]) => {
        const pct = Math.round((stats.present / stats.total) * 100);
        const statusClass = pct >= 75 ? 'success' : pct >= 65 ? 'warning' : 'danger';

        return `
            <div class="att-card ${statusClass}">
                <div class="att-header">
                    <div>
                        <div class="att-subject">${subject}</div>
                        <div class="att-code">${stats.code}</div>
                    </div>
                    <div class="att-percentage" style="color: ${pct >= 75 ? '#34d399' : pct >= 65 ? '#f59e0b' : '#f87171'}">
                        ${pct}%
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span>Attended: <strong>${stats.present}/${stats.total}</strong></span>
                    <span>Required: <strong>75%</strong></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pct}%; background: ${pct >= 75 ? '#10b981' : pct >= 65 ? '#f59e0b' : '#ef4444'}"></div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h3 class="section-title">Attendance Summary</h3>
        <div class="attendance-summary">
            ${summaryHTML}
        </div>

        <h3 class="section-title">Detailed Log</h3>
        <div class="glass-panel table-container">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Slot</th>
                        <th>Course Title</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${attendance.map(a => `
                        <tr>
                            <td>${new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>A1+TA1</td>
                            <td>${a.subject}</td>
                            <td>Theory</td>
                            <td>
                                <span class="status-badge ${a.status === 'Present' ? 'status-present' : 'status-absent'}">
                                    <i class="fas ${a.status === 'Present' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                    ${a.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function renderStudentResults(container) {
    const results = await api.getStudentResults(state.user.id);

    container.innerHTML = `
        <h3 class="section-title">Examination Results</h3>
        <div class="glass-panel table-container">
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Type</th>
                        <th>Marks</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(r => `
                        <tr>
                            <td>CSE${Math.floor(Math.random() * 4000) + 1000}</td>
                            <td>${r.subject}</td>
                            <td>Theory</td>
                            <td>${r.marks}/${r.total}</td>
                            <td style="font-weight: bold; color: var(--accent)">${r.grade}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- FACULTY VIEWS ---

async function renderFacultyDashboard(container) {
    const students = await api.getAllStudents();

    container.innerHTML = `
        <div class="stats-grid">
            <div class="glass-panel stat-card">
                <span class="stat-label">Total Students</span>
                <span class="stat-value" style="color: var(--primary)">${students.length}</span>
            </div>
            <div class="glass-panel stat-card">
                <span class="stat-label">Classes Today</span>
                <span class="stat-value" style="color: var(--secondary)">4</span>
            </div>
            <div class="glass-panel stat-card">
                <span class="stat-label">Pending Approvals</span>
                <span class="stat-value" style="color: var(--accent)">12</span>
            </div>
        </div>
        
        <h3 class="section-title">My Schedule</h3>
        <div class="glass-panel">
            <p>No classes scheduled for the next 2 hours.</p>
        </div>
    `;
}

async function renderAttendanceEntry(container) {
    const students = await api.getAllStudents();

    container.innerHTML = `
        <h3 class="section-title">Post Attendance</h3>
        <div class="glass-panel">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <input type="date" class="glass-input" id="att-date">
                <select class="glass-input" id="att-subject">
                    <option>Database Systems (CSE3002)</option>
                    <option>Web Development (ITE1002)</option>
                </select>
                <button class="btn btn-primary" onclick="submitAttendance()">Save Attendance</button>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Reg No</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(s => `
                            <tr>
                                <td>${s.name}</td>
                                <td>${s.id}</td>
                                <td>
                                    <select class="glass-input" style="padding: 0.5rem;" id="status-${s.id}">
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="OD">On Duty</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Set default date to today
    setTimeout(() => {
        document.getElementById('att-date').valueAsDate = new Date();
    }, 0);
}

async function renderResultUpload(container) {
    const students = await api.getAllStudents();

    container.innerHTML = `
        <h3 class="section-title">Upload Marks</h3>
        <div class="glass-panel" style="max-width: 600px;">
            <div class="form-group">
                <label>Select Student</label>
                <select class="glass-input" id="res-student">
                    ${students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Subject</label>
                <select class="glass-input" id="res-subject">
                    <option>Database Systems</option>
                    <option>Web Development</option>
                </select>
            </div>
            <div class="form-group">
                <label>Exam Type</label>
                <select class="glass-input" id="res-type">
                    <option>CAT-1</option>
                    <option>CAT-2</option>
                    <option>FAT</option>
                </select>
            </div>
            <div class="form-group">
                <label>Marks (out of 100)</label>
                <input type="number" class="glass-input" id="res-marks" min="0" max="100">
            </div>
            <button class="btn btn-primary" onclick="submitResult()">Upload Result</button>
        </div>
    `;
}

// --- ACTIONS ---

window.setLoginRole = (role) => {
    state.loginRole = role;
    render();
};

window.refreshCaptcha = () => {
    const el = document.getElementById('captcha-display');
    if (el) el.innerText = generateCaptcha();
};

window.handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const captchaInput = document.getElementById('captcha-input').value;

    if (captchaInput.toUpperCase() !== state.captcha) {
        alert('Invalid Captcha! Please try again.');
        refreshCaptcha();
        document.getElementById('captcha-input').value = '';
        return;
    }

    try {
        showLoading();
        const user = await api.login(email, password, state.loginRole);

        if (user) {
            state.user = { ...user, type: state.loginRole };
            state.view = 'dashboard';
            render();
        }
    } catch (error) {
        alert(error.message);
        refreshCaptcha();
    } finally {
        hideLoading();
    }
};

window.setView = (view) => {
    state.view = view;
    render();
};

window.logout = () => {
    state.user = null;
    state.view = 'login';
    state.captcha = '';
    render();
};

window.submitAttendance = async () => {
    const date = document.getElementById('att-date').value;
    const subject = document.getElementById('att-subject').value;

    // For this mock, we'll just mark everyone as Present unless changed
    // In a real app, we'd iterate over the table rows to get status for each student
    // But here we will just pick one student to demonstrate or loop through all?
    // Let's loop through all students shown in the table.

    const rows = document.querySelectorAll('tbody tr');
    const promises = [];

    try {
        showLoading();
        for (const row of rows) {
            const regNo = row.cells[1].innerText; // Assuming 2nd column is Reg No
            const statusSelect = row.querySelector('select');
            const status = statusSelect.value;

            // We need student ID. In renderAttendanceEntry we have students list.
            // But here we don't have easy access to ID from just the table text unless we store it.
            // Let's assume we can get it from the select ID which is "status-{id}"
            const studentId = statusSelect.id.split('-')[1];

            if (status === 'Present' || status === 'Absent') { // Ignore OD for now
                promises.push(api.markAttendance({
                    student_id: studentId,
                    date: date,
                    present: status === 'Present'
                }));
            }
        }

        await Promise.all(promises);
        alert('Attendance posted successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to post attendance: ' + error.message);
    } finally {
        hideLoading();
    }
};

window.submitResult = async () => {
    const studentId = document.getElementById('res-student').value;
    const subject = document.getElementById('res-subject').value;
    const typeSelect = document.getElementById('res-type');
    const marks = document.getElementById('res-marks').value;

    if (!studentId || !marks) {
        alert("Please select student and enter marks");
        return;
    }

    try {
        showLoading();
        await api.uploadResult({
            student_id: studentId,
            subject: subject,
            type: typeSelect.value,
            marks: marks,
            total: 100
        });
        alert('Result uploaded successfully!');
        document.getElementById('res-marks').value = '';
    } catch (error) {
        console.error(error);
        alert('Failed to upload result: ' + error.message);
    } finally {
        hideLoading();
    }
};

// Initial Render
render();
