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

describe('handleSaveQuantity',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'setItem');
  });

  afterEach(()=>{
    document.querySelector('.tests-container').innerHTML = '';
  })

  it('calls updateFunc and toggleFunc with the correct values if the newQuantity is correct',()=>{
    const container = document.querySelector('.tests-container');
    container.innerHTML = `
      <input type="number" value="2">
      <a href="#" class="save-quantity-link">Save</a>
    `;
    const link = document.querySelector('.save-quantity-link');

    const updateFuncSpy = jasmine.createSpy('updateCartItemQuantityFunc');
    const removeFuncSpy = jasmine.createSpy('removeFunc');
    const toggleFuncSpy = jasmine.createSpy('toggleFunc');

    orderSummaryEventsModule.handleSaveQuantity(link, '123', removeFuncSpy, updateFuncSpy, toggleFuncSpy);

    expect(removeFuncSpy).toHaveBeenCalledTimes(0);
    expect(updateFuncSpy).toHaveBeenCalledWith('123', 2);
    expect(toggleFuncSpy).toHaveBeenCalledWith('123', false);
  });

  it('calls updateFunc and toggleFunc with the correct values if the newQuantity is correct',()=>{
    const container = document.querySelector('.tests-container');
    container.innerHTML = `
      <input type="date" value="2025-10-08">
      <a href="#" class="save-quantity-link">Save</a>
    `;
    const link = document.querySelector('.save-quantity-link');

    const updateFuncSpy = jasmine.createSpy('updateCartItemQuantityFunc');
    const removeFuncSpy = jasmine.createSpy('removeFunc');
    const toggleFuncSpy = jasmine.createSpy('toggleFunc');

    orderSummaryEventsModule.handleSaveQuantity(link, '123', removeFuncSpy, updateFuncSpy, toggleFuncSpy);

    expect(removeFuncSpy).toHaveBeenCalledTimes(1);
    expect(removeFuncSpy).toHaveBeenCalledWith('123');
    expect(updateFuncSpy).not.toHaveBeenCalled();
    expect(toggleFuncSpy).not.toHaveBeenCalledWith();
  });
});