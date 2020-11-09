import { Controller, DynamicModule, Get, Inject, Module, useExpressServer } from '../../../../src';
import express, { Response } from "express";
import request from 'supertest';

@Controller()
class MockController {

    constructor(
        @Inject('mock_token')
        private data: string
    ) { }

    @Get()
    index(req: any, res: Response) {
        res.status(200).send(this.data);
    }
}

@Module()
class MockDynamicModule {
    static async forRootAsync(): Promise<DynamicModule> {

        const asyncFunc = () => new Promise(resolve =>
            setTimeout(() => { resolve("data from dynamic module") }, 100)
        );

        const provider = {
            provide: "mock_token",
            useFactory:  () => async () => await asyncFunc()
        }
        return {
            module: MockDynamicModule,
            providers : [provider]
        };

    }
}

describe('async-dynamic-module-inject GET (e2e)', () => {

    let app: express.Application;
    beforeAll(async () => {
        app = express();
        await useExpressServer(app, {
            controllers: [MockController],
            imports: [MockDynamicModule.forRootAsync()]
        });
        app.listen();
    });

    it('/ [get]', () => {
        request(app)
            .get('/')
            .expect(200)
            .expect('data from dynamic module')
    });

});
