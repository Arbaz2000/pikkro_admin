// OrderService.ts - Service for handling order-related API calls

export interface PickupDetails {
  address: string;
  Phone: string;
  Locality: string;
  name?: string;
}

export interface DeliveryDetails {
  address: string;
  Phone: string;
  Locality: string;
  name?: string;
}

export interface TimeDetails {
  hours: number;
  minutes: number;
  meridian: string;
}

export interface ApiOrder {
  PickupDetails: PickupDetails;
  DeliveryDetails: DeliveryDetails;
  Time: TimeDetails;
  _id: string;
  userPhone: string;
  Item: string;
  weight: string;
  parcelValue: number | null;
  price: number | null;
  paymentType: string;
  instruction: string;
  Date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accepted: boolean;
  picked: boolean;
  completed: boolean;
  RiderName: string | null;
  RiderPhone: string | null;
  canceled: boolean;
  paymentSettled: boolean;
  paymentDue: boolean;
  canceledBy?: string;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  status: 'pending' | 'pickup' | 'delivering' | 'delivered' | 'cancelled';
  items: string[];
  createdAt: string;
  assignedDriver?: string;
  pickupDetails: PickupDetails;
  deliveryDetails: DeliveryDetails;
  price: number | null;
  paymentType: string;
  instruction: string;
  weight: string;
  parcelValue: number | null;
  time: TimeDetails;
  date: string;
  accepted: boolean;
  picked: boolean;
  completed: boolean;
  canceled: boolean;
  paymentSettled: boolean;
  paymentDue: boolean;
  canceledBy?: string;
}

export interface OrderDetails extends Order {
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryNotes?: string;
  assignedDriverDetails?: {
    id: string;
    name: string;
    phone: string;
  };
}

class OrderService {
  private baseUrl = 'https://15.207.211.78.nip.io/api';

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('accept', 'application/json, text/plain, */*');
    headers.append('accept-language', 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6');
    headers.append('origin', 'https://www.pikkro.com');
    headers.append('referer', 'https://www.pikkro.com/');
    headers.append('sec-fetch-dest', 'empty');
    headers.append('sec-fetch-mode', 'cors');
    headers.append('sec-fetch-site', 'cross-site');
    return headers;
  }

  private mapApiOrderToOrder(apiOrder: ApiOrder): Order {
    // Determine status based on the order flags
    let status: Order['status'] = 'pending';
    if (apiOrder.canceled) {
      status = 'cancelled';
    } else if (apiOrder.completed) {
      status = 'delivered';
    } else if (apiOrder.picked) {
      status = 'delivering';
    } else if (apiOrder.accepted) {
      status = 'pickup';
    }

    return {
      id: apiOrder._id,
      customerName: apiOrder.DeliveryDetails.name || 'Unknown Customer',
      address: apiOrder.DeliveryDetails.address,
      status,
      items: [apiOrder.Item],
      createdAt: apiOrder.createdAt,
      assignedDriver: apiOrder.RiderName || undefined,
      pickupDetails: apiOrder.PickupDetails,
      deliveryDetails: apiOrder.DeliveryDetails,
      price: apiOrder.price,
      paymentType: apiOrder.paymentType,
      instruction: apiOrder.instruction,
      weight: apiOrder.weight,
      parcelValue: apiOrder.parcelValue,
      time: apiOrder.Time,
      date: apiOrder.Date,
      accepted: apiOrder.accepted,
      picked: apiOrder.picked,
      completed: apiOrder.completed,
      canceled: apiOrder.canceled,
      paymentSettled: apiOrder.paymentSettled,
      paymentDue: apiOrder.paymentDue,
      canceledBy: apiOrder.canceledBy,
    };
  }

  private mapOrderToOrderDetails(order: Order): OrderDetails {
    // Determine payment status
    let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending';
    if (order.paymentSettled) {
      paymentStatus = 'paid';
    } else if (order.paymentDue) {
      paymentStatus = 'failed';
    }

    return {
      ...order,
      customerPhone: order.deliveryDetails.Phone,
      customerEmail: undefined, // Not available in API
      totalAmount: order.price || 0,
      paymentStatus,
      deliveryNotes: order.instruction,
      assignedDriverDetails: order.assignedDriver ? {
        id: 'driver-id', // Not available in API
        name: order.assignedDriver,
        phone: '', // Not available in API
      } : undefined,
    };
  }

  async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/getorder`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiOrder[] = await response.json();
      return data.map(apiOrder => this.mapApiOrderToOrder(apiOrder));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    try {
      // Since the API returns all orders, we'll filter by ID
      const orders = await this.getOrders();
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      return this.mapOrderToOrderDetails(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<void> {
    try {
      // TODO: Implement actual API call to update order status
      // This would typically be a PUT/PATCH request to update the order
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      
      // For now, we'll just log the action
      // In a real implementation, you would make an API call like:
      // await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
      //   method: 'PATCH',
      //   headers: this.getHeaders(),
      //   body: JSON.stringify({ status: newStatus }),
      // });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async assignDriver(orderId: string, driverId: string): Promise<void> {
    try {
      // TODO: Implement actual API call to assign driver
      console.log(`Assigning driver ${driverId} to order ${orderId}`);
      
      // In a real implementation, you would make an API call like:
      // await fetch(`${this.baseUrl}/orders/${orderId}/assign-driver`, {
      //   method: 'PATCH',
      //   headers: this.getHeaders(),
      //   body: JSON.stringify({ driverId }),
      // });
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService(); 