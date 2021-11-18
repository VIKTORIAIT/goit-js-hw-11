const axios = require('axios').default;
export default class FetchClass {
  constructor() {
    this.inputText = '';
    this.page = 1;
  }
  async fetchCards() {
    const API_KEY = '24365762-4d41dfacdb025e40bdae241c8';

    const URL =
      'https://pixabay.com/api/?key=' +
      API_KEY +
      '&q=' +
      encodeURIComponent(`${this.inputText}`) +
      '&image_type=photo' +
      '&orientation=horizontal' +
      '&safesearch=true' +
      `&page=${this.page}` +
      '&per_page=40';
    this.incrementPage();
    const fetchEl = await axios.get(URL);
    const fetchData = await fetchEl.data;
    return fetchData;
  }
  incrementPage() {
    this.page += 1;
  }
  get inputT() {
    return this.inputText;
  }
  set inputT(newInput) {
    this.inputText = newInput;
  }
  resetPage() {
    this.page = 1;
  }
}
