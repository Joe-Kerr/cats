# cats4js - Common Authoring Tools for JavaScript

cats4js is the generalisation of [cats4Vue](https://github.com/Joe-Kerr/cats4Vue) and includes common authoring tools for modules and packages.


# Install

```
npm install cats4js
```


**Dev environment**

```javascript
import cats_fun from "cats4js/specificFunction"; //Webpack (or similar) tree-shakes off all other unused functions

//e.g.
import parseConfig from "cats4js/parseConfig";

// if you need all
import * as cats from "cats4js";
```


**Browser**

```html
<script src="path_to_node_modules/cats4js/dist/cats4js.browser.js"></script>
<script>
	window.cats4js//.[specific_functions]
</scrip>
```

**Notice**

Some tools of cats4js are intended for use in production environments. Therefore tree-shaking becomes important so that you might want to prefer importing (module syntax, not require) only the function you really need. 



# Usage

[See the docs.](https://joe-kerr.github.io/cats/global.html)


# Versions

## 0.1.0
- Public beta release.


# Copyright

MIT (c) Joe Kerr since 2020
