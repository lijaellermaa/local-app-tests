// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {StatusCodes} from 'http-status-codes';
import {UserDTO} from "../src/DTO/UserDTO";

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    let createdUser: UserDTO;

    test.beforeEach(async ({request}) => {
        const responseCreate = await request.post(`${baseURL}`);
        createdUser = await responseCreate.json();
    });

    test('all users: should return array with one or more users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.OK);

        const responseBody: Array<UserDTO> = await response.json();
        expect(responseBody.length).toBeGreaterThanOrEqual(1);
        expect(responseBody).toBeInstanceOf(Array);
    });

    test('find user: should return a user by ID', async ({request}) => {
        const responseSearch = await request.get(`${baseURL}/${createdUser.id}`);
        const foundUser: UserDTO = await responseSearch.json();
        expect(foundUser.id).toBe(createdUser.id);
    });

    test('find user: should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}/101`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);

        const json = await response.json();
        expect(json.message).toBe('User not found');
    });

    test('create user: should add a new user', async () => {
        expect(createdUser.id).toBeDefined();
        expect(createdUser.id).toBeGreaterThan(0);
        expect(createdUser.id).toBeLessThanOrEqual(100);
    });

    test('delete user: should delete a user by ID', async ({request}) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        const json: UserDTO[] = await response.json();

        expect(response.status()).toBe(StatusCodes.OK);
        expect(json[0].id).toBe(createdUser.id);
    });

    test('delete user: should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(response.status()).toBe(StatusCodes.OK);

        const secondDeleteResponse = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(secondDeleteResponse.status()).toBe(StatusCodes.NOT_FOUND);

        const json = await secondDeleteResponse.json();
        expect(json.message).toBe('User not found');
    });

});
