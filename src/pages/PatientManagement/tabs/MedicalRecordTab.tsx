import React, { useState } from 'react';
import {
    Card,
    Input,
    Button,
    Row,
    Col,
    Radio,
    message,
    Divider,
    Space,
    Typography,
    InputNumber
} from 'antd';
import {
    UserOutlined,
    SaveOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

import { PatientService } from '../../../api/patient.service';
import { MedicalRecordService } from '../../../api/medical-record.service';
import { PaymentMethod, CreateMedicalRecordRequest } from '../../../types/patient.types';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MedicalRecordFormData {
    patientId: number;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    fee: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

const MedicalRecordTab: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const { control, handleSubmit, watch, reset } = useForm<MedicalRecordFormData>();

    // Query to get patient info
    const {
        data: patientResponse,
        isLoading: isLoadingPatient
    } = useQuery({
        queryKey: ['patient', selectedPatientId],
        queryFn: () => selectedPatientId ? PatientService.getPatientById(selectedPatientId) : null,
        enabled: !!selectedPatientId,
    });

    // Mutation to create medical record
    const createMedicalRecordMutation = useMutation({
        mutationFn: (data: CreateMedicalRecordRequest) => MedicalRecordService.createMedicalRecord(data),
        onSuccess: () => {
            message.success('Tạo phiếu khám thành công');
            reset();
            setSelectedPatientId(null);
        },
        onError: (error: any) => {
            message.error(`Lỗi: ${error.message || 'Không thể tạo phiếu khám'}`);
        },
    });

    const patient = patientResponse?.data;
    const watchedPaymentMethod = watch('paymentMethod');
    const watchedFee = watch('fee');

    // Handle patient selection (from appointment or direct search)
    const handleSelectPatient = (patientId: number) => {
        setSelectedPatientId(patientId);
    };

    // Handle form submission
    const onSubmit = (data: MedicalRecordFormData) => {
        if (!selectedPatientId) {
            message.error('Vui lòng chọn bệnh nhân');
            return;
        }

        createMedicalRecordMutation.mutate({
            ...data,
            patientId: selectedPatientId,
        });
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Patient info display
    const renderPatientInfo = () => {
        if (!patient) return null;

        return (
            <Card
                title="Thông tin bệnh nhân"
                size="small"
                extra={
                    <Button
                        type="link"
                        onClick={() => setSelectedPatientId(null)}
                    >
                        Đổi bệnh nhân
                    </Button>
                }
            >
                <Row gutter={[16, 8]}>
                    <Col span={12}>
                        <Text strong>Họ tên:</Text> <Text>{patient.fullName}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Mã BN:</Text> <Text>{patient.code}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>SĐT:</Text> <Text>{patient.phone}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Ngày sinh:</Text> <Text>{patient.birth}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Giới tính:</Text> <Text>{patient.gender}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Nhóm máu:</Text> <Text>{patient.bloodType || 'Chưa xác định'}</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong>Địa chỉ:</Text> <Text>{patient.address}</Text>
                    </Col>
                    {patient.weight && (
                        <Col span={12}>
                            <Text strong>Cân nặng:</Text> <Text>{patient.weight} kg</Text>
                        </Col>
                    )}
                    {patient.height && (
                        <Col span={12}>
                            <Text strong>Chiều cao:</Text> <Text>{patient.height} cm</Text>
                        </Col>
                    )}
                </Row>
            </Card>
        );
    };

    return (
        <div className="space-y-4">
            {/* Patient selection */}
            {!selectedPatientId ? (
                <Card title="Chọn bệnh nhân">
                    <div className="text-center py-8">
                        <UserOutlined className="text-4xl text-gray-400 mb-4" />
                        <div className="text-gray-500 mb-4">
                            Chọn bệnh nhân từ danh sách đặt lịch hoặc tìm kiếm trực tiếp
                        </div>
                        <Space>
                            <Button
                                type="primary"
                                icon={<UserOutlined />}
                                onClick={() => {
                                    // This would typically open a patient selection modal
                                    // For demo, we'll use a hardcoded patient ID
                                    handleSelectPatient(15);
                                }}
                            >
                                Tìm bệnh nhân
                            </Button>
                        </Space>
                    </div>
                </Card>
            ) : (
                <>
                    {/* Patient info */}
                    {renderPatientInfo()}

                    {/* Medical record form */}
                    <Card title="Phiếu khám bệnh" loading={isLoadingPatient}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Row gutter={[24, 16]}>
                                {/* Symptoms */}
                                <Col span={24}>
                                    <label className="block text-sm font-medium mb-2">
                                        Triệu chứng <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="symptoms"
                                        control={control}
                                        rules={{ required: 'Vui lòng nhập triệu chứng' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <TextArea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Mô tả triệu chứng của bệnh nhân"
                                                    status={error ? 'error' : ''}
                                                />
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Diagnosis */}
                                <Col span={24}>
                                    <label className="block text-sm font-medium mb-2">
                                        Chẩn đoán <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="diagnosis"
                                        control={control}
                                        rules={{ required: 'Vui lòng nhập chẩn đoán' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <TextArea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Chẩn đoán bệnh"
                                                    status={error ? 'error' : ''}
                                                />
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Treatment */}
                                <Col span={24}>
                                    <label className="block text-sm font-medium mb-2">
                                        Phương pháp điều trị <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="treatment"
                                        control={control}
                                        rules={{ required: 'Vui lòng nhập phương pháp điều trị' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <TextArea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Phương pháp điều trị"
                                                    status={error ? 'error' : ''}
                                                />
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Prescription */}
                                <Col span={24}>
                                    <label className="block text-sm font-medium mb-2">
                                        Đơn thuốc <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="prescription"
                                        control={control}
                                        rules={{ required: 'Vui lòng nhập đơn thuốc' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <TextArea
                                                    {...field}
                                                    rows={4}
                                                    placeholder="Danh sách thuốc và liều dùng"
                                                    status={error ? 'error' : ''}
                                                />
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Fee */}
                                <Col xs={24} md={12}>
                                    <label className="block text-sm font-medium mb-2">
                                        Chi phí khám (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="fee"
                                        control={control}
                                        rules={{
                                            required: 'Vui lòng nhập chi phí',
                                            min: { value: 0, message: 'Chi phí phải lớn hơn 0' }
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <InputNumber
                                                    {...field}
                                                    style={{ width: '100%' }}
                                                    placeholder="5000"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                                                    status={error ? 'error' : ''}
                                                />
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Payment method */}
                                <Col xs={24} md={12}>
                                    <label className="block text-sm font-medium mb-2">
                                        Phương thức thanh toán <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="paymentMethod"
                                        control={control}
                                        rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Radio.Group {...field}>
                                                    <Radio value="TIEN_MAT">Tiền mặt</Radio>
                                                    <Radio value="QR">QR Code</Radio>
                                                </Radio.Group>
                                                {error && <div className="text-red-500 text-sm mt-1">{error.message}</div>}
                                            </>
                                        )}
                                    />
                                </Col>

                                {/* Notes */}
                                <Col span={24}>
                                    <label className="block text-sm font-medium mb-2">
                                        Ghi chú
                                    </label>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <TextArea
                                                {...field}
                                                rows={2}
                                                placeholder="Ghi chú thêm (tuỳ chọn)"
                                            />
                                        )}
                                    />
                                </Col>
                            </Row>

                            {/* Payment summary */}
                            {watchedFee && watchedPaymentMethod && (
                                <Card size="small" className="mt-4 bg-blue-50 border-blue-200">
                                    <div className="text-center">
                                        <Title level={5} className="mb-2">
                                            Thông tin thanh toán
                                        </Title>
                                        <div className="text-lg font-semibold text-blue-600">
                                            Tổng chi phí: {watchedFee?.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Phương thức: {watchedPaymentMethod === 'TIEN_MAT' ? 'Tiền mặt' : 'QR Code'}
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Actions */}
                            <Divider />
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => reset()}
                                >
                                    Làm mới
                                </Button>
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                    disabled={!watchedFee}
                                >
                                    In phiếu
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={createMedicalRecordMutation.isPending}
                                >
                                    Lưu phiếu khám
                                </Button>
                            </div>
                        </form>
                    </Card>
                </>
            )}
        </div>
    );
};

export default MedicalRecordTab;