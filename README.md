# ServeMyApp

[![npm](https://img.shields.io/npm/v/serve-my-app.svg)](https://www.npmjs.com/package/serve-my-app)
[![npm](https://img.shields.io/npm/dt/serve-my-app.svg)](https://www.npmjs.com/package/serve-my-app) 


**🚀  Serve your Javascript application and/or add an API to it in a minute!**

This package allows you to add a NodeJS Express server easily and quickly to your Javascript application.

<br>

![screenshot](./screenshot.png)

<br>

**✨ Features:**

Includes a fully customizable Express Server, which allows you to:

 - Serve your Javascript application, with routing handling.
 - Add directly your api routes into your project, without thinking to something else.

## Table of contents

- [Getting started](#Getting-started)
- [Configuration](#Configuration)
- [Usage](#Usage)
- [FAQ](#FAQ)

------

## Getting started

In this ReadMe, we will take an example with a **create-react-app application**, and a **@vue/cli one is coming**. 
But it can be what you want, so please, let us know if you tested it with another framework or app. It will be added to this doc.

### Installation
```bash
cd my-app
npm install serve-my-app express
```

### Automatic initialisation
```bash
npx sma-init
```

## Configuration

The `serve-my-app` binary will serve your frontend and your api.

It has several configuration parameters. 

**See [usage](#usage) section to understand how to use them.**


Most useful ones:

| Option    | Type           | Default value | Usage                                                                             |
|---------  |----------------|---------------|-----------------------------------------------------------------------------------|
| --srv     | string / false | `false`       | Serve api routes from this folder (relative path)                                 |
| --src     | string / false | `false`       | Serve your application from this folder (**browser compatible** files)            |
| --watch   | `false`        | `false`       | Restart server if change detected in `--srv` folder                               |
| --proxify | boolean        | `false`       | Proxify calls from your app to the express server (depends of you app dev server) |


Other ones:

| Option    | Type    | Default value                | Usage                                                                             |
|-----------|---------|------------------------------|-----------------------------------------------------------------------------------|
| --host    | string  | `HOST` if set or `'0.0.0.0'` | Specify server host                                                               |
| --port    | integer | `PORT` if set or `3001`      | Specify server port                                                               |
| --https   | boolean | `HTTPS` if set or `false`    | Specify if displayed url should use https                                         |

## Usage

### Automatic initialisation

You really should use the `sma-init` command to configure your server, but see below to understand how tu use ServeMyApp

### I only want to serve my frontend code in production

- Build your application files (**depends on your application framework/type**):
  ```bash
   npm run build
  ```

- Serve them.
  ```bash
   serve-my-app --src=build
  ```

Explanation:
  - `--src`: We're assuming that previous command will output compiled files to `build` folder.


### I only want to add some api routes.

- Create an api file as [described below](#what-should-the-server-entrypoint-look-like).
 
- Serve it for development purpose:
  ```bash
  serve-my-app --srv=srv --watch
  ```

- Add your routes

- Serve it for production:
  ```bash
  serve-my-app --srv=srv
  ```

Explanation:
  - `--srv`: We're assuming that your api entrypoint is in `srv` folder.
  - `--watch`: Server will restart when a route will be added.


### I want to serve both my frontend code and add some api routes.

- Create an api file as [described below](#what-should-the-server-entrypoint-look-like). 

Then :

- For development purpose:

  - Launch the server

    ```bash
      serve-my-app --srv=srv --proxify --watch
    ```

  - Launch your frontend application (**depends on your framework**):

    ```bash
    npm run start/serve
    ```

  Explanation:
    - `--srv`: We're assuming that your api entrypoint is in `srv` folder.
    - `--watch`: Server will restart when a route will be added.
    - `--proxify`: All the relative xhr/fetch calls made in the application will be proxyfied to the server.

- To run the server only once for production:

  - Build your app files (**depends on your framework**):

    ```bash
    npm run build
    ```

  - Launch the server

    ```bash
    serve-my-app --srv=srv --src=build
    ```

  Explanation:
    - `--srv`: We're assuming that your api entrypoint is in `srv` folder.
    - `--src`: We're assuming that previous command will output compiled files to `build` folder.

**👍 In all cases, you can use relative urls for xhr/fetch calls in your code.**
**🚀 Again, all the ServeMyApp related commands and files can be generated using the `sma-init` cli tool.**

## FAQ

### What should the server entrypoint look like?
It's a file exporting a function, which will receive the Express application as its first parameter, 
and the node http server as its second. With both you can do anything you want with your server.

For example:

   ```javascript
   const { json } = require('express');
   const socketIO = require("socket.io");
   
   module.export = (app, http) => {
       app.use(json());
   
       app.get('/foo', (req, res) => {
           res.json({msg: 'foo'});
       });
   
       app.post('/bar', (req, res) => {
           res.json(req.body);
       });
       
       socketIO(http).on("connection", client => {
         client.emit("message", "Welcome");
        });
   }
   ```
 

### I want to use some transpilation process for my server (Webpack, TypeScript...).

And you're right, it's a good idea!

In that case, you just have to handle the compilation process on your own, and specify an other folder for `—srv` files. 

For example, for a TypeScript transpilation, and an `"outDir": "../dist"` in `srv/tsconfig.json`, you can update your script in `package.json` as: 

```json
"build:server": "rm -rf dist && tsc -p srv",
"sma": "serve-my-app --srv=dist [...]"
```

**🤘 For Typescript transpilation `ts-node` will be used if your api entrypoint is detected as a typescript file.**
It allows you to use directly your typescript file for development:
```json
"sma:dev": "serve-my-app --srv=srv --watch [...]"
```

**😉 To help you in your Typescript development, you can import the ApiFunction type from 'serve-my-app':**

```typescript
import { ApiFunction } from 'serve-my-app'

const api: ApiFunction = (app, server) => {
 //
}

export default api
```


**🔗 See a full example at: [mathieutu/starter-kit-react-express](https://github.com/mathieutu/starter-kit-react-express)**

### My `package.json` behaves in a weird manner: a `proxy` key comes and goes in it.

To proxify xhr calls from the front dev server to the express server, create-react-app uses a `proxy` key in the package.json. 
This is why this package adds it automatically if `--proxify` argument is provided. 

This should be transparent for you, but if you want to disable it and handle yourself (or not) the proxy, you can do it by not passing the `-—proxify` flag. 

You can find the documentation about proxies in create-react-app [here](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#docsNav).

### Another question?

Please feel free to [ask it](https://github.com/mathieutu/serve-my-app/issues/new)!


## License

This package is an open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).


## Contributing

Issues and PRs are obviously welcomed and encouraged, for new features as well as documentation.
