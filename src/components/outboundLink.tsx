/* Note: Adapted from the OutboundLink component provided by gatsby-plugin-google-gtag
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-google-gtag/src/index.js
 */

import React, { MouseEventHandler, PropsWithChildren } from "react";

export interface Props {
  href: string;
  target: string | undefined;
  onClick: MouseEventHandler<HTMLAnchorElement> | undefined;
}

export const OutboundLink = React.forwardRef<
  HTMLAnchorElement,
  Partial<PropsWithChildren<Props>>
>(({ children, href, target, onClick }, ref) => {
  const eventHandler = (
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.KeyboardEvent<HTMLAnchorElement>
  ): boolean => {
    if (typeof onClick === `function`) {
      onClick(e as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
    }

    let internalLink = false;
    if (href && href.startsWith("#")) {
      internalLink = true;
    }

    let redirect = true;
    if (
      (e as React.MouseEvent<HTMLAnchorElement, MouseEvent>).button !== 0 ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.defaultPrevented
    ) {
      redirect = false;
    }
    if (target && target.toLowerCase() !== `_self`) {
      redirect = false;
    }
    if (window.gtag && !internalLink) {
      window.gtag(`event`, `click`, {
        event_category: `outbound`,
        event_label: href,
        event_callback: function () {
          console.info(`Outbound click event logged to: ${href}`);

          if (redirect) {
            document.location = href ? href : "/";
          } else {
            return true;
          }
        },
      });
    } else {
      if (redirect) {
        document.location = href ? href : "/";
      } else {
        return true;
      }
    }

    return false;
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      role="link"
      tabIndex={0}
      onClick={eventHandler}
      onKeyDown={eventHandler}
    >
      {children}
    </a>
  );
});

export default OutboundLink;
