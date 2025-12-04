const API_BASE = 'http://student-system-backend-env.eba-rafrapua.us-east-1.elasticbeanstalk.com';

const api = {
    // Helper for fetch requests
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async login(username, password, type) {
        // Backend expects username, password
        return this.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    // Student Data
    async getStudentAttendance(studentId) {
        return this.request(`/api/attendance/${studentId}`);
    },

    async getStudentResults(studentId) {
        return this.request(`/api/results/${studentId}`);
    },

    // Faculty Data
    async getAllStudents() {
        return this.request('/api/students');
    },

    async markAttendance(data) {
        return this.request('/api/attendance', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async uploadResult(data) {
        return this.request('/api/results', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};
