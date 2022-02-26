## NestJS OAuth2 Server

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <img src="https://github.com/boyuai/nestjs-oauth2-server/blob/master/oauth2.png?raw=true" width="120" alt="OAuth2 Logo" />
</p>

<p align='center'>
    <a href="https://www.npmjs.com/package/@boyuai/nestjs-oauth2-server" target='_blank'><img alt="npm" src="https://img.shields.io/npm/dm/@boyuai/nestjs-oauth2-server" alt="NPM Downloads"></a>
    <!-- <a href="https://coveralls.io/github/toondaey/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/toondaey/nestjs-oauth2-server"></a> -->
    <a href="https://npmjs.com/@boyuai/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="npm version" src="https://img.shields.io/npm/v/@boyuai/nestjs-oauth2-server?label=NPM&logo=NPM"></a>
    <a href="https://npmjs.com/@boyuai/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="LICENCE" src="https://img.shields.io/npm/l/@boyuai/nestjs-oauth2-server"></a>
    <!-- <a href="https://circleci.com/gh/toondaey/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="CircleCI build" src="https://img.shields.io/circleci/build/gh/toondaey/nestjs-oauth2-server/master"></a> -->
    <a href="https://www.npmjs.com/package/@boyuai/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="synk vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/npm/@boyuai/nestjs-oauth2-server"></a>
</p>

<p>
A <a href="https://nestjs.com" target='_blank'>NestJS</a> wrapper module for the <a href='https://oauth2-server.readthedocs.io/en/latest/index.html' target='_blank'>oauth2-server</a> package.
</p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Learnings](#learnings)
-   [Contributing](#contributing)
    <!-- tocstop -->
    </details>

## Installation

Installation is as simple as running:

`npm install @boyuai/nestjs-oauth2-server`

or

`yarn add @boyuai/nestjs-oauth2-server`.

## Configuration

1. Include the module as a dependency in the module where oauth will happen:

`oauth2.module.ts`

```ts
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '@boyuai/nestjs-oauth2-server';
import { OAuth2Controller } from './oauth2.controller';
import { OAuth2ServiceModule } from './oauth2-service.module';
import { OAuth2Model } from './oauth2.model';

@Module({
  imports: [
    OAuth2ServiceModule,
    OAuth2ServerModule.forRoot({
      imports: [OAuth2ServiceModule], // import your repository for OAuth2Model here
      modelClass: OAuth2Model,
    }),
  ],
  controllers: [OAuth2Controller],
})
export class OAuth2Module {}
```

In addition to the above the, **oauth2-server** requires a [model](https://oauth2-server.readthedocs.io/en/latest/model/overview.html) to create the server. This can be provided as a service from any part of the application. This should be able to fetch data about clients, users, token, and authorization codes. This **MUST** be a service decorated with the `Injectable` decorator.

`oauth2.model.ts`

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuth2Model implements RequestAuthenticationModel {
    getAccessToken() {}

    verifyScope() {}
    // ...
    // check more codes in test/src/test-model.service.ts
}
```

## Usage

The module also provides some nifty decorators to help with configuring the oauth2 handler endpoints. An example controller covering the entire array of decorators is given below

`oauth2.controller.ts`

```ts
import { Controller } from '@nestjs/common';
import {
  OAuth2Authorization,
  OAuth2Authorize,
  OAuth2RenewToken,
  OAuth2Token,
} from '@boyuai/nestjs-oauth2-server';

@Controller()
export class OAuth2Controller {
    @Post()
    @OAuth2Authenticate()
    authenticateClient(@OAuth2Token() token: Token) {
        return token;
    }

    @Post()
    @OAuth2Authorize()
    authorizeClient(
        @OAuth2Authorization()
        authorization: AuthorizationCode,
    ) {
        return authorization;
    }

    @Post()
    @OAuth2RenewToken()
    renewToken(@OAuth2Token() token: Token) {
        return token;
    }
}
```

## Async Configuration

The module could also be included asynchronously using the `forRootAsync` method.

Examples below:

-   Using factory provider approach

```ts
import { Module } from '@nestjs/common';
import {
    OAuth2ServerModule,
    IOAuth2ServerModuleOptions,
} from '@boyuai/nestjs-oauth2-server';

@Module({
    imports: [
        // ... other modules
        OAuth2ServerModule.forRootAsync({
            useFactory: (factory: IOAuth2ServerOptionsFactory) => ({}),
            modelClass: YourModelService,
        }),
    ],
})
export class YourModule {}
```

-   Using class or existing provider approach:

`oauth2-server-config.service.ts`

```ts
import {
    IOAuth2ServerModuleOptions,
    IOAuth2ServerOptionsFactory,
} from '@boyuai/nestjs-oauth2-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuth2ServerConfigService
    implements IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): IOAuth2ServerModuleOptions {
        return {};
    }
}
```

The `OAuth2ServerConfigService` **SHOULD** implement the `IOAuth2ServerOptionsFactory`, **MUST** declare the `createOAuth2ServerOptions` method and **MUST** return `IOAuth2ServerModuleOptions` object.

```ts
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '@boyuai/nestjs-oauth2-server';
import { OAuth2ServerConfigService } from './oauth2-server-config.service.ts';

@Module({
    imports: [
        // ... other modules
        OAuth2ServerModule.forRootAsync({
            useClass: OAuth2ServerConfigService,
            modelClass: YourModelService,
        }),
    ],
})
export class YourModule {}
```

## Learnings

The concept of OAuth2 can be further understood in this article [here](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2). Also you can head over to the oauth2-server package [documentation](package).

## Contributing

Suggestions for improvement are welcomed, however, please adhere to the [contributing](./CONTRIBUTING.md) guidelines.

[package]: https://oauth2-server.readthedocs.io/en/latest/index.html
