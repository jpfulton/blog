/* Note: Adapted from the OutboundLink component provided by gatsby-plugin-google-gtag
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-google-gtag/src/index.js
 */

import PropTypes from "prop-types";
import React from "react";

const OutboundLink = React.forwardRef(({ children, ...props }, ref) => {
  const eventHandler = (e) => {
    if (typeof props.onClick === `function`) {
      props.onClick(e);
    }

    let internalLink = false;
    if (props.href.startsWith("#")) {
      internalLink = true;
    }

    let redirect = true;
    if (
      e.button !== 0 ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.defaultPrevented
    ) {
      redirect = false;
    }
    if (props.target && props.target.toLowerCase() !== `_self`) {
      redirect = false;
    }
    if (window.gtag && !internalLink) {
      window.gtag(`event`, `click`, {
        event_category: `outbound`,
        event_label: props.href,
        event_callback: function () {
          console.info(`Outbound click event logged to: ${props.href}`);

          if (redirect) {
            document.location = props.href;
          } else {
            return true;
          }
        },
      });
    } else {
      if (redirect) {
        document.location = props.href;
      } else {
        return true;
      }
    }

    return false;
  };

  return (
    <a
      ref={ref}
      {...props}
      role="link"
      tabIndex={0}
      onClick={eventHandler}
      onKeyDown={eventHandler}
    >
      {children}
    </a>
  );
});

OutboundLink.propTypes = {
  href: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
};

export { OutboundLink };
