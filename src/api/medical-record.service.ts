import { httpClient } from './config';
import {
    MedicalRecord,
    CreateMedicalRecordRequest,
    ApiResponse
} from '../types/patient.types';

export class MedicalRecordService {
    /**
     * Create new medical record
     */
    static async createMedicalRecord(record: CreateMedicalRecordRequest): Promise<ApiResponse<MedicalRecord>> {
        const url = '/medical-records';
        return httpClient.post<ApiResponse<MedicalRecord>>(url, record);
    }

    /**
     * Get medical records by patient ID
     */
    static async getMedicalRecordsByPatientId(patientId: number): Promise<ApiResponse<MedicalRecord[]>> {
        const url = `/medical-records/patient/${patientId}`;
        return httpClient.get<ApiResponse<MedicalRecord[]>>(url);
    }

    /**
     * Get medical record by ID
     */
    static async getMedicalRecordById(id: number): Promise<ApiResponse<MedicalRecord>> {
        const url = `/medical-records/${id}`;
        return httpClient.get<ApiResponse<MedicalRecord>>(url);
    }

    /**
     * Update medical record
     */
    static async updateMedicalRecord(id: number, record: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
        const url = `/medical-records/${id}`;
        return httpClient.put<ApiResponse<MedicalRecord>>(url, record);
    }
}