# Abwise UI

Front side Abwise application.

### Tech

We use:

* [React] - A javascript library for building user interfaces
* [React-Router] - Declarative routing for React
* [Redux] - Predictable state container for JavaScript apps.
* [Semantic-UI-React] - Semantic-UI-React is the official React integration for Semantic UI
* [Webpack] - A bundler for javascript
* [Yarn] - Fast, reliable, and secure dependency management

And many other libraries.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ and [Yarn] to run.

Install the dependencies and devDependencies and start the server.

```sh
$ git clone http://gitlab.dst.uz/Tillakhanov/abwise-ui.git
$ cd abwise-ui
$ git checkout development
$ yarn install
$ yarn start
```

### Testing
In this moment we don't have any test but you can run lint for same issue
```sh 
$ yarn run lint
```

Another use case write hook for git like this
```sh
$ echo -e '#!/bin/sh\nyarn run lint' > .git/hooks/pre-push
```
before push check lint automatic

### Development
If you need change api url you need set API_HOST environment varaible
```sh
$ export API_HOST=localhost:3000
$ yarn start
```

#### Building for source
For production release:
```sh
$ git checkout production
$ export API_HOST=api.apwise.dst.uz
$ yarn build
```

   [React]: <http://angularjs.org>
   [React-Router]: <https://github.com/reactjs/redux>
   [Redux]: <https://github.com/reactjs/redux>
   [Semantic-UI-React]: <http://react.semantic-ui.com>
   [Webpack]: <https://webpack.js.org>
   [Yarn]: <https://yarnpkg.com>

### VCS rules
When create any branch first checkout last stable branch
```sh
$ git checkout production
```

Branch name conventions
```sh
$ git branch dashboard-pie-chart-new
$ git branch dashboard-pie-chart-filter-by-date-feature
$ git branch dashboard-pie-chart-for-firefox-fix
$ git branch dashboard-pie-chart-refactor
$ git branch dashboard-pie-chart-doc
```

