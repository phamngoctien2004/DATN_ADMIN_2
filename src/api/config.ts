// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    ENDPOINTS: {
        APPOINTMENTS: '/appointments',
        PATIENTS: '/patients',
    },
} as const;

// Common API response wrapper
export interface ApiResponse<T> {
    data: T;
    message: string;
}

// HTTP methods helper
export const httpClient = {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async post<T>(url: string, data: any): Promise<T> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async put<T>(url: string, data: any): Promise<T> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async delete<T>(url: string): Promise<T> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
};