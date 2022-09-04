import App from './vue/App';
App();

((win, doc) => {
  /**
   * after html is read, before styleSheet & image are read
   */
  const created = () => {
  }

  /**
   * after DOM is built
   */
  const mounted = () => {
  }

  /**
   * execute
   */
  doc.addEventListener('DOMContentLoaded', () => {
    created();
  })
  win.addEventListener('load', () => {
    mounted();
  });
})(window, document);