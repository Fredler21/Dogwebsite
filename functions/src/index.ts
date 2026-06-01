// Checkout + payments (V4)
export { createCheckoutSession } from './checkout/createCheckoutSession';
export { stripeWebhook } from './webhooks/stripeWebhook';

// Order triggers (V2 + V5)
export { onOrderCreated } from './orders/onOrderCreated';
export { onOrderPaid, onTrackingAdded, onOrderRefunded, onSupportTicketCreated } from './orders/orderTriggers';

// Admin operations (V2/V3/V9)
export { adminUpdateOrderStatus } from './admin/adminUpdateOrderStatus';
export { processRefundRequest } from './admin/processRefundRequest';
export { setAdminClaim, listAdmins } from './admin/rbac';

// Support (V5)
export { createSupportTicket } from './support/createSupportTicket';
export { adminReplyToTicket } from './support/adminReplyToTicket';

// AI (V6)
export { aiClassifySupportTicket } from './ai/aiClassifySupportTicket';
export { aiMonitorOrders } from './ai/aiMonitorOrders';
export { aiDailyReport } from './ai/aiDailyReport';
export { aiDraftReply } from './ai/aiDraftReply';
export { aiApproveAction } from './ai/aiApproveAction';

// Suppliers (V7)
export { createSupplier, updateSupplier, setSupplierActive, recordSupplierVetting } from './suppliers/supplierCrud';
export { assignSupplierToOrder, updateSupplierOrderStatus } from './suppliers/supplierFulfillment';
export { validateProductMargin, recordSupplierCostChange, approvePriceReview } from './suppliers/marginGuardrail';

// Scheduled / automations (V8 + V9 + V10)
export { checkAbandonedCarts, checkDelayedOrders, sendReviewRequests, lowStockAlerts, nudgeStuckSupplierOrders } from './scheduled/automations';
export { nightlyBackup } from './scheduled/backup';
export { computeSupplierScorecards } from './scheduled/supplierScorecards';

// Growth (V10)
export { awardLoyaltyOnPaid, recordReferral } from './growth/loyalty';
