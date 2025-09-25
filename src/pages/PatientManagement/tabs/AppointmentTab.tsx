import React, { useState, useEffect } from 'react';
import {
    Input,
    DatePicker,
    Select,
    Card,
    Button,
    Tag,
    Space,
    message,
    Row,
    Col,
    Spin,
    Alert
} from 'antd';
import {
    SearchOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { AppointmentService } from '../../../api/appointment.service';
import {
    Appointment,
    AppointmentStatus,
    AppointmentFilters
} from '../../../types/patient.types';

const { Option } = Select;

const AppointmentTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<AppointmentFilters>({
        date: dayjs().format('YYYY-MM-DD'),
        // Removed limit from filters since API doesn't support it
    });
    const [showAll, setShowAll] = useState(false);

    // Query to fetch appointments
    const {
        data: appointmentsResponse,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['appointments', filters],
        queryFn: () => AppointmentService.getAppointments(filters),
    });

    // Mutation to update appointment status
    const updateStatusMutation = useMutation({
        mutationFn: AppointmentService.updateAppointmentStatus,
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
        onError: (error: any) => {
            message.error(`Lỗi: ${error.message || 'Không thể cập nhật trạng thái'}`);
        },
    });

    // Auto search when filters change
    useEffect(() => {
        refetch();
    }, [filters, refetch]);

    const appointments = appointmentsResponse?.data || [];
    const displayedAppointments = showAll ? appointments : appointments.slice(0, 5);

    // Handle filter changes
    const handlePhoneChange = (value: string) => {
        setFilters(prev => ({ ...prev, phone: value || undefined }));
    };

    const handleDateChange = (date: any) => {
        const dateStr = date ? dayjs(date).format('YYYY-MM-DD') : undefined;
        setFilters(prev => ({ ...prev, date: dateStr }));
    };

    const handleStatusChange = (status: AppointmentStatus | undefined) => {
        setFilters(prev => ({ ...prev, status }));
    };

    // Handle status updates
    const handleStatusUpdate = (appointmentId: number, newStatus: AppointmentStatus) => {
        updateStatusMutation.mutate({
            id: appointmentId.toString(), // Convert to string for API
            status: newStatus,
        });
    };

    // Get status color
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'DA_DEN': return 'green';
            case 'DA_XAC_NHAN': return 'blue';
            case 'CHO_XAC_NHAN': return 'orange';
            case 'KHONG_DEN': return 'red';
            default: return 'default';
        }
    };

    // Get status text
    const getStatusText = (status: AppointmentStatus) => {
        switch (status) {
            case 'DA_DEN': return 'Đã đến';
            case 'DA_XAC_NHAN': return 'Đã xác nhận';
            case 'CHO_XAC_NHAN': return 'Chờ xác nhận';
            case 'KHONG_DEN': return 'Không đến';
            default: return status;
        }
    };

    // Render action buttons based on appointment status
    const renderActionButtons = (appointment: Appointment) => {
        if (appointment.status === 'DA_DEN') {
            return null; // Hide all buttons if patient already arrived
        }

        return (
            <Space wrap>
                {appointment.status !== 'DA_XAC_NHAN' && (
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleStatusUpdate(appointment.id, 'DA_XAC_NHAN')}
                        loading={updateStatusMutation.isPending}
                    >
                        Xác nhận
                    </Button>
                )}

                {appointment.status === 'DA_XAC_NHAN' && (
                    <Button
                        type="default"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleStatusUpdate(appointment.id, 'DA_DEN')}
                        loading={updateStatusMutation.isPending}
                    >
                        Đã đến
                    </Button>
                )}

                <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleStatusUpdate(appointment.id, 'KHONG_DEN')}
                    loading={updateStatusMutation.isPending}
                >
                    Hủy
                </Button>
            </Space>
        );
    };

    if (error) {
        return (
            <Alert
                message="Lỗi khi tải dữ liệu"
                description={(error as Error).message}
                type="error"
                showIcon
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card title="Bộ lọc tìm kiếm" size="small">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Input
                            placeholder="Tìm theo số điện thoại"
                            prefix={<SearchOutlined />}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <DatePicker
                            placeholder="Chọn ngày"
                            defaultValue={dayjs()}
                            onChange={handleDateChange}
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Select
                            placeholder="Chọn trạng thái"
                            onChange={handleStatusChange}
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Option value="CHO_XAC_NHAN">Chờ xác nhận</Option>
                            <Option value="DA_XAC_NHAN">Đã xác nhận</Option>
                            <Option value="DA_DEN">Đã đến</Option>
                            <Option value="KHONG_DEN">Không đến</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Results */}
            <Spin spinning={isLoading}>
                <div className="space-y-3">
                    {displayedAppointments.length === 0 ? (
                        <Card>
                            <div className="text-center py-8 text-gray-500">
                                Không có lịch khám nào
                            </div>
                        </Card>
                    ) : (
                        displayedAppointments.map((appointment) => (
                            <Card key={appointment.id} size="small">
                                <Row gutter={16} align="middle">
                                    <Col xs={24} md={14}>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                {appointment.fullName}
                                            </h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="flex flex-wrap gap-4">
                                                    <span>📞 {appointment.phone}</span>
                                                    <span>📅 {appointment.date} - {appointment.time}</span>
                                                    {appointment.gender && (
                                                        <span>👤 {appointment.gender === 'NAM' ? 'Nam' : 'Nữ'}</span>
                                                    )}
                                                </div>
                                                <div>🏠 {appointment.address}</div>
                                                {appointment.email && (
                                                    <div>✉️ {appointment.email}</div>
                                                )}
                                                {appointment.healthPlanResponse && (
                                                    <div className="flex items-center gap-2">
                                                        <span>🏥</span>
                                                        <span className="font-medium text-blue-600">
                                                            {appointment.healthPlanResponse.name}
                                                        </span>
                                                        {appointment.healthPlanResponse.price > 0 && (
                                                            <span className="text-green-600 font-medium">
                                                                ({appointment.healthPlanResponse.price.toLocaleString('vi-VN')} VNĐ)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {appointment.symptoms && (
                                                    <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                                        <span className="font-medium text-yellow-800">Triệu chứng:</span>
                                                        <span className="ml-2 text-yellow-700">{appointment.symptoms}</span>
                                                    </div>
                                                )}
                                                {appointment.doctorResponse && (
                                                    <div>�‍⚕️ Bác sĩ: {appointment.doctorResponse.name}</div>
                                                )}
                                                {appointment.departmentResponse && (
                                                    <div>🏢 Khoa: {appointment.departmentResponse.name}</div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <div className="text-center">
                                            <Tag color={getStatusColor(appointment.status)} className="mb-2">
                                                {getStatusText(appointment.status)}
                                            </Tag>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <div className="text-center">
                                            {renderActionButtons(appointment)}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </div>
            </Spin>

            {/* Show more/less button */}
            {appointments.length > 5 && (
                <div className="text-center">
                    <Button
                        type="link"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll
                            ? `Thu gọn (đang hiển thị ${appointments.length} bản ghi)`
                            : `Xem thêm (${appointments.length - 5} bản ghi nữa)`}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AppointmentTab;