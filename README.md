# FluentAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve fluent-demo` for a dev server that runs the `./fluent-demo` app. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
`fluent-demo` contains all the components and also serves as the documentation/demo page that runs on github-pages.

## Generating a new component

Run `ng generate library COMPONENT-NAME -p fluent` to create a new component that uses the `fluent-` prefix. These components are stored in the `/projects` folder.
Testing this component in the `fluent-demo` app requires the component module to be added in the `app.module.ts` imports.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build for github-pages

Run `ng build fluent-demo --prod --baseHref="/fluent-angular/"` to build the project suitable for github-pages. The build artifacts will be stored in the `/dist/fluent-demo` directory.
Move these files over to `/docs` if you need to update the github page.

## Progress



See the Trello board for what has been implemented and what has yet to be done.
https://trello.com/b/OOfoj2WU/angular-fluent-ui
