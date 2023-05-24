import View from './View';

class SearchView extends View {
  _parnetElement = document.querySelector('.search');

  getQuery() {
    const query = document.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }
  clearInput() {
    document.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parnetElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
