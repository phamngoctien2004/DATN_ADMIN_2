import { httpClient, API_CONFIG } from './config';
import {
    Appointment,
    AppointmentFilters,
    UpdateAppointmentStatusRequest,
    ApiResponse
} from '../types/patient.types';

export class AppointmentService {
    /**
     * Get appointments with filters
     */
    static async getAppointments(filters: AppointmentFilters = {}): Promise<ApiResponse<Appointment[]>> {
        const queryParams = new URLSearchParams();

        if (filters.phone) queryParams.append('phone', filters.phone);
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.status) queryParams.append('status', filters.status);
        // Removed limit parameter since API doesn't support it

        const queryString = queryParams.toString();
        const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS}${queryString ? `?${queryString}` : ''}`;

        return httpClient.get<ApiResponse<Appointment[]>>(url);
    }

    /**
     * Update appointment status
     */
    static async updateAppointmentStatus(request: UpdateAppointmentStatusRequest): Promise<ApiResponse<Appointment>> {
        const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS}/confirm`;
        return httpClient.put<ApiResponse<Appointment>>(url, request);
    }

    /**
     * Get appointment by ID
     */
    static async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
        const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`;
        return httpClient.get<ApiResponse<Appointment>>(url);
    }

    /**
     * Cancel appointment
     */
    static async cancelAppointment(id: string): Promise<ApiResponse<void>> {
        const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}/cancel`;
        return httpClient.post<ApiResponse<void>>(url, {});
    }
}