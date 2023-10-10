import { Plugin } from "postcss";
declare const plugin: {
    (): Plugin;
    postcss: boolean;
};
export default plugin;
