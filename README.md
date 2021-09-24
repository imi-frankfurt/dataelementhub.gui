# DataElementHub GUI

## Configuration Parameters

It's possible to overwrite the configuration defaults. To do this place a ```.env``` file in the Project root. The following Parameters will be parsed:

### Project specific
```BASE_URL``` defaults to http://localhost:3000

### Keycloak
```KEYCLOAK_URL``` defaults to http://localhost:8080
```KEYCLOAK_REALM```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## What else should be mentioned

* The ```vue/no-v-html``` linter rule is turned off because it leads to a **'v-html' directive can lead to XSS attack** warning. Since user submitted content will be sanitized it's safe to turn it off.  
* Maybe use the EventBus to emit events down the Component path in future versions.

## Used Frameworks

* Package Manager: npm
* UI: Vuetify.js
* Nuxt Modules: Axios
* Linting tools: ESLint, StyleLint, Commitlint
* Testing Framework: AVA
* Rendering Mode: SSR / SSG
* Deployment target: Server, Node.js hosting
