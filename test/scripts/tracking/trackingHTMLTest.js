import { renderProgressBar } from "../../../scripts/tracking/trackingHTML.js";

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