import { Link } from "gatsby";
import React, {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from "react";

export const HeaderMenu = () => {
  let isOpen = false;
  let linkFromMouseDown: HTMLAnchorElement | null = null; // retain reference to Link component that may have been mouse down target

  const menuToggleFunc = (/* event: SyntheticEvent */) => {
    const menuTag = document.querySelector("#headerMenu")! as HTMLElement;
    const container = document.querySelector(
      "#headerMenuContainer"
    )! as HTMLElement;

    /*
    if (event) {
      console.log("Event: %o", event);
    }
    if (event && event.target) {
      console.log("Target: %o", event.target);
    }
    */

    if (isOpen && linkFromMouseDown) {
      // console.log("Link component from mouse down: %o", linkFromMouseDown);

      // a menu Link component was the target of a mouse down event
      // prior to the menu loosing focus, execute its click handler
      // then close the menu
      linkFromMouseDown.click();
    }

    if (isOpen) {
      container.style.display = "none";
      isOpen = false;
    } else {
      // onClick in Safari does not create focus on the clicked
      // element, therefore, onBlur will not be triggered unless
      // focus is placed programmatically, do so here
      menuTag.focus();

      container.style.display = "block";
      isOpen = true;
    }
  };

  const onKeyMenuToggle: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    const KEY_CODE_ENTER = "13";
    if (event.code) {
      if (event.code === KEY_CODE_ENTER) menuToggleFunc(/* event */);
      //   if (isOpen && keydownEvent.code === "27") menuToggleFunc();
    }
  };

  const onLoseFocusMenu: FocusEventHandler<HTMLButtonElement> = (event) => {
    const container = document.querySelector("#headerMenu");

    if (
      container &&
      event.relatedTarget &&
      container.contains(event.relatedTarget)
    ) {
      return;
    }

    if (isOpen) {
      menuToggleFunc(/* event */);
    }
  };

  // onMouseDown handlers execute prior to onBlur and onClick
  // attach this mouse down handler to all menu internal Link components
  const onLinkMouseDown: MouseEventHandler<HTMLAnchorElement> = (event) => {
    // console.log("Mouse down event: %o", event);
    linkFromMouseDown = event.target as HTMLAnchorElement;
  };

  return (
    <button
      id="headerMenu"
      onClick={menuToggleFunc}
      onKeyDown={onKeyMenuToggle}
      onBlur={onLoseFocusMenu} // onBlur executes before onClick (always)
    >
      <div id="headerMenuIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
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
