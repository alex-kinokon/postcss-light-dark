import hash from "@emotion/hash"
import { AtRule, Declaration, type Plugin, type Root, Rule } from "postcss"

const PREFIX = "light-dark("
const SUFFIX = ")"

const plugin = (): Plugin => ({
  postcssPlugin: "postcss-light-dark",
  Once(root: Root) {
    let mediaQueries: AtRule[] | undefined

    const getMediaQueryRules = () =>
      (mediaQueries ??= [
        new AtRule({
          name: "media",
          params: "(prefers-color-scheme: light)",
        }).append(new Rule({ selector: ":root" })),
        new AtRule({
          name: "media",
          params: "(prefers-color-scheme: dark)",
        }).append(new Rule({ selector: ":root" })),
      ])

    function transpileLightDark(value: string) {
      const [lightValue, darkValue] = value
        .slice(PREFIX.length, -SUFFIX.length)
        .split(/\s*,\s*/)

      if (!lightValue || !darkValue) return

      const rules = getMediaQueryRules()
      const prop = `--switch-${hash(JSON.stringify([lightValue, darkValue]))}`
      ;(rules[0].first as Rule).append(new Declaration({ prop, value: lightValue }))
      ;(rules[1].first as Rule).append(new Declaration({ prop, value: darkValue }))

      return prop
    }

    root.walkRules(rule => {
      rule.walkDecls(decl => {
        if (decl.value.includes("light-dark(")) {
          decl.value = decl.value.replace(/light-dark\([^)]+\)/g, value => {
            const name = transpileLightDark(value)
            return name ? `var(${name})` : value
          })
        }
      })

      if (mediaQueries != null) {
        rule.parent?.insertBefore(rule, mediaQueries)
      }
    })
  },
})

plugin.postcss = true

export default plugin
