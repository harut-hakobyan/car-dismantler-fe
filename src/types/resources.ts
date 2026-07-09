export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export type PermissionKey =
    | 'users.view'
    | 'users.manage'
    | 'roles.manage'
    | 'cars.manage'
    | 'parts.manage'
    | 'orders.manage'
    | 'customers.manage';

export interface UserResource {
    id: number;
    name: string;
    email: string;
    role: string;
    status: Status;
}

export interface RoleResource {
    id: number;
    name: string;
    permissions: PermissionKey[];
    users: number;
    status: Status;
}

export interface PermissionResource {
    id: number;
    key: PermissionKey;
    label: string;
    group: string;
}

export interface CarResource {
    id: number;
    vin: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    status: Status;
    purchase_price: number;
    sale_price: number;
    created_at: string;
}

export interface PartResource {
    id: number;
    car_id: number;
    name: string;
    sku: string;
    category: string;
    condition: string;
    description: string;
    price: number;
    quantity: number;
    status: Status;
    image_url?: string;
}

export interface OrderResource {
    id: number;
    customer_name: string;
    total: number;
    status: Status;
    created_at: string;
}

export interface CustomerResource {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export type ResourceRecord =
    | UserResource
    | RoleResource
    | PermissionResource
    | CarResource
    | PartResource
    | OrderResource
    | CustomerResource;

export interface DashboardSummary {
    cars: number;
    parts: number;
    orders: number;
    customers: number;
    inventoryValue: number;
    pendingOrders: number;
}

export interface ActivityItem {
    id: number;
    label: string;
    description: string;
    created_at: string;
}
