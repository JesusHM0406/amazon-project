import { Persistance } from "../../../data/cart.js";
import { calculateDeliveryDate, deliveryOptions } from "../../../data/deliverOptions.js";
import { createOptionsHTML, createOrderSummaryHTML, findDeliveryOption } from "../../../scripts/checkout/orderSummary.js";

const TEST_CART = [{ productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '1', isEditing: false }];

describe('findDeliveryOption',()=>{
  it('returns the option object if the id is valid',()=>{
    expect(findDeliveryOption('1')).toEqual(deliveryOptions[0]);
  });

  it('returns the default option object if the id is invalid',()=>{
    expect(findDeliveryOption('5')).toEqual(deliveryOptions[0]);
  });
});

describe('createOrderSummaryHTML',()=>{
  afterEach(()=>{
    document.querySelector('.tests-container').innerHTML = '';
  });

  it('shows the correct delivery date',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(TEST_CART));
    Persistance.loadFromStorage();

    const deliveryDate = calculateDeliveryDate({id: '1', priceCents: 0, days: 7});

    const container = document.querySelector('.tests-container');

    container.innerHTML = createOrderSummaryHTML();

    const dateContainer = document.querySelector('.delivery-date');

    expect(dateContainer.textContent).toContain(deliveryDate);
  });

  it('shows the correct data of the product',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(TEST_CART));
    Persistance.loadFromStorage();

    const container = document.querySelector('.tests-container');

    container.innerHTML = createOrderSummaryHTML();

    const imageContainer = document.querySelector('.product-image');
    const nameContainer = document.querySelector('.product-name');
    const priceContainer = document.querySelector('.product-price');
    const quantityContainer = document.querySelector('.quantity-label');

    expect(imageContainer.getAttribute('src')).toEqual('images/products/athletic-cotton-socks-6-pairs.jpg');
    expect(nameContainer.textContent).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(priceContainer.textContent).toEqual('$10.90');
    expect(quantityContainer.textContent).toEqual('2');
  });

  it('doesn\'t adds the class is-editing to the parent container if the product is not editing',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(TEST_CART));
    Persistance.loadFromStorage();

    const container = document.querySelector('.tests-container');

    container.innerHTML = createOrderSummaryHTML();

    const productContainer = document.querySelector('.cart-item-container');

    expect(productContainer.classList.contains('is-editing')).toEqual(false);
  });

  it('adds the class is-editing to the parent container if the product is editing',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{ productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '1', isEditing: true }]));
    Persistance.loadFromStorage();

    const container = document.querySelector('.tests-container');

    container.innerHTML = createOrderSummaryHTML();

    const productContainer = document.querySelector('.cart-item-container');

    expect(productContainer.classList.contains('is-editing')).toEqual(true);
  });
});

describe('createOptionsHTML',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{ productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '2', isEditing: false }]));
    Persistance.loadFromStorage();

    const container = document.querySelector('.tests-container');

    container.innerHTML = createOptionsHTML('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
  });

  afterEach(()=>{
    document.querySelector('.tests-container').innerHTML = '';
  });

  it('shows the correct quantity of options available',()=>{
    const divOptions = document.querySelectorAll('.delivery-option');

    expect(divOptions.length).toEqual(deliveryOptions.length);
  });

  it('shows selected the correct option',()=>{
    const divOptions = document.querySelectorAll('.delivery-option');
    const expectedNotSelectedOption1 = divOptions[0];
    const expectedSelectedOption = divOptions[1];
    const expectedNotSelectedOption2 = divOptions[2];

    expect(expectedNotSelectedOption1.querySelector('.delivery-option-input').hasAttribute('checked')).toEqual(false);
    expect(expectedSelectedOption.querySelector('.delivery-option-input').hasAttribute('checked')).toEqual(true);
    expect(expectedNotSelectedOption2.querySelector('.delivery-option-input').hasAttribute('checked')).toEqual(false);
  });
})