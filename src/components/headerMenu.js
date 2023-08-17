import { Link } from "gatsby";
import React from "react";

export const HeaderMenu = () => {
  let isOpen = false;
  const menuToggleFunc = () => {
    const container = document.querySelector("#headerMenuContainer");
    if (isOpen) {
      container.style.display = "none";
      isOpen = false;
    } else {
      container.style.display = "block";
      isOpen = true;
    }
  };
  const headerMenuButton = document.querySelector("#headerMenuIcon");
  if (headerMenuButton != null)
    headerMenuButton.addEventListener("keydown", function (headerMenuKey) {
      if (headerMenuKey.code && headerMenuKey.code == 13) menuToggleFunc();
    });
  return (
    <div id="headerMenu">
      <button id="headerMenuIcon" onClick={menuToggleFunc}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          style={{ "enable-background": "new 0 0 32 32;" }}
          version="1.1"
          viewBox="0 0 32 32"
          width="32px"
        >
          <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
        </svg>
        <div id="headerMenuContainer">
          <ol>
            <li>
              <Link to="/profile/">Author Profile</Link>
            </li>
            <li>
              <Link to="/cookie-policy/">Cookie Policy</Link>
            </li>
            <li>
              <Link to="/privacy-policy/">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-use/">Terms of Use</Link>
            </li>
          </ol>
        </div>
      </button>
    </div>
  );
};

export default HeaderMenu;
