export type AssetStatus = 'available' | 'assigned' | 'repair' | 'retired';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type ComplaintStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type ComplaintCategory = 'Hardware Issue' | 'Software Issue' | 'Network Issue' | 'Access Issue' | 'Other';
export type AssetType = 'Laptop' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Mobile' | 'Headset' | 'Webcam' | 'Docking Station';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  assetId: string;
  type: AssetType;
  brand: string;
  model: string;
  status: AssetStatus;
  assignedTo?: Employee;
  assignedDate?: string;
  purchaseDate: string;
  serialNumber: string;
  condition: 'New' | 'Good' | 'Fair' | 'Repair';
}

export interface AssetRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  assetType: AssetType;
  reason: string;
  priority: 'Low' | 'Medium' | 'High';
  status: RequestStatus;
  requestDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  action: 'Assigned' | 'Returned' | 'Repair' | 'Retired';
  employeeName?: string;
  date: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  relatedAssetId?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: ComplaintStatus;
  createdDate: string;
  updatedDate?: string;
  assignedTo?: string;
  resolution?: string;
}

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Sarah Chen', email: 'sarah.chen@company.com', department: 'Engineering', role: 'Senior Developer' },
  { id: 'EMP002', name: 'Michael Torres', email: 'michael.t@company.com', department: 'Design', role: 'UI/UX Designer' },
  { id: 'EMP003', name: 'Emily Watson', email: 'emily.w@company.com', department: 'Marketing', role: 'Marketing Manager' },
  { id: 'EMP004', name: 'James Park', email: 'james.p@company.com', department: 'Engineering', role: 'DevOps Engineer' },
  { id: 'EMP005', name: 'Lisa Johnson', email: 'lisa.j@company.com', department: 'HR', role: 'HR Specialist' },
];

