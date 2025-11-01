import { renderOrderSummary, renderHeader, atachOrderSummaryEventListeners } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

export function renderAllSections(){
  renderHeader();
  renderPaymentSummary();
  renderOrderSummary();
  atachOrderSummaryEventListeners();
};

renderAllSections();