# Tài liệu Tính năng Quản lý Bệnh nhân

## Tổng quan

Tính năng **Quản lý bệnh nhân** được xây dựng với architecture hiện đại sử dụng:
- **React 18** với TypeScript
- **Ant Design** cho UI components
- **React Query (@tanstack/react-query)** cho state management và API calls
- **React Hook Form** cho form validation
- **Tailwind CSS** cho styling

## Cấu trúc thư mục

```
src/
├── api/                          # API services
│   ├── config.ts                # API configuration và HTTP client
│   ├── appointment.service.ts    # Service cho appointments
│   ├── patient.service.ts       # Service cho patients
│   └── medical-record.service.ts # Service cho medical records
├── types/
│   └── patient.types.ts         # TypeScript definitions
├── pages/PatientManagement/
│   ├── PatientManagement.tsx    # Component chính
│   └── tabs/
│       ├── AppointmentTab.tsx   # Tab đặt lịch khám
│       ├── MedicalRecordTab.tsx # Tab phiếu khám
│       └── PatientTab.tsx       # Tab bệnh nhân
```

## Các tính năng chính

### 1. Tab Đặt lịch khám (`AppointmentTab`)

**Features:**
- ✅ Tìm kiếm theo số điện thoại (auto-search onChange)
- ✅ Filter theo ngày (mặc định ngày hôm nay)  
- ✅ Filter theo trạng thái (4 trạng thái)
- ✅ Hiển thị 5 bản ghi đầu, có nút "Xem thêm"
- ✅ Các nút action động dựa trên trạng thái
- ✅ Hiển thị thông tin chi tiết: họ tên, SĐT, địa chỉ, email, gói khám, triệu chứng
- ✅ Highlight triệu chứng trong khung màu vàng
- ✅ Hiển thị thông tin bác sĩ và khoa (nếu có)

**API Endpoint:**
```
GET /appointments?phone=0395527082&date=2025-09-18&status=KHONG_DEN
```

**Note**: API trả về full data, frontend xử lý pagination và "Xem thêm"

**Trạng thái và Action buttons:**
- `CHO_XAC_NHAN` → Hiển thị: [Xác nhận] [Hủy]
- `DA_XAC_NHAN` → Hiển thị: [Đã đến] [Hủy]  
- `DA_DEN` → Ẩn tất cả nút
- `KHONG_DEN` → Hiển thị: [Xác nhận] [Hủy]

**Update Status API:**
```
POST /appointments/confirm
{
  "id": "13",
  "status": "DA_XAC_NHAN"
}
```

### 2. Tab Phiếu khám (`MedicalRecordTab`)

**Features:**
- ✅ Chọn bệnh nhân (từ appointment hoặc tìm trực tiếp)
- ✅ Hiển thị thông tin bệnh nhân chi tiết
- ✅ Form nhập phiếu khám với validation
- ✅ Chọn phương thức thanh toán (Tiền mặt/QR)
- ✅ Tóm tắt thanh toán
- ✅ Nút in phiếu và lưu

**Patient Info API:**
```
GET /patients/15
Response: {
  "data": {
    "id": 15,
    "code": "BN1758111539103", 
    "fullName": "NPham Ngoc Tien",
    "phone": "0000000092",
    "address": "123 Đường ABC, Quận 1, TP.HN",
    // ...other fields
  }
}
```

### 3. Tab Bệnh nhân (`PatientTab`)

**Features:**
- ✅ Tìm kiếm theo SĐT hoặc CCCD (debounced search)
- ✅ Bảng hiển thị danh sách với pagination
- ✅ Nút sửa thông tin, điền phiếu khám
- ✅ Modal thêm/sửa bệnh nhân (placeholder)

**Search API:**
```
GET /patients?keyword=012345678901
```

**Note**: API trả về full data, frontend xử lý search results và pagination

## Cách sử dụng

### 1. Cài đặt Dependencies