export const assets: Asset[] = [
  { id: '1', assetId: 'LPT-001', type: 'Laptop', brand: 'Apple', model: 'MacBook Pro 14"', status: 'assigned', assignedTo: employees[0], assignedDate: '2024-01-15', purchaseDate: '2023-12-01', serialNumber: 'C02ZN1XXMD6T', condition: 'Good' },
  { id: '2', assetId: 'LPT-002', type: 'Laptop', brand: 'Dell', model: 'XPS 15', status: 'assigned', assignedTo: employees[1], assignedDate: '2024-02-01', purchaseDate: '2023-11-15', serialNumber: 'DELL-XPS-2024-001', condition: 'Good' },
  { id: '3', assetId: 'LPT-003', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', status: 'available', purchaseDate: '2024-01-20', serialNumber: 'LEN-X1C-2024-003', condition: 'New' },
  { id: '4', assetId: 'MON-001', type: 'Monitor', brand: 'LG', model: 'UltraFine 27"', status: 'assigned', assignedTo: employees[0], assignedDate: '2024-01-15', purchaseDate: '2023-12-01', serialNumber: 'LG-UF27-001', condition: 'Good' },
  { id: '5', assetId: 'MON-002', type: 'Monitor', brand: 'Dell', model: 'UltraSharp 32"', status: 'available', purchaseDate: '2024-02-10', serialNumber: 'DELL-US32-002', condition: 'New' },
  { id: '6', assetId: 'MON-003', type: 'Monitor', brand: 'Samsung', model: 'Odyssey G7', status: 'repair', purchaseDate: '2023-06-15', serialNumber: 'SAM-OG7-003', condition: 'Repair' },
  { id: '7', assetId: 'KBD-001', type: 'Keyboard', brand: 'Apple', model: 'Magic Keyboard', status: 'assigned', assignedTo: employees[0], assignedDate: '2024-01-15', purchaseDate: '2023-12-01', serialNumber: 'APL-MK-001', condition: 'Good' },
  { id: '8', assetId: 'KBD-002', type: 'Keyboard', brand: 'Logitech', model: 'MX Keys', status: 'available', purchaseDate: '2024-01-10', serialNumber: 'LOG-MXK-002', condition: 'New' },
  { id: '9', assetId: 'MOU-001', type: 'Mouse', brand: 'Logitech', model: 'MX Master 3', status: 'assigned', assignedTo: employees[1], assignedDate: '2024-02-01', purchaseDate: '2024-01-05', serialNumber: 'LOG-MXM3-001', condition: 'Good' },
  { id: '10', assetId: 'MOU-002', type: 'Mouse', brand: 'Apple', model: 'Magic Mouse', status: 'available', purchaseDate: '2024-02-15', serialNumber: 'APL-MM-002', condition: 'New' },
  { id: '11', assetId: 'MOB-001', type: 'Mobile', brand: 'Apple', model: 'iPhone 15 Pro', status: 'assigned', assignedTo: employees[2], assignedDate: '2024-01-20', purchaseDate: '2023-11-01', serialNumber: 'APL-IP15P-001', condition: 'Good' },
  { id: '12', assetId: 'MOB-002', type: 'Mobile', brand: 'Samsung', model: 'Galaxy S24', status: 'available', purchaseDate: '2024-02-20', serialNumber: 'SAM-GS24-002', condition: 'New' },
  { id: '13', assetId: 'HST-001', type: 'Headset', brand: 'Sony', model: 'WH-1000XM5', status: 'assigned', assignedTo: employees[3], assignedDate: '2024-01-25', purchaseDate: '2024-01-10', serialNumber: 'SONY-WH5-001', condition: 'Good' },
  { id: '14', assetId: 'WBC-001', type: 'Webcam', brand: 'Logitech', model: 'Brio 4K', status: 'available', purchaseDate: '2024-02-01', serialNumber: 'LOG-BRIO-001', condition: 'New' },
  { id: '15', assetId: 'DCK-001', type: 'Docking Station', brand: 'CalDigit', model: 'TS4', status: 'retired', purchaseDate: '2021-03-15', serialNumber: 'CAL-TS4-001', condition: 'Fair' },
];

export const assetRequests: AssetRequest[] = [
  { id: 'REQ001', requesterId: 'EMP003', requesterName: 'Emily Watson', requesterDepartment: 'Marketing', assetType: 'Laptop', reason: 'Current laptop is slow and affecting productivity. Need upgrade for video editing tasks.', priority: 'High', status: 'pending', requestDate: '2024-03-01' },
  { id: 'REQ002', requesterId: 'EMP004', requesterName: 'James Park', requesterDepartment: 'Engineering', assetType: 'Monitor', reason: 'Need additional monitor for multi-tasking during deployments.', priority: 'Medium', status: 'pending', requestDate: '2024-03-02' },
  { id: 'REQ003', requesterId: 'EMP005', requesterName: 'Lisa Johnson', requesterDepartment: 'HR', assetType: 'Headset', reason: 'For remote interviews and team calls.', priority: 'Low', status: 'pending', requestDate: '2024-03-03' },
  { id: 'REQ004', requesterId: 'EMP001', requesterName: 'Sarah Chen', requesterDepartment: 'Engineering', assetType: 'Docking Station', reason: 'Need docking station for home office setup.', priority: 'Medium', status: 'approved', requestDate: '2024-02-20', reviewedBy: 'IT Admin', reviewedDate: '2024-02-22' },
  { id: 'REQ005', requesterId: 'EMP002', requesterName: 'Michael Torres', requesterDepartment: 'Design', assetType: 'Webcam', reason: 'Better quality webcam for client presentations.', priority: 'Low', status: 'rejected', requestDate: '2024-02-15', reviewedBy: 'IT Admin', reviewedDate: '2024-02-18' },
];

export const assetHistory: AssetHistory[] = [
  { id: '1', assetId: 'LPT-001', action: 'Assigned', employeeName: 'Sarah Chen', date: '2024-01-15', notes: 'New hire equipment' },
  { id: '2', assetId: 'LPT-001', action: 'Returned', employeeName: 'John Doe', date: '2024-01-10', notes: 'Employee departure' },
  { id: '3', assetId: 'LPT-001', action: 'Assigned', employeeName: 'John Doe', date: '2023-06-01', notes: 'Initial assignment' },
  { id: '4', assetId: 'MON-003', action: 'Repair', date: '2024-02-28', notes: 'Screen flickering issue - sent to vendor' },
  { id: '5', assetId: 'DCK-001', action: 'Retired', date: '2024-02-01', notes: 'End of life - replaced with newer model' },
];

export const complaints: Complaint[] = [
  { id: 'CMP001', employeeId: 'EMP001', employeeName: 'Sarah Chen', employeeDepartment: 'Engineering', category: 'Hardware Issue', subject: 'Laptop overheating during heavy usage', description: 'My MacBook Pro gets extremely hot when running multiple applications. The fans run at full speed constantly.', relatedAssetId: 'LPT-001', priority: 'High', status: 'in-progress', createdDate: '2024-03-01', assignedTo: 'IT Support Team' },
  { id: 'CMP002', employeeId: 'EMP001', employeeName: 'Sarah Chen', employeeDepartment: 'Engineering', category: 'Software Issue', subject: 'VPN connection dropping frequently', description: 'The company VPN disconnects every 30 minutes, requiring me to reconnect manually. This is affecting my productivity.', priority: 'Medium', status: 'open', createdDate: '2024-03-05' },
  { id: 'CMP003', employeeId: 'EMP002', employeeName: 'Michael Torres', employeeDepartment: 'Design', category: 'Access Issue', subject: 'Cannot access design server', description: 'I am unable to connect to the design assets server. Getting permission denied error.', priority: 'High', status: 'resolved', createdDate: '2024-02-20', updatedDate: '2024-02-22', assignedTo: 'IT Admin', resolution: 'Access permissions have been updated. Please try reconnecting.' },
  { id: 'CMP004', employeeId: 'EMP003', employeeName: 'Emily Watson', employeeDepartment: 'Marketing', category: 'Network Issue', subject: 'Slow internet in meeting room B', description: 'The WiFi in meeting room B is extremely slow during video calls. Other rooms work fine.', priority: 'Low', status: 'open', createdDate: '2024-03-04' },
  { id: 'CMP005', employeeId: 'EMP001', employeeName: 'Sarah Chen', employeeDepartment: 'Engineering', category: 'Other', subject: 'Request for second monitor setup', description: 'I need assistance setting up a second monitor for my workstation. The monitor is available but I need help with configuration.', priority: 'Low', status: 'closed', createdDate: '2024-02-10', updatedDate: '2024-02-12', resolution: 'Second monitor has been configured and is working properly.' },
];

export const currentEmployee = employees[0]; // Sarah Chen as the logged-in employee
