# Reuseable components for Jumbo NodeJS projects

## Typescript & TSLint

To use the same rules as this project for Typescript & TSLint create the following tsconfig.json file:
```{
       "extends": "./node_modules/jumbo-common/tsconfig-base.json",
       "exclude": [
           "node_modules"
       ],
       "include": [
           "bin/**/*",
           "docs/**/*",
           "lib/**/*",
           "src/**/*",
           "spec/**/*",
           "index.ts"
       ]
   }```
And the following tslint.json file:
```
{
    "extends": "jumbo-common/tslint"
}
```

## nodejs-http-request
Reusable classes for basic HTTP Requests

Install following dependencies in main project
* requests
* requests-promise-native