import moment = require('moment');
import {
    AuthorizationCode,
    Client,
    RefreshToken,
    Token,
} from 'oauth2-server';

export const CLIENT: Client = {
    id: 'id',
    grants: ['authorization_code'],
    redirectUris: ['https://example.org'],
};

export const AUTHORIZATION_CODE: AuthorizationCode = {
    authorizationCode: 'authorizationCode',
    expiresAt: moment().add(1, 'd').toDate(),
    redirectUri: 'https://example.org',
    scope: 'scope',
    client: CLIENT,
    user: {},
};

export const REFRESH_TOKEN: RefreshToken = {
    refreshToken: 'refreshToken',
    refreshTokenExpiresAt: moment().add(1, 'd').toDate(),
    scope: 'scope',
    client: CLIENT,
    user: {},
};

export const ACCESS_TOKEN: Token = {
    ...REFRESH_TOKEN,
    accessToken: 'accessToken',
    accessTokenExpiresAt: moment().add(30, 'd').toDate(),
};
