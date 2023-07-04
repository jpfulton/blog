/* NOTE: CSS and SASS file import order matters here */

// normalize CSS across browsers
import "./src/styles/normalize.css";

// global styles
import "./src/styles/global-style.scss";

// prismjs highlighting theme for code blocks
import "prismjs/themes/prism-coy.css";
// prismjs highlighting plugins for code blocks
import "prismjs/plugins/command-line/prism-command-line.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

// custom component and page level styles
import "./src/styles/bio.scss";
import "./src/styles/blog.scss";
import "./src/styles/cookie-consent.scss";
import "./src/styles/post-summary.scss";
import "./src/styles/prism.scss";
import "./src/styles/tags.scss";
