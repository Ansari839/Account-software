# Sales Module Documentation

## Overview
The Sales Module is a comprehensive component of the ERP system that manages the complete sales order workflow from creation to delivery and customer ledger integration.

## Features
- Sales Order Creation with inventory validation
- Sales Order Approval Workflow
- Delivery Challan and Gatepass Generation
- Inventory Management Integration
- Customer Ledger Synchronization
- Real-time Status Tracking
- Dispatch Management

## Architecture

### Backend Components
- **API Routes**: Located in `/app/api/sales/`
  - `/orders` - Sales order CRUD operations
  - `/inventory/availability` - Stock availability checks
  - `/delivery-challan` - Delivery challan management
  - `/customer-ledger` - Customer ledger operations
  - `/orders/approve` - Approval workflow

- **Service Layer**: Located in `/lib/sales/salesService.ts`
  - Business logic encapsulation
  - Database transaction management
  - Inventory validation
  - Customer ledger synchronization

### Frontend Components
- **Pages**: 
  - `/sales/orders` - Sales order management
  - `/dispatch` - Dispatch and delivery management
- **Components**: 
  - Sales order form with real-time validation
  - Sales order table with status management
  - Dispatch management interface

## API Endpoints

### Sales Orders
- `GET /api/sales/orders` - Get sales orders with optional filters
- `POST /api/sales/orders` - Create a new sales order
- `PUT /api/sales/orders?id={id}` - Update sales order status
- `DELETE /api/sales/orders?id={id}` - Delete sales order

### Inventory Availability
- `GET /api/sales/inventory/availability?productId={id}` - Check single product availability
- `POST /api/sales/inventory/availability/batch` - Check batch inventory availability

### Approval Workflow
- `GET /api/sales/orders/approve?orderId={id}` - Check if order requires approval
- `PUT /api/sales/orders/approve?orderId={id}` - Approve sales order

### Delivery Challan
- `GET /api/sales/delivery-challan` - Get delivery challans
- `POST /api/sales/delivery-challan` - Create delivery challan
- `PUT /api/sales/delivery-challan?id={id}` - Update delivery status

## Business Logic Flow

### 1. Sales Order Creation Flow
1. Salesman creates sales order via UI
2. System validates customer and salesperson exist
3. System checks inventory availability for all items
4. If inventory is sufficient:
   - Creates sales order with status "pending"
   - Decreases inventory stock
   - Creates stock movement records
   - Creates customer ledger entry
5. If inventory is insufficient, returns error

### 2. Approval Workflow
1. Sales order starts with "pending" status
2. System may require approval based on amount or settings
3. Manager approves order, changing status to "confirmed"
4. Customer ledger entry is finalized upon approval

### 3. Dispatch & Delivery Flow
1. Once order is confirmed, it can be dispatched
2. Creating delivery challan:
   - Generates unique challan number
   - Creates dispatch entry
   - Generates gatepass if vehicle info provided
   - Updates order status to "shipped"
   - Creates additional stock ledger entries
   - Updates customer ledger with delivery info
3. Delivery completion updates status to "delivered"

## Database Schema

### Updated SalesOrder Model
```prisma
model SalesOrder {
  id            String        @id @default(cuid())
  orderNumber   String        @unique
  date          DateTime      @default(now())
  status        String        @default("pending") // pending, confirmed, shipped, delivered, cancelled
  customerId    String
  customer      Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  companyId     String
  company       Company       @relation(fields: [companyId], references: [id], onDelete: Cascade)
  salesPersonId String
  salesPerson   Employee      @relation("SalesOrdersCreatedBy", fields: [salesPersonId], references: [id], onDelete: Cascade)
  approvedById  String?
  approvedBy    Employee?     @relation("SalesOrdersApprovedBy", fields: [approvedById], references: [id], onDelete: SetNull)
  orderItems    OrderItem[]
  totalAmount   Decimal       @default(0)
  notes         String?
  expectedDeliveryDate DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  salesReturns  SalesReturn[] // For linking sales returns to this order
  deliveryChallans DeliveryChallan[]
}
```

## Key Business Rules

1. **Inventory Validation**: Sales orders cannot be created if inventory is insufficient
2. **Approval Requirements**: Orders over $1000 may require approval (configurable)
3. **Stock Management**: Stock is decreased when order is created, restored if cancelled
4. **Ledger Synchronization**: Customer ledger is automatically updated throughout the process
5. **Status Transitions**: Orders follow a specific status flow from pending → confirmed → shipped → delivered

## UI Components

### Sales Order Form
- Customer and salesperson selection
- Product selection with real-time availability check
- Quantity and price validation
- Order items management (add/remove)

### Sales Order Table
- Status filtering with tabs
- Action buttons based on status
- Real-time status updates
- Sorting and pagination ready

### Dispatch Management
- Delivery challan creation
- Vehicle and driver assignment
- Delivery status tracking
- Gatepass generation

## Error Handling

- Comprehensive validation at API level
- User-friendly error messages in UI
- Transaction rollback on errors
- Stock restoration on order cancellation/failed creation

## Security Considerations

- Input validation and sanitization
- Proper authentication and authorization (to be implemented)
- Data integrity with database constraints
- Audit trail through stock and customer ledgers