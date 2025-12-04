const MOCK_DATA = {
    students: [
        { id: 'S001', name: 'Alice Johnson', email: 'alice@student.com', password: 'password', course: 'Computer Science', semester: 6 },
        { id: 'S002', name: 'Bob Smith', email: 'bob@student.com', password: 'password', course: 'Information IT', semester: 4 },
        { id: 'S003', name: 'Charlie Brown', email: 'charlie@student.com', password: 'password', course: 'Computer Science', semester: 6 }
    ],
    faculty: [
        { id: 'F001', name: 'Dr. Sarah Wilson', email: 'sarah@faculty.com', password: 'password', department: 'Computer Science' },
        { id: 'F002', name: 'Prof. James Davis', email: 'james@faculty.com', password: 'password', department: 'Information IT' }
    ],
    attendance: [
        { id: 1, studentId: 'S001', date: '2023-10-01', status: 'Present', subject: 'Database Systems' },
        { id: 2, studentId: 'S001', date: '2023-10-02', status: 'Absent', subject: 'Web Development' },
        { id: 3, studentId: 'S001', date: '2023-10-03', status: 'Present', subject: 'Operating Systems' },
        { id: 4, studentId: 'S002', date: '2023-10-01', status: 'Present', subject: 'Data Structures' },
    ],
    results: [
        { id: 1, studentId: 'S001', subject: 'Database Systems', marks: 85, total: 100, grade: 'A' },
        { id: 2, studentId: 'S001', subject: 'Web Development', marks: 92, total: 100, grade: 'A+' },
        { id: 3, studentId: 'S002', subject: 'Data Structures', marks: 78, total: 100, grade: 'B+' }
    ]
};

// Helper to simulate API calls
const db = {
    login: (email, password, type) => {
        const users = type === 'student' ? MOCK_DATA.students : MOCK_DATA.faculty;
        return users.find(u => u.email === email && u.password === password);
    },
    getStudentAttendance: (studentId) => {
        return MOCK_DATA.attendance.filter(a => a.studentId === studentId);
    },
    getStudentResults: (studentId) => {
        return MOCK_DATA.results.filter(r => r.studentId === studentId);
    },
    getAllStudents: () => MOCK_DATA.students,
    markAttendance: (studentId, date, status, subject) => {
        MOCK_DATA.attendance.push({
            id: MOCK_DATA.attendance.length + 1,
            studentId, date, status, subject
        });
    },
    uploadResult: (studentId, subject, marks) => {
        MOCK_DATA.results.push({
            id: MOCK_DATA.results.length + 1,
            studentId, subject, marks, total: 100, grade: marks >= 90 ? 'A+' : marks >= 80 ? 'A' : 'B'
        });
    }
};
