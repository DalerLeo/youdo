# Abwise UI


Front side Abwise application.

### Tech

We use:

* [React] - A javascript library for building user interfaces
* [React-Router] - Declarative routing for React
* [Redux] - Predictable state container for JavaScript apps.
* [Material-UI] - Material-UI A Set of React Components that Implement Google's Material Design
* [Webpack] - A bundler for javascript
* [Yarn] - Fast, reliable, and secure dependency management

And many other libraries.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v6+ and [Yarn] to run.

Install the dependencies and devDependencies and start the server.

```sh
$ git clone https://lab.wienerdeming.com/myjob/admin.git
$ cd admin
$ yarn install
$ yarn start
```

### Testing
In this moment we don't have any test but you can run lint for same issue
```sh 
$ yarn run lint
```
``````````````````
Another use case write hook for git like this
```sh
$ echo -e '#!/bin/sh\nyarn run lint' > .git/hooks/pre-push
```
before push check lint automatic

### Development
If you need change api url you need set API_HOST environment variable
```sh
$ export API_HOST=localhost:3000
$ yarn start
```

#### Building for source
For production release:
```sh
$ git checkout production
$ export API_HOST=apimyjob.wienerdeming.com
$ yarn build
```

   [React]: <http://angularjs.org>
   [React-Router]: <https://github.com/reactjs/redux>
   [Redux]: <https://github.com/reactjs/redux>
   [Material-UI]: <http://www.material-ui.com>
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

