# Demo Project - AngularJs2, RxJs, Typescript

A simple echo-server chat application which consists of an angularJs client and a
node server to demonstrate the use of Observables.
Chat messages are sent and received via websockets using sockjs.

## Running the application
Install angular-cli with `npm install -g angular-cli` and the app dependencies with `npm install`.

Run `npm run sockserver` to start the echo server, then run `npm start` to start the
webpack-dev server with the appropriate proxy configuration.  
Point your browser to http://localhost:4200 to see the application in action.

## angular-cli help
This project was generated with [angular-cli](https://github.com/angular/angular-cli).
To get more help on the `angular-cli` use `ng --help` or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
