# Services

This directory contains service files for handling API calls and business logic.

## OrderService

The `OrderService` handles all order-related API calls and data transformation.

### Features

- **Fetch Orders**: Retrieves all orders from the API
- **Order Details**: Gets detailed information for a specific order
- **Status Updates**: Updates order status (pending, pickup, delivering, delivered, cancelled)
- **Driver Assignment**: Assigns drivers to orders

### API Endpoint

- Base URL: `https://15.207.211.78.nip.io/api`
- Orders endpoint: `/orders/getorder`

### Data Mapping

The service maps the API response structure to a more user-friendly format:

- **API Order** → **Order**: Transforms raw API data to internal order format
- **Order** → **OrderDetails**: Enriches order data with additional details for the details screen

### Status Mapping

The service automatically determines order status based on API flags:
- `canceled: true` → `cancelled`
- `completed: true` → `delivered`
- `picked: true` → `delivering`
- `accepted: true` → `pickup`
- Default → `pending`

### Usage

```typescript
import { orderService } from '../services/OrderService';

// Fetch all orders
const orders = await orderService.getOrders();

// Get order details
const orderDetails = await orderService.getOrderDetails(orderId);

// Update order status
await orderService.updateOrderStatus(orderId, 'delivered');

// Assign driver
await orderService.assignDriver(orderId, driverId);
```

### Error Handling

The service includes comprehensive error handling and will throw errors that can be caught and handled by the UI components. 