"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const postcss_1 = require("postcss");
const PREFIX = "light-dark(";
const SUFFIX = ")";
const plugin = () => {
    return {
        postcssPlugin: "postcss-light-dark",
        Once(root) {
            const getMediaQueryRules = (0, lodash_1.memoize)((selector) => {
                return [
                    new postcss_1.AtRule({
                        name: "media",
                        params: "(prefers-color-scheme: light)",
                    }).append(new postcss_1.Rule({ selector })),
                    new postcss_1.AtRule({
                        name: "media",
                        params: "(prefers-color-scheme: dark)",
                    }).append(new postcss_1.Rule({ selector })),
                ];
            });
            function transpileLightDark(decl) {
                const [lightValue, darkValue] = decl.value
                    .slice(PREFIX.length, -SUFFIX.length)
                    .split(/\s*,\s*/);
                if (!lightValue || !darkValue)
                    return [];
                const rules = getMediaQueryRules(decl.parent.selector);
                rules[0].first.append(decl.clone({ value: lightValue }));
                rules[1].first.append(decl.clone({ value: darkValue }));
                return rules;
            }
            root.walkRules(rule => {
                const lightDarkDeclarations = [];
                let isEmpty = true;
                rule.walkDecls(decl => {
                    if (decl.value.startsWith(PREFIX)) {
                        lightDarkDeclarations.push(decl);
                    }
                    else {
                        isEmpty = false;
                    }
                });
                if (lightDarkDeclarations.length) {
                    for (const decl of lightDarkDeclarations) {
                        const newRules = transpileLightDark(decl);
                        rule.before(newRules);
                        decl.remove();
                    }
                }
                if (isEmpty) {
                    rule.remove();
                }
            });
        },
    };
};
plugin.postcss = true;
exports.default = plugin;
//# sourceMappingURL=index.js.map