import { renderOrderSummary, renderHeader, atachOrderSummaryEventListeners } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

renderHeader();
renderPaymentSummary();
renderOrderSummary();
atachOrderSummaryEventListeners();