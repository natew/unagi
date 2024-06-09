function getErrorMarkup(error) {
  return `<script type="module">
    import {ErrorOverlay} from '/@vite/client.js';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/</g, "\\u003c")}));
<\/script>`;
}
export {
  getErrorMarkup
};
//# sourceMappingURL=error.js.map
