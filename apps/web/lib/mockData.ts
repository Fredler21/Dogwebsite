import type { Order } from '@/lib/mockData';

export const MOCK_ORDERS: Order[] = [
  { id: 'ord_1001', orderNumber: '#1001', customerEmail: 'alex@example.com', grandTotal: 5499, paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled', createdAt: Date.now() - 1000 * 60 * 60 * 6 },
  { id: 'ord_1002', orderNumber: '#1002', customerEmail: 'sam@example.com', grandTotal: 2299, paymentStatus: 'paid', fulfillmentStatus: 'shipped', createdAt: Date.now() - 1000 * 60 * 60 * 36 },
  { id: 'ord_1003', orderNumber: '#1003', customerEmail: 'jordan@example.com', grandTotal: 9999, paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled', createdAt: Date.now() - 1000 * 60 * 30 }
];

export type Order = {
  id: string; orderNumber: string; customerEmail: string;
  grandTotal: number; paymentStatus: string; fulfillmentStatus: string;
  createdAt: number;
};
