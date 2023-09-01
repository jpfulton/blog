import { WindowLocation } from "@reach/router";
import { Link } from "gatsby";
import React, { PropsWithChildren } from "react";
import CookieConsent from "react-cookie-consent";
import HeaderMenu from "./headerMenu";

export interface Props {
  location: WindowLocation;
  title: string;
}

const Layout = ({ location, title, children }: PropsWithChildren<Props>) => {
  const rootPath = `/`;
  const isRootPath = location.pathname === rootPath;
  let header;

  if (isRootPath) {
    header = (
      <>
        <div>
          <h1 className="main-heading">
            <Link to="/">{title}</Link>
          </h1>
          <HeaderMenu />
        </div>
      </>
    );
  } else {
    header = (
      <>
        <div>
          <Link className="header-link-home" to="/">
            ← {title}
          </Link>
          <HeaderMenu />
        </div>
      </>
    );
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>

      <main>{children}</main>

      <footer>
        <ol>
          <li>
            <Link to="/cookie-policy/">Cookie Policy</Link> |
          </li>
          <li>
            <Link to="/privacy-policy/">Privacy Policy</Link> |
          </li>
          <li>
            <Link to="/terms-of-use/">Terms of Use</Link> |
          </li>
          <li>© {new Date().getFullYear()} J. Patrick Fulton</li>
        </ol>
      </footer>

      <CookieConsent
        disableStyles={true}
        buttonText="Accept"
        buttonClasses="cookie-consent-button"
        containerClasses="cookie-consent-container"
        contentClasses="cookie-consent-content"
      >
        This website uses cookies to provide analytics and enhance the user
        experience. <Link to="/cookie-policy/">Learn more...</Link>
      </CookieConsent>
    </div>
  );
};

export default Layout;
