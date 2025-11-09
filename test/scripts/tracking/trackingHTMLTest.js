import { ordersLoadFromStorage } from "../../../data/orders.js";
import { genereateTrackingHTML, renderProgressBar } from "../../../scripts/tracking/trackingHTML.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

describe('renderProgressBar',()=>{
  it('adds the current-status class to the first label if the progress is under 33%',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="32"></div>
      </div>
    `;

    const progressLabels = document.querySelectorAll('.progress-label');

    renderProgressBar();

    expect(progressLabels[0].classList).toContain('current-status');
    expect(progressLabels[1].classList).not.toContain('current-status');
    expect(progressLabels[2].classList).not.toContain('current-status');

    document.querySelector('.tests-container').innerHTML = '';
  });

  it('adds the current-status class to the second label if the progress is above 32%',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="33"></div>
      </div>
    `;

    const progressLabels = document.querySelectorAll('.progress-label');

    renderProgressBar();

    expect(progressLabels[0].classList).not.toContain('current-status');
    expect(progressLabels[1].classList).toContain('current-status');
    expect(progressLabels[2].classList).not.toContain('current-status');

    document.querySelector('.tests-container').innerHTML = '';
  });

  it('adds the current-status class to the second label if the progress is above 32% and under 66%',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="65"></div>
      </div>
    `;

    const progressLabels = document.querySelectorAll('.progress-label');

    renderProgressBar();

    expect(progressLabels[0].classList).not.toContain('current-status');
    expect(progressLabels[1].classList).toContain('current-status');
    expect(progressLabels[2].classList).not.toContain('current-status');

    document.querySelector('.tests-container').innerHTML = '';
  });

  it('adds the current-status class to the third label if the progress is above 65%',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="66"></div>
      </div>
    `;

    const progressLabels = document.querySelectorAll('.progress-label');

    renderProgressBar();

    expect(progressLabels[0].classList).not.toContain('current-status');
    expect(progressLabels[1].classList).not.toContain('current-status');
    expect(progressLabels[2].classList).toContain('current-status');

    document.querySelector('.tests-container').innerHTML = '';
  });
});

describe('generateTrackingHTML',()=>{
  it('returns the correct HTML if the data is correct',()=>{

    jasmine.clock().install();
    const mockDate = new Date('December 15, 2020');
    jasmine.clock().mockDate(mockDate);

    const mockOrderTime = mockDate.toISOString;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryDate: 'December 18, 2020' }
        ]
      }
    ]));

    ordersLoadFromStorage();

    const result = genereateTrackingHTML('133', 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(result).toContain('Friday, December 18');
    expect(result).toContain('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(result).toContain('Quantity: 2');
    expect(result).toContain('data-progress="0"');

    jasmine.clock().uninstall();
  });

  it('returns error HTML if the order doesn\'t exists',()=>{
    const mockOrderTime = new Date('December 15, 2020').toISOString;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryDate: 'December 18, 2020' }
        ]
      }
    ]));

    ordersLoadFromStorage();

    const result = genereateTrackingHTML('331', 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(result).toEqual(`
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div>Sorry, the order doesn't exists, verify the URL</div>`);
  });

  it('returns error HTML if the product doesn\'t exists',()=>{
    const mockOrderTime = new Date('December 15, 2020').toISOString;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryDate: 'December 18, 2020' }
        ]
      }
    ]));

    ordersLoadFromStorage();

    const result = genereateTrackingHTML('133', '123');

    expect(result).toEqual(`
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div>Sorry, the product doesn't exists in any order, verify the URL</div>`);
  });
});