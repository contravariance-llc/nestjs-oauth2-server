import { Abstract, Type } from '@nestjs/common';
import { BaseModel, ServerOptions } from 'oauth2-server';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface IOAuth2ServerModuleOptions
    extends Omit<ServerOptions, 'model'>,
        Pick<ModuleMetadata, 'imports'> {
    modelClass: Type<BaseModel>;
}

export interface IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): Omit<
        IOAuth2ServerModuleOptions,
        'modelClass'
    >;
}

export interface IOAuth2ServerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    modelClass: Type<BaseModel>;
    useClass?: Type<IOAuth2ServerOptionsFactory>;
    useExisting?: Type<IOAuth2ServerOptionsFactory>;
    useFactory?: (
        ...args: any[]
    ) => Omit<IOAuth2ServerModuleOptions, 'modelClass'>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    inject?: Array<
        Type<any> | string | symbol | Abstract<any> | Function
    >;
}
