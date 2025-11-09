import { calculateDeliveryProgress } from "../../../scripts/tracking/trackingUtils.js";

describe('calculateDeliveryProgres',()=>{
  it('returns 0 if the current date is the same as the order time',()=>{
    jasmine.clock().install();
    const mockDate = new Date('December 15, 2020');
    jasmine.clock().mockDate(mockDate);

    const orderTime = new Date('December  15, 2025');
    const deliveryDate = new Date('December 18, 2025')

    expect(calculateDeliveryProgress(orderTime, deliveryDate)).toEqual(0);
  
    jasmine.clock().uninstall();
  });

  it('returns 100 if the current date is the same as the delivery date',()=>{
    jasmine.clock().install();
    const mockDate = new Date('December 15, 2020');
    jasmine.clock().mockDate(mockDate);

    const orderTime = new Date('December  11, 2020');
    const deliveryDate = new Date('December 15, 2020');

    expect(calculateDeliveryProgress(orderTime, deliveryDate)).toEqual(100);
  
    jasmine.clock().uninstall();
  });

  it('handles the case when the current date is in the middle',()=>{
    jasmine.clock().install();
    const mockDate = new Date('December 13, 2020');
    jasmine.clock().mockDate(mockDate);

    const orderTime = new Date('December  11, 2020');
    const deliveryDate = new Date('December 15, 2020');

    expect(calculateDeliveryProgress(orderTime, deliveryDate)).toEqual(50);
  
    jasmine.clock().uninstall();
  });

  it('handles the case when the order time is equal to the delivery date',()=>{
    jasmine.clock().install();
    const mockDate = new Date('December 13, 2020');
    jasmine.clock().mockDate(mockDate);

    const orderTime = new Date('December  15, 2020');
    const deliveryDate = new Date('December 15, 2020');

    expect(calculateDeliveryProgress(orderTime, deliveryDate)).toEqual(100);
  
    jasmine.clock().uninstall();
  });
});