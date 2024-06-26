import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; //+ to convert no. from string.
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // Page 1 and there are other pages:
    if (curPage === 1 && numPages > 1) {
      return `
      <div class="btn--page pagination__btn--pageNo">${curPage}/${numPages}</div>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // Last Page:
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
    </button>
    <div class="btn--page pagination__btn--pageNo">${curPage}/${numPages}</div>`;
    }

    // Other page:
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
    </button>

    <div class="btn--page pagination__btn--pageNo">${curPage}/${numPages}</div>

    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // else: Page 1 and no other pages:
    return '';
  }
}

export default new PaginationView();
