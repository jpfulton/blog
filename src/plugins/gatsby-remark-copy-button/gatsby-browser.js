import "./styles.scss";

export function onClientEntry() {
  window.copyToClipboard = (str, button) => {
    const copyIcon = button.querySelector(".copy-icon");
    const checkIcon = button.querySelector(".check-icon");

    navigator.clipboard.writeText(str).then(() => {
      copyIcon.style.display = "none";
      checkIcon.style.display = "block";

      setTimeout(() => {
        checkIcon.style.display = "none";
        copyIcon.style.display = "block";
      }, 2000);
    });
  };
}
