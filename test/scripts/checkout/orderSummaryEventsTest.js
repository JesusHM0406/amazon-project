import * as cartModule from "../../../data/cart.js";
import * as orderSummaryEventsModule from "../../../scripts/checkout/orderSummaryEvents.js";

describe('handleUpdateDeliveryOption',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 1, deliveryId: '1', isEditing: false }
    ]));
    cartModule.Persistance.loadFromStorage();
  });

  it('calls updateDeliveryOption with the correct values',()=>{
    const mockOption = document.createElement('DIV');
    mockOption.dataset.productId = '123';
    mockOption.dataset.deliveryId = '3';

    const updateDeliveryOptionSpy = jasmine.createSpy('updateDeliveryOption');
    orderSummaryEventsModule.handleUpdateDeliveryOption(mockOption, updateDeliveryOptionSpy);

    expect(updateDeliveryOptionSpy).toHaveBeenCalledTimes(1);
    expect(updateDeliveryOptionSpy).toHaveBeenCalledWith('123', '3');
  });
});

describe('handleDeleteLink',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'setItem');
  });

  it('calls removeFunc with the correct values',()=>{
    const mockOption = document.createElement('DIV');
    mockOption.dataset.productId = '123';

    const removeFuncSpy = jasmine.createSpy('removeFunc');
    orderSummaryEventsModule.hanldeDeleteLink(mockOption, removeFuncSpy);

    expect(removeFuncSpy).toHaveBeenCalledTimes(1);
    expect(removeFuncSpy).toHaveBeenCalledWith('123');
  });
});