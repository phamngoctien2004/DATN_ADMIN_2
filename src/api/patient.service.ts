import { httpClient, API_CONFIG } from './config';
import {
    Patient,
    PatientFilters,
    ApiResponse
} from '../types/patient.types';

export class PatientService {
    /**
     * Search patients by keyword (phone or cccd)
     */
    static async searchPatients(filters: PatientFilters = {}): Promise<ApiResponse<Patient[]>> {
        const queryParams = new URLSearchParams();

        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        // Removed limit parameter since API doesn't support it

        const queryString = queryParams.toString();
        const url = `${API_CONFIG.ENDPOINTS.PATIENTS}${queryString ? `?${queryString}` : ''}`;

        return httpClient.get<ApiResponse<Patient[]>>(url);
    }

    /**
     * Get patient by ID
     */
    static async getPatientById(id: number): Promise<ApiResponse<Patient>> {
        const url = `${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`;
        return httpClient.get<ApiResponse<Patient>>(url);
    }

    /**
     * Create new patient
     */
    static async createPatient(patient: Omit<Patient, 'id' | 'code' | 'registrationDate'>): Promise<ApiResponse<Patient>> {
        const url = API_CONFIG.ENDPOINTS.PATIENTS;
        return httpClient.post<ApiResponse<Patient>>(url, patient);
    }

    /**
     * Update patient information
     */
    static async updatePatient(id: number, patient: Partial<Patient>): Promise<ApiResponse<Patient>> {
        const url = `${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`;
        return httpClient.put<ApiResponse<Patient>>(url, patient);
    }

    /**
     * Delete patient
     */
    static async deletePatient(id: number): Promise<ApiResponse<void>> {
        const url = `${API_CONFIG.ENDPOINTS.PATIENTS}/${id}`;
        return httpClient.delete<ApiResponse<void>>(url);
    }
}