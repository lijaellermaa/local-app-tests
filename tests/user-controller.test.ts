// tests/api.spec.ts
import { test, expect } from '@playwright/test';
let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    type User = {
        id: number;
        name: string;
        email: string;
        phone: string;
    }

    let createdUser: User

    test.beforeEach(async ({ request }) => {
        const responseCreate = await request.post(`${baseURL}`);
        createdUser = await responseCreate.json()
    })

    test('all users: should return empty array when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        const users: User[] = await response.json()

        for (let i = 0; i < users.length; i++) {
            await request.delete(`${baseURL}/${users[i].id}`);
        }

        const afterDeleteResponse = await request.get(`${baseURL}`);
        const afterDeleteResponseJson = await afterDeleteResponse.json()

        expect(afterDeleteResponseJson.length).toBe(0)
        expect(afterDeleteResponseJson).toBeInstanceOf(Array);
    });

    test('find user: should return a user by ID', async ({ request }) => {
        const responseSearch = await request.get(`${baseURL}/${createdUser.id}`);
        const foundUser: User = await responseSearch.json()
        expect(foundUser.id).toBe(createdUser.id)
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}/101`);
        expect(response.status()).toBe(404);

        const json = await response.json()
        expect(json.message).toBe('User not found')
    });

    test('create user: should add a new user', async ({ request }) => {
        expect(createdUser.id).toBeDefined()
        expect(createdUser.id).toBeGreaterThan(0)
        expect(createdUser.id).toBeLessThanOrEqual(100)
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        const json: User[] = await response.json()

        expect(response.status()).toBe(200);
        expect(json[0].id).toBe(createdUser.id)
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(response.status()).toBe(200);

        const secondDeleteResponse = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(secondDeleteResponse.status()).toBe(404);

        const json = await secondDeleteResponse.json()
        expect(json.message).toBe('User not found')
    });

});
