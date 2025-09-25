import React, { useState } from 'react';
import {
    Input,
    Button,
    Table,
    Space,
    message,
    Modal,
    Tag,
    Tooltip
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    FileTextOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash-es';

import { PatientService } from '../../../api/patient.service';
import { Patient } from '../../../types/patient.types';

const PatientTab: React.FC = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Debounced search function
    const debouncedSearch = debounce((keyword: string) => {
        setSearchKeyword(keyword);
    }, 500);

    // Query to fetch patients
    const {
        data: patientsResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ['patients', searchKeyword],
        queryFn: () => PatientService.searchPatients({ keyword: searchKeyword || undefined }),
        enabled: true,
    });

    const patients = patientsResponse?.data || [];

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        debouncedSearch(value);
    };

    // Handle add patient
    const handleAddPatient = () => {
        setSelectedPatient(null);
        setIsModalVisible(true);
    };

    // Handle edit patient
    const handleEditPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    // Handle fill medical record (redirect to medical record tab with patient selected)
    const handleFillMedicalRecord = (patient: Patient) => {
        // This would typically communicate with parent component to switch tabs
        message.info(`Chuyển đến phiếu khám cho bệnh nhân: ${patient.fullName}`);
    };

    // Format gender
    const formatGender = (gender: 'NAM' | 'NU') => {
        return gender === 'NAM' ? 'Nam' : 'Nữ';
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Table columns
    const columns: ColumnsType<Patient> = [
        {
            title: 'Mã BN',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            render: (code: string) => (
                <span className="font-mono text-sm">{code}</span>
            ),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            render: (name: string) => (
                <span className="font-medium">{name}</span>
            ),
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: 'CCCD',
            dataIndex: 'cccd',
            key: 'cccd',
            width: 140,
            render: (cccd: string | null) => cccd || '-',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birth',
            key: 'birth',
            width: 120,
            render: formatDate,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 80,
            render: (gender: 'NAM' | 'NU') => (
                <Tag color={gender === 'NAM' ? 'blue' : 'pink'}>
                    {formatGender(gender)}
                </Tag>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: {
                showTitle: false,
            },
            render: (address: string) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'registrationDate',
            key: 'registrationDate',
            width: 120,
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            fixed: 'right' as const,
            render: (_, record: Patient) => (
                <Space>
                    <Tooltip title="Sửa thông tin">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditPatient(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Điền phiếu khám">
                        <Button
                            type="default"
                            size="small"
                            icon={<FileTextOutlined />}
                            onClick={() => handleFillMedicalRecord(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500">
                    Lỗi khi tải dữ liệu: {(error as Error).message}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Tìm kiếm theo SĐT hoặc CCCD"
                        prefix={<SearchOutlined />}
                        onChange={handleSearchChange}
                        allowClear
                        size="large"
                    />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddPatient}
                    size="large"
                >
                    Thêm bệnh nhân
                </Button>
            </div>

            {/* Results summary */}
            {searchKeyword && (
                <div className="text-sm text-gray-600">
                    {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${patients.length} kết quả cho "${searchKeyword}"`}
                </div>
            )}

            {/* Patient table */}
            <Table
                columns={columns}
                dataSource={patients}
                rowKey="id"
                loading={isLoading}
                scroll={{ x: 1200 }}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} bệnh nhân`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    defaultPageSize: 20,
                }}
                locale={{
                    emptyText: searchKeyword
                        ? 'Không tìm thấy bệnh nhân nào'
                        : 'Nhập từ khóa để tìm kiếm bệnh nhân',
                }}
            />

            {/* Add/Edit Patient Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <UserAddOutlined />
                        {selectedPatient ? 'Sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <div className="py-4">
                    <div className="text-center text-gray-500">
                        {selectedPatient
                            ? 'Form sửa thông tin bệnh nhân sẽ được implement ở đây'
                            : 'Form thêm bệnh nhân mới sẽ được implement ở đây'
                        }
                    </div>
                    <div className="text-center mt-4">
                        <Button onClick={() => setIsModalVisible(false)}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PatientTab;