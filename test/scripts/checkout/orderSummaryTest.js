import { deliveryOptions } from "../../../data/deliverOptions.js";
import { findDeliveryOption } from "../../../scripts/checkout/orderSummary.js";

describe('findDeliveryOption',()=>{
  it('returns the option object if the id is valid',()=>{
    expect(findDeliveryOption('1')).toEqual(deliveryOptions[0]);
  });

  it('returns the default option object if the id is invalid',()=>{
    expect(findDeliveryOption('5')).toEqual(deliveryOptions[0]);
  });
})