```bash
npm install antd @ant-design/icons
npm install @tanstack/react-query react-hook-form @hookform/resolvers
npm install lodash-es @types/lodash-es dayjs
```

### 2. Truy cập tính năng

- Vào menu sidebar "Quản lý bệnh nhân" 
- URL: `http://localhost:5173/TailAdmin/patient-management`

### 3. Workflow thông thường

1. **Xem lịch khám hôm nay**
   - Vào tab "Đặt lịch khám"
   - Mặc định hiển thị lịch ngày hiện tại
   - Xác nhận hoặc đánh dấu bệnh nhân đã đến

2. **Tạo phiếu khám**
   - Vào tab "Phiếu khám"
   - Chọn bệnh nhân (từ danh sách hoặc từ lịch đã đến)
   - Điền thông tin khám bệnh
   - Chọn phương thức thanh toán
   - Lưu phiếu khám

3. **Quản lý bệnh nhân**
   - Vào tab "Bệnh nhân" 
   - Tìm kiếm bệnh nhân
   - Thêm/sửa thông tin bệnh nhân
   - Điền phiếu khám trực tiếp

## API Configuration

### Base URL
```typescript
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  ENDPOINTS: {
    APPOINTMENTS: '/appointments',
    PATIENTS: '/patients',
  },
}
```

### HTTP Client
Sử dụng Fetch API với error handling:
```typescript
const httpClient = {
  async get<T>(url: string): Promise<T>
  async post<T>(url: string, data: any): Promise<T>  
  async put<T>(url: string, data: any): Promise<T>
  async delete<T>(url: string): Promise<T>
}
```

## State Management

### React Query Keys
```typescript
// Appointments
['appointments', filters] 
['appointment', appointmentId]

// Patients  
['patients', searchKeyword]
['patient', patientId]

// Medical Records
['medical-records', patientId]
['medical-record', recordId]
```

### Query Invalidation
Sau khi update dữ liệu thành công, tự động invalidate related queries:
```typescript
queryClient.invalidateQueries({ queryKey: ['appointments'] });
```

## Form Validation

Sử dụng React Hook Form với validation rules:
```typescript
const { control, handleSubmit, watch } = useForm<FormData>();

<Controller
  name="symptoms"
  control={control}
  rules={{ required: 'Vui lòng nhập triệu chứng' }}
  render={({ field, fieldState: { error } }) => (
    <TextArea {...field} status={error ? 'error' : ''} />
  )}
/>
```

## Responsive Design

- **Desktop**: Full layout với sidebar
- **Tablet**: Responsive columns
- **Mobile**: Single column, collapsible sidebar

## Error Handling

### API Errors
```typescript
const updateMutation = useMutation({
  mutationFn: AppointmentService.updateAppointmentStatus,
  onSuccess: () => {
    message.success('Cập nhật thành công');
  },
  onError: (error) => {
    message.error(`Lỗi: ${error.message}`);
  },
});
```

### Loading States
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['appointments'],
  queryFn: AppointmentService.getAppointments,
});

if (isLoading) return <Spin />;
if (error) return <Alert message="Lỗi" type="error" />;
```

## Customization

### Theme Integration
- Tích hợp với TailAdmin theme system
- Dark/Light mode support
- Consistent với existing UI patterns

### Extending Features
1. Thêm service mới trong `/api`
2. Định nghĩa types trong `/types`  
3. Tạo components trong `/pages/PatientManagement`
4. Update routing trong `App.tsx`

## Performance Optimizations

- **Debounced search** (500ms) cho tìm kiếm
- **Query caching** với React Query
- **Lazy loading** cho modals
- **Pagination** cho large datasets
- **Optimistic updates** cho better UX

## Testing

Để test tính năng:
1. Chạy `npm run dev`
2. Vào `http://localhost:5173/TailAdmin/patient-management` 
3. Test các tab và tính năng

**Note**: Cần backend API chạy tại `localhost:8080` để tính năng hoạt động đầy đủ.