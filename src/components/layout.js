import * as React from "react";
import { Link, Script, ScriptStrategy } from "gatsby";
import CookieConsent from "react-cookie-consent";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  let header;

  if (isRootPath) {
    header = (
      <h3 className="main-heading">
        <Link to="/">{title}</Link>
      </h3>
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
      <footer>© {new Date().getFullYear()} J. Patrick Fulton</footer>

      <CookieConsent
        disableStyles={true}
        buttonText="Accept"
        buttonClasses="cookie-consent-button"
        containerClasses="cookie-consent-container"
        contentClasses="cookie-consent-content"
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <Script
        id="google-adsense"
        strategy={ScriptStrategy.offMainThread}
        crossOrigin="anonymous"
        async={true}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2306983857488873"
      ></Script>
    </div>
  );
};

export default Layout;
