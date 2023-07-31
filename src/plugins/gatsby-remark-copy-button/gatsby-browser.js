require("./styles.scss");

exports.onClientEntry = () => {
  window.copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.className = "gatsby-code-button-buffer";
    el.innerHTML = str;
    document.body.appendChild(el);

    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    document.execCommand(`copy`);
    document.activeElement.blur();

    setTimeout(() => {
      document.getSelection().removeAllRanges();
      document.body.removeChild(el);
    }, 100);
  };
};
