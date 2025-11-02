import { renderOrderSummary, renderHeader, atachOrderSummaryEventListeners } from "./checkout/orderSummary.js";
import { atachPaymentSummaryEventListeners, renderPaymentSummary } from "./checkout/paymentSummary.js";

export function renderAllSections(){
  renderHeader();
  renderPaymentSummary();
  atachPaymentSummaryEventListeners();
  renderOrderSummary();
  atachOrderSummaryEventListeners();
};

renderAllSections();