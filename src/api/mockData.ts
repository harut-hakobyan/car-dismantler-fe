import type {
    ActivityItem,
    CarResource,
    CustomerResource,
    DashboardSummary,
    OrderResource,
    PartResource,
    PermissionResource,
    RoleResource,
    UserResource,
} from '../types/resources';

export const users: UserResource[] = [
    { id: 1, name: 'Administrator', email: 'admin@example.com', role: 'Owner', status: 'active' },
    { id: 2, name: 'Parts Manager', email: 'parts@example.com', role: 'Manager', status: 'active' },
    { id: 3, name: 'Sales Operator', email: 'sales@example.com', role: 'Sales', status: 'inactive' },
];

export const roles: RoleResource[] = [
    {
        id: 1,
        name: 'Owner',
        permissions: ['users.manage', 'roles.manage', 'cars.manage', 'parts.manage', 'orders.manage', 'customers.manage'],
        users: 1,
        status: 'active',
    },
    {
        id: 2,
        name: 'Manager',
        permissions: ['cars.manage', 'parts.manage', 'orders.manage', 'customers.manage'],
        users: 4,
        status: 'active',
    },
    {
        id: 3,
        name: 'Sales',
        permissions: ['orders.manage', 'customers.manage'],
        users: 6,
        status: 'active',
    },
];

export const permissions: PermissionResource[] = [
    { id: 1, key: 'users.view', label: 'View users', group: 'Users' },
    { id: 2, key: 'users.manage', label: 'Manage users', group: 'Users' },
    { id: 3, key: 'roles.manage', label: 'Manage roles', group: 'Roles' },
    { id: 4, key: 'cars.manage', label: 'Manage cars', group: 'Inventory' },
    { id: 5, key: 'parts.manage', label: 'Manage parts', group: 'Inventory' },
    { id: 6, key: 'orders.manage', label: 'Manage orders', group: 'Sales' },
    { id: 7, key: 'customers.manage', label: 'Manage customers', group: 'Sales' },
];

export const cars: CarResource[] = [
    {
        id: 1,
        vin: 'JTDBR32E720000001',
        make: 'Toyota',
        model: 'Corolla',
        year: 2018,
        color: 'White',
        mileage: 82000,
        status: 'active',
        purchase_price: 3900,
        sale_price: 7200,
        created_at: '2026-07-01',
    },
    {
        id: 2,
        vin: 'WBA3A5C50DF000002',
        make: 'BMW',
        model: '328i',
        year: 2016,
        color: 'Black',
        mileage: 97000,
        status: 'pending',
        purchase_price: 5100,
        sale_price: 9400,
        created_at: '2026-07-03',
    },
    {
        id: 3,
        vin: 'WAUZZZ8K9AA000003',
        make: 'Audi',
        model: 'A4',
        year: 2017,
        color: 'Gray',
        mileage: 88500,
        status: 'active',
        purchase_price: 5600,
        sale_price: 10100,
        created_at: '2026-07-06',
    },
];

export const parts: PartResource[] = [
    {
        id: 1,
        car_id: 1,
        name: 'Engine assembly',
        sku: 'ENG-TOY-001',
        category: 'Engine',
        condition: 'Used',
        description: 'Complete engine assembly removed from Toyota Corolla 2018.',
        price: 1450,
        quantity: 1,
        status: 'active',
    },
    {
        id: 2,
        car_id: 2,
        name: 'Front right door',
        sku: 'DR-BMW-014',
        category: 'Body Parts',
        condition: 'Good',
        description: 'Black front passenger door with minor surface scratches.',
        price: 420,
        quantity: 2,
        status: 'active',
    },
    {
        id: 3,
        car_id: 3,
        name: 'LED headlight',
        sku: 'LGT-AUD-023',
        category: 'Lights',
        condition: 'Used',
        description: 'OEM LED headlight tested before inventory intake.',
        price: 280,
        quantity: 4,
        status: 'active',
    },
];

export const orders: OrderResource[] = [
    { id: 1, customer_name: 'AutoFix Garage', total: 1730, status: 'pending', created_at: '2026-07-08' },
    { id: 2, customer_name: 'North Parts LLC', total: 420, status: 'completed', created_at: '2026-07-07' },
    { id: 3, customer_name: 'City Motors', total: 280, status: 'cancelled', created_at: '2026-07-05' },
];

export const customers: CustomerResource[] = [
    { id: 1, name: 'AutoFix Garage', email: 'orders@autofix.test', phone: '+1 555 0110', address: '120 Market Street, Denver, CO' },
    { id: 2, name: 'North Parts LLC', email: 'buy@northparts.test', phone: '+1 555 0111', address: '88 Industrial Road, Newark, NJ' },
    { id: 3, name: 'City Motors', email: 'parts@citymotors.test', phone: '+1 555 0112', address: '41 Service Avenue, Phoenix, AZ' },
];

export const activity: ActivityItem[] = [
    { id: 1, label: 'Order created', description: 'AutoFix Garage placed a new parts order.', created_at: '2026-07-08 10:15' },
    { id: 2, label: 'Part stocked', description: 'LED headlight quantity updated to 4.', created_at: '2026-07-07 15:40' },
    { id: 3, label: 'Car received', description: 'Audi A4 2017 moved into dismantling queue.', created_at: '2026-07-06 09:30' },
];

export const dashboardSummary: DashboardSummary = {
    cars: cars.length,
    parts: parts.length,
    orders: orders.length,
    customers: customers.length,
    inventoryValue: parts.reduce((sum, part) => sum + part.price * part.quantity, 0),
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
};
