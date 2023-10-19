"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("@emotion/hash");
const postcss_1 = require("postcss");
const PREFIX = "light-dark(";
const SUFFIX = ")";
const plugin = () => ({
    postcssPlugin: "postcss-light-dark",
    Once(root) {
        let mediaQueries;
        const getMediaQueryRules = () => (mediaQueries ??= [
            new postcss_1.AtRule({
                name: "media",
                params: "(prefers-color-scheme: light)",
            }).append(new postcss_1.Rule({ selector: ":root" })),
            new postcss_1.AtRule({
                name: "media",
                params: "(prefers-color-scheme: dark)",
            }).append(new postcss_1.Rule({ selector: ":root" })),
        ]);
        function transpileLightDark(value) {
            const [lightValue, darkValue] = value
                .slice(PREFIX.length, -SUFFIX.length)
                .split(/\s*,\s*/);
            if (!lightValue || !darkValue)
                return;
            const rules = getMediaQueryRules();
            const prop = `--switch-${(0, hash_1.default)(JSON.stringify([lightValue, darkValue]))}`;
            rules[0].first.append(new postcss_1.Declaration({ prop, value: lightValue }));
            rules[1].first.append(new postcss_1.Declaration({ prop, value: darkValue }));
            return prop;
        }
        root.walkRules(rule => {
            rule.walkDecls(decl => {
                if (decl.value.includes("light-dark(")) {
                    decl.value = decl.value.replace(/light-dark\([^)]+\)/g, value => {
                        const name = transpileLightDark(value);
                        return name ? `var(${name})` : value;
                    });
                }
            });
            if (mediaQueries != null) {
                rule.parent?.insertBefore(rule, mediaQueries);
            }
        });
    },
});
plugin.postcss = true;
exports.default = plugin;
//# sourceMappingURL=index.js.map