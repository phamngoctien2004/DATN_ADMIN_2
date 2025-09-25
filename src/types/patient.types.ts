// Appointment types
export type AppointmentStatus =
    | 'DA_DEN'
    | 'KHONG_DEN'
    | 'CHO_XAC_NHAN'
    | 'DA_XAC_NHAN';

// Health Plan interface
export interface HealthPlanResponse {
    id: number;
    name: string;
    price: number;
}

// Doctor interface
export interface DoctorResponse {
    id: number;
    name: string;
    // Add other doctor fields as needed
}

// Department interface  
export interface DepartmentResponse {
    id: number;
    name: string;
    // Add other department fields as needed
}

export interface Appointment {
    id: number;
    fullName: string;
    phone: string;
    gender?: Gender | null;
    birth: string;
    email?: string | null;
    address: string;
    healthPlanResponse?: HealthPlanResponse | null;
    doctorResponse?: DoctorResponse | null;
    departmentResponse?: DepartmentResponse | null;
    date: string;
    time: string;
    status: AppointmentStatus;
    symptoms?: string;
    patientId: number;
}

// Patient types
export type Gender = 'NAM' | 'NU';
export type BloodType = 'A' | 'B' | 'AB' | 'O' | null;

export interface Patient {
    id: number;
    code: string;
    fullName: string;
    phone: string;
    address: string;
    cccd?: string | null;
    birth: string;
    gender: Gender;
    bloodType?: BloodType;
    weight?: number | null;
    height?: number | null;
    registrationDate: string;
    profileImage?: string | null;
    relationship?: string | null;
    email?: string | null;
}

// Medical Record types
export type PaymentMethod = 'TIEN_MAT' | 'QR';

export interface MedicalRecord {
    id?: number;
    patientId: number;
    appointmentId?: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    fee: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    createdDate: string;
}

// API Request/Response types
export interface AppointmentFilters {
    phone?: string;
    date?: string;
    status?: AppointmentStatus;
    // Removed limit since API handles full data and frontend manages pagination
}

export interface PatientFilters {
    keyword?: string;
    // Removed limit since API handles full data and frontend manages pagination
}

export interface UpdateAppointmentStatusRequest {
    id: string;
    status: AppointmentStatus;
}

export interface CreateMedicalRecordRequest {
    patientId: number;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    fee: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

// Tab types for PatientManagement
export type PatientManagementTab = 'appointments' | 'medical-records' | 'patients';

// Common response wrapper
export interface ApiResponse<T> {
    data: T;
    message: string;
}