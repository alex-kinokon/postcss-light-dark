import { memoize } from "lodash"
import postcss, { Declaration, Rule, Plugin, AtRule } from "postcss"

const PREFIX = "light-dark("
const SUFFIX = ")"

const plugin = (): Plugin => {
  return {
    postcssPlugin: "postcss-light-dark",
    Once(root: postcss.Root) {
      const getMediaQueryRules = memoize((selector: string) => {
        return [
          new AtRule({
            name: "media",
            params: "(prefers-color-scheme: light)",
          }).append(new Rule({ selector })),
          new AtRule({
            name: "media",
            params: "(prefers-color-scheme: dark)",
          }).append(new Rule({ selector })),
        ]
      })

      function transpileLightDark(decl: Declaration) {
        const [lightValue, darkValue] = decl.value
          .slice(PREFIX.length, -SUFFIX.length)
          .split(/\s*,\s*/)

        if (!lightValue || !darkValue) return []

        const rules = getMediaQueryRules((decl.parent as Rule).selector)
        ;(rules[0].first as Rule).append(decl.clone({ value: lightValue }))
        ;(rules[1].first as Rule).append(decl.clone({ value: darkValue }))

        return rules
      }

      root.walkRules(rule => {
        const lightDarkDeclarations: Declaration[] = []
        let isEmpty = true

        rule.walkDecls(decl => {
          if (decl.value.startsWith(PREFIX)) {
            lightDarkDeclarations.push(decl)
          } else {
            isEmpty = false
          }
        })

        if (lightDarkDeclarations.length) {
          for (const decl of lightDarkDeclarations) {
            const newRules = transpileLightDark(decl)
            rule.before(newRules)

            decl.remove()
          }
        }

        if (isEmpty) {
          rule.remove()
        }
      })
    },
  }
}

plugin.postcss = true

export default plugin
