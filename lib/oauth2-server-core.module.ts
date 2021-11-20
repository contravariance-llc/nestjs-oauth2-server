import {
    Module,
    Provider,
    DynamicModule,
    NotImplementedException,
} from '@nestjs/common';
import { ServerOptions } from 'oauth2-server';
import OAuth2Server = require('oauth2-server');

import {
    OAuth2ServerTokenGuard,
    OAuth2ServerAuthorizationGuard,
    OAuth2ServerAuthenticationGuard,
} from './guards';
import {
    IOAuth2ServerModuleOptions,
    IOAuth2ServerOptionsFactory,
    IOAuth2ServerModuleAsyncOptions,
} from './interfaces';
import {
    OAUTH2_SERVER,
    OAUTH2_SERVER_MODEL_PROVIDER,
    OAUTH2_SERVER_OPTIONS_TOKEN,
} from './oauth2-server.constants';

@Module({
    providers: [
        {
            provide: OAUTH2_SERVER_OPTIONS_TOKEN,
            useValue: {},
        },
        {
            provide: OAUTH2_SERVER,
            useFactory: (
                options: IOAuth2ServerModuleOptions,
                model: ServerOptions['model'],
            ): OAuth2Server =>
                new OAuth2Server(
                    Object.assign({}, options, { model }),
                ),
            inject: [
                OAUTH2_SERVER_OPTIONS_TOKEN,
                OAUTH2_SERVER_MODEL_PROVIDER,
            ],
        },
        OAuth2ServerTokenGuard,
        OAuth2ServerAuthorizationGuard,
        OAuth2ServerAuthenticationGuard,
    ],
    exports: [OAUTH2_SERVER],
})
export class OAuth2ServerCoreModule {
    static forRoot({
        modelClass,
        ...options
    }: IOAuth2ServerModuleOptions): DynamicModule {
        return {
            module: OAuth2ServerCoreModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                    useValue: options,
                },
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER,
                    useClass: modelClass,
                },
            ],
        };
    }

    static forRootAsync({
        modelClass,
        ...options
    }: IOAuth2ServerModuleAsyncOptions): DynamicModule {
        return {
            module: OAuth2ServerCoreModule,
            imports: options.imports || [],
            providers: [
                this.createAsyncOptionsProvider(options),
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER,
                    useClass: modelClass,
                },
            ],
        };
    }

    private static createAsyncOptionsProvider(
        options: Omit<IOAuth2ServerModuleAsyncOptions, 'modelClass'>,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [];
        if (options.useClass) {
            inject.push(options.useClass);
        } else if (options.useExisting) {
            inject.push(options.useExisting);
        } else {
            throw new NotImplementedException(
                'useClass/useExisting is not implemented',
            );
        }
        return {
            provide: OAUTH2_SERVER_OPTIONS_TOKEN,
            useFactory: (factory: IOAuth2ServerOptionsFactory) =>
                factory.createOAuth2ServerOptions(),
            inject,
        };
    }
}
