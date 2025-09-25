import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';

// Import tab components
import AppointmentTab from './tabs/AppointmentTab.tsx';
import MedicalRecordTab from './tabs/MedicalRecordTab.tsx';
import PatientTab from './tabs/PatientTab.tsx';

const PatientManagement: React.FC = () => {
    const items: TabsProps['items'] = [
        {
            key: 'appointments',
            label: (
                <span className="flex items-center gap-2">
                    <CalendarOutlined />
                    Đặt lịch khám
                </span>
            ),
            children: <AppointmentTab />,
        },
        {
            key: 'medical-records',
            label: (
                <span className="flex items-center gap-2">
                    <FileTextOutlined />
                    Phiếu khám
                </span>
            ),
            children: <MedicalRecordTab />,
        },
        {
            key: 'patients',
            label: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Bệnh nhân
                </span>
            ),
            children: <PatientTab />,
        },
    ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Quản lý bệnh nhân
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Quản lý lịch khám, phiếu khám và thông tin bệnh nhân
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Tabs
                    defaultActiveKey="appointments"
                    items={items}
                    className="p-4"
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </div>
        </div>
    );
};

export default PatientManagement;