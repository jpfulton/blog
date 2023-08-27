import { Link } from "gatsby";
import React from "react";

export const HeaderMenu = () => {
  let isOpen = false;
  let linkFromMouseDown = null;

  const menuToggleFunc = (event) => {
    const menuTag = document.querySelector("#headerMenu");
    const container = document.querySelector("#headerMenuContainer");

    /*
    if (event) {
      console.log("Event: %o", event);
    }
    if (event && event.target) {
      console.log("Target: %o", event.target);
    }
    if (event && event.relatedTarget) {
      console.log("Related Target: %o", event.relatedTarget);
    }
    */

    if (linkFromMouseDown) {
      // console.log("Link component from mouse down: %o", linkFromMouseDown);
      linkFromMouseDown.click();
    }

    if (isOpen) {
      container.style.display = "none";
      isOpen = false;
    } else {
      menuTag.focus();
      container.style.display = "block";
      isOpen = true;
    }
  };

  const onKeyMenuToggle = (keydownEvent) => {
    const KEY_CODE_ENTER = 13;
    if (keydownEvent.code) {
      if (keydownEvent.code === KEY_CODE_ENTER) menuToggleFunc(keydownEvent);
      //   if (isOpen && keydownEvent.code === 27) menuToggleFunc();
    }
  };

  const onLoseFocusMenu = (event) => {
    const container = document.querySelector("#headerMenu");

    if (container.contains(event.relatedTarget)) {
      return;
    }
    if (isOpen) {
      menuToggleFunc(event);
    }
  };

  const onLinkMouseDown = (event) => {
    // console.log("Mouse down event: %o", event);
    linkFromMouseDown = event.target;
  };

  return (
    <button
      id="headerMenu"
      onClick={menuToggleFunc}
      onKeyDown={onKeyMenuToggle}
      onBlur={onLoseFocusMenu}
    >
      <div id="headerMenuIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          style={{ enableBackground: "new 0 0 32 32" }}
          version="1.1"
          viewBox="0 0 32 32"
          width="32px"
        >
          <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
        </svg>
        <div id="headerMenuContainer">
          <ol>
            <li>
              <Link to="/profile/" onMouseDown={onLinkMouseDown}>
                Author Profile
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy/" onMouseDown={onLinkMouseDown}>
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy/" onMouseDown={onLinkMouseDown}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-use/" onMouseDown={onLinkMouseDown}>
                Terms of Use
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </button>
  );
};

export default HeaderMenu;
