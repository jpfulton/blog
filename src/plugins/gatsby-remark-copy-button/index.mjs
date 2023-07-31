// adapted from
// https://github.com/robertg042/gatsby-remark-pre-content/blob/master/src/index.js
// and
// https://github.com/iamskok/gatsby-remark-code-buttons/blob/master/src/index.js

import queryString from "query-string";
import { visit } from "unist-util-visit";

export default ({ markdownAST }) => {
  visit(markdownAST, "code", (node, index, parent) => {
    const [language, params] = (node.lang || "").split(":");
    const actions = queryString.parse(params);
    const { clipboard } = actions;

    if (!language) {
      return;
    }

    if (clipboard === "false") {
      delete actions["clipboard"];
    } else if (clipboard === "true") {
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"/></svg>`;

      let code = parent.children[index].value;
      code = code
        .replace(/"/gm, "&quot;")
        .replace(/`/gm, "\\`")
        .replace(/\$/gm, "\\$");

      const buttonNode = {
        type: "html",
        value: `
            <div
              class="codeCopyButtonContainer"
              onClick="copyToClipboard(\`${code}\`)"
            >
              <div
                class="codeCopyButton"
                data-tooltip="Copy"
              >
                ${svgIcon}
              </div>
            </div>
            `.trim(),
      };

      parent.children.splice(index, 0, buttonNode);
      actions["clipboard"] = "false";
    }

    let newQuery = "";
    if (Object.keys(actions).length) {
      newQuery =
        `:` +
        Object.keys(actions)
          .map((key) => `${key}=${actions[key]}`)
          .join("&");
    }

    node.lang = language + newQuery;
  });
};
