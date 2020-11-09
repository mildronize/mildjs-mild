import { Controller, DynamicModule, Get, Inject, Module, useExpressServer } from '../../../../src';
import express, { Response } from "express";
import request from 'supertest';

@Controller()
class MockController {

    @Get()
    index(req: any, res: Response) {
        res.status(200).send('OK');
    }
}

@Module()
class MockDynamicModule { 
    static forRoot(): DynamicModule{
        return {
            module: MockDynamicModule
        }
    }
}

describe('Module with controller GET (e2e)', () => {

    let app: express.Application;
    beforeAll(async () => {
        app = express();
        useExpressServer(app, { 
            controllers: [MockController],
            imports: [MockDynamicModule.forRoot()] 
        });
        app.listen();
    });

    it('/ [get]', () => {
        request(app)
            .get('/')
            .expect(200)
            .expect('OK')
    });

});
