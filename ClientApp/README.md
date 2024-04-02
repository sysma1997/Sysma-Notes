# Simple template with webpack and react

This template is mainly for servers that only support static files or servers like apache or nginx with little or no serve configuration.

## Features:

* [Webpack](https://webpack.js.org/)
* [React](https://react.dev/)
* [Fontawesome](https://fontawesome.com/)
* [Sass](https://sass-lang.com/)
* [Bulma](https://bulma.io/)
* [Typescript](https://www.typescriptlang.org/)

## use:

* Install packages `npm install` or `yarn install`
* Start development mode `npm run start` or `yarn start`
* Start watch mode `npm run watch` or `yarn watch`
* Build project with `npm run build` or `yarn build`

## How to add page:

* in yout `webpack.common.js` add in `entry` 

    ```javascript
    entry: {
        // ...
        "<root-page>": "<root-index.tsx>",

        // Example
        "./example/index": "./src/pages/example/index.tsx"
    }
    ```
* Now in your `plugins`

    ```javascript
    plugins: {
        // ...
        new HtmlWebpackPlugin({
            title: "<title>",
            filename: "<path-to-html>",
            template: "<path-template-html>",
            chunks: ["<path-html-without-extension>"]
        }),

        // Example
        new HtmlWebpackPlugin({
            title: "Example",
            filename: "example/index.html",
            template: "./src/pages/index.html",
            chunks: ["./example/index"]
        }),
        // Example with custom html template
        new HtmlWebpackPlugin({
            title: "Example",
            filename: "example/index.html",
            template: "./src/pages/example/index.html",
            chunks: ["./example/index"]
        }),
    }
    ```
* Now start server or restart `npm run start`