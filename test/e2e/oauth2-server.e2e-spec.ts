import request = require('supertest');
import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from '../src/test.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { DataProviderModule } from '../src/data-provider.module';
import { OAuth2ServerModule } from '../../lib';
import { TestModelService } from '../src/test-model.service';
import {
    ACCESS_TOKEN,
    AUTHORIZATION_CODE,
    CLIENT,
    REFRESH_TOKEN,
} from '../src/data';

describe('e2e', () => {
    let module: TestingModule;
    let app: INestApplication;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            controllers: [TestController],
            imports: [
                OAuth2ServerModule.forRoot({
                    allowEmptyState: true,
                    modelClass: TestModelService,
                    imports: [
                        DataProviderModule.register({
                            accessToken: ACCESS_TOKEN,
                            authorizationCode: AUTHORIZATION_CODE,
                            refreshToken: REFRESH_TOKEN,
                        }),
                    ],
                }),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('OAuth Authenticate', () => {
        it('authenticate token', () => {
            return request(app.getHttpServer())
                .post('/authenticate')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                )
                .expect(HttpStatus.CREATED)
                .expect(({ body }: request.Response) => {
                    expect(body).toEqual(
                        expect.objectContaining({
                            accessToken: ACCESS_TOKEN.accessToken,
                            accessTokenExpiresAt: ACCESS_TOKEN.accessTokenExpiresAt!.toISOString(),
                            client: CLIENT,
                            user: {},
                        }),
                    );
                });
        });

        it('unauthorized client(s)', () => {
            return request(app.getHttpServer())
                .post('/authenticate')
                .expect(HttpStatus.UNAUTHORIZED)
                .expect(({ body }: any) => {
                    expect(body.message).toBe(
                        'Unauthorized request: no authentication given',
                    );
                });
        });

        it('unauthorized client(s)', () => {
            return request(app.getHttpServer())
                .post('/authenticate/null')
                .expect(({ body }: any) => {
                    expect(body).toEqual(expect.anything());
                });
        });
    });

    describe('OAuth Authorize', () => {
        it('authorize client', () => {
            return request(app.getHttpServer())
                .post('/authorize')
                .set(
                    'Authorization',
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                )
                .query({
                    client_id: CLIENT.id,
                    response_type: 'code',
                    state: 'custom',
                })
                .expect(HttpStatus.CREATED)
                .expect(({ body }: request.Response) => {
                    expect(body).toEqual({
                        authorizationCode:
                            AUTHORIZATION_CODE.authorizationCode,
                        expiresAt: AUTHORIZATION_CODE.expiresAt!.toISOString(),
                        redirectUri: AUTHORIZATION_CODE.redirectUri,
                        scope: AUTHORIZATION_CODE.scope,
                        client: CLIENT,
                        user: {},
                    });
                });
        });

        it('unauthorized client(s)', () => {
            return request(app.getHttpServer())
                .post('/authorize/null')
                .expect(({ body }: any) => {
                    expect(body).toEqual(expect.anything());
                });
        });
    });

    describe('OAuth Token', () => {
        it('get new token', () => {
            return request(app.getHttpServer())
                .post('/renew')
                .set({
                    'Content-Type':
                        'application/x-www-form-urlencoded',
                })
                .send({
                    client_id: CLIENT.id,
                    client_secret: 'client_secret',
                    grant_type: 'authorization_code',
                    code: AUTHORIZATION_CODE.authorizationCode,
                    redirect_uri: AUTHORIZATION_CODE.redirectUri,
                })
                .expect(HttpStatus.CREATED)
                .expect(({ body }: request.Response) => {
                    expect(body).toEqual({
                        accessToken: ACCESS_TOKEN.accessToken,
                        accessTokenExpiresAt: ACCESS_TOKEN.accessTokenExpiresAt!.toISOString(),
                        refreshToken: REFRESH_TOKEN.refreshToken,
                        refreshTokenExpiresAt: REFRESH_TOKEN.refreshTokenExpiresAt!.toISOString(),
                        scope: REFRESH_TOKEN.scope,
                        client: CLIENT,
                        user: {},
                    });
                });
        });
    });
});
