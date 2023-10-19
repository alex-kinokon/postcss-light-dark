# postcss-light-dark

A PostCSS plugin that implements the [light-dark() function](https://www.bram.us/2023/10/09/the-future-of-css-easy-light-dark-mode-color-switching-with-light-dark/).

## Example

```css
body {
  background: light-dark(#333, #ccc);
  color: light-dark(#fff, #000);
  font-family: Helvetica Neue, sans-serif;
  box-shadow: 0 0 10px light-dark(#000, #fff);
}
```

```ts
// yarn add git@github.com:alex-kinokon/postcss-light-dark.git
import plugin from "postcss-light-dark"

const cssString = `/* ... */`

await postcss(plugin()).process(cssString, { from: undefined })
```

```css
/* Output */
@media (prefers-color-scheme: light) {
  :root {
    --switch-czcspu: #333;
    --switch-pcxsp: #fff;
    --switch-1okt5xw: #000;
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    --switch-czcspu: #ccc;
    --switch-pcxsp: #000;
    --switch-1okt5xw: #fff;
  }
}
body {
  background: var(--switch-czcspu);
  color: var(--switch-pcxsp);
  font-family: Helvetica Neue, sans-serif;
  box-shadow: 0 0 10px var(--switch-1okt5xw);
}
```
