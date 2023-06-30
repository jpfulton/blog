import * as React from "react";
import { Link } from "gatsby";
import CookieConsent from "react-cookie-consent";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  let header;

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    );
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    );
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} J. Patrick Fulton
      </footer>
      <CookieConsent
        disableStyles={true}
        buttonText="Accept"
        buttonClasses="cookie-consent-button"
        containerClasses="cookie-consent-container"
        contentClasses="cookie-consent-content">
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </div>
  );
};

export default Layout;
