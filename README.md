# postcss-light-dark

A PostCSS plugin that implements the [light-dark() function](https://www.bram.us/2023/10/09/the-future-of-css-easy-light-dark-mode-color-switching-with-light-dark/).

## Example

```css
body {
  background: light-dark(#333, #ccc);
  color: light-dark(#fff, #000);
  font-family: "Helvetica Neue", sans-serif;
}
```

```ts
await postcss(plugin()).process(cssString, { from: undefined })
```

```css
/* Output */
@media (prefers-color-scheme: light) {
  body {
    background: #333;
    color: #fff;
  }
}
@media (prefers-color-scheme: dark) {
  body {
    background: #ccc;
    color: #000;
  }
}
body {
  font-family: "Helvetica Neue", sans-serif;
}
```
