import icons from '../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );


    // page 1, there are other pages

    if (curPage === 1 && numPages > 1) {
      return this._nextBtn();
    }

    // last page

    if (curPage === numPages && numPages > 1) {
      return this._prevBtn();
    }

    //other page

    if (curPage < numPages) {
     
      return [this._prevBtn(), this._nextBtn()];
    }
    //page 1, there are NO other page

    return '';
  }

  _prevBtn() {
    return `
    <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
           <span>Page ${this._data.page - 1}</span>
    </button>
    `;
  }
  _nextBtn() {
    return `  
      <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
          <span>Page  ${this._data.page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
  }
  addHandlerClick(handler) { 

    this._parentElement.addEventListener('click', function (e) { 

      const btn = e.target.closest('.btn--inline')
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      handler(goToPage)
      
    })
  }
}

export default new PaginationView();
