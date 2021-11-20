import OAuth2Server = require('oauth2-server');
import { Test, TestingModule } from '@nestjs/testing';

import { OAUTH2_SERVER } from '../../lib/oauth2-server.constants';
import { TestModelService } from '../src/test-model.service';
import { OAuth2ServerModule } from '../../lib';
import { TestConfigService } from '../src/test-config.service';
import { ExistingModule } from '../src/existing.module';

describe('ExampleModule', () => {
    let module: TestingModule;

    describe('register()', () => {
        beforeEach(async () => {
            module = await Test.createTestingModule({
                imports: [
                    OAuth2ServerModule.forRoot({
                        allowEmptyState: true,
                        modelClass: TestModelService,
                    }),
                ],
            }).compile();
        });

        it('should be defined', () => {
            expect(
                module.get<OAuth2Server>(OAUTH2_SERVER),
            ).toBeDefined();
        });
    });

    describe('registerAsync()', () => {
        describe('useFactory()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        OAuth2ServerModule.forRootAsync({
                            useFactory: () => ({}),
                            modelClass: TestModelService,
                        }),
                    ],
                }).compile();

                expect(
                    module.get<OAuth2Server>(OAUTH2_SERVER),
                ).toBeDefined();
            });
        });

        describe('useClass()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        OAuth2ServerModule.forRootAsync({
                            imports: [ExistingModule],
                            useClass: TestConfigService,
                            modelClass: TestModelService,
                        }),
                    ],
                }).compile();

                expect(
                    module.get<OAuth2Server>(OAUTH2_SERVER),
                ).toBeDefined();
            });
        });

        describe('useExisting()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        OAuth2ServerModule.forRootAsync({
                            imports: [ExistingModule],
                            useExisting: TestConfigService,
                            modelClass: TestModelService,
                        }),
                    ],
                }).compile();

                expect(
                    module.get<OAuth2Server>(OAUTH2_SERVER),
                ).toBeDefined();
            });
        });
    });
});
