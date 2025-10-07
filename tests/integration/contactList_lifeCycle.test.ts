interface ContactList {
    list_id: string;
    list_name: string;
    created_at: string;
    contact_count?: number;
}

interface AppendContactsResponse {
    accepted_count: number;
    rejected: Array<{ index: number; reason: string }>;
}

// Full lifecycle integration test for contact lists
describe('Contact List Lifecycle', () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    let createdList: ContactList;
    const initialListName = 'NPM Package Test List';
    const renamedListName = 'NPM Package Test List (Renamed)';

    // CREATE
    test('should create a new contact list', async () => {
        const response: ContactList = await client.createContactList({ list_name: initialListName });

        expect(response).toHaveProperty('list_id');
        expect(response).toHaveProperty('list_name');
        expect(response).toHaveProperty('created_at');

        expect(response.list_name).toBe(initialListName);

        createdList = response;
    });

    // GET (after create)
    test('should get the newly created list', async () => {
        const response: ContactList = await client.getContactList(createdList.list_id);

        expect(response).toHaveProperty('list_name');
        expect(response).toHaveProperty('list_id');
        expect(response).toHaveProperty('contact_count');
        expect(response).toHaveProperty('created_at');

        expect(response.contact_count).toBe(0);
        expect(response.list_id).toBe(createdList.list_id);
        expect(response.list_name).toBe(initialListName);
    });

    // RENAME
    test('should rename the list', async () => {
        const response = await client.renameContactList(createdList.list_id, { list_name: renamedListName });
        expect(response).toBe('');
    });

    // GET (after rename)
    test('should confirm the list was renamed', async () => {
        const response: ContactList = await client.getContactList(createdList.list_id);

        expect(response).toHaveProperty('list_name');
        expect(response).toHaveProperty('list_id');
        expect(response).toHaveProperty('contact_count');
        expect(response).toHaveProperty('created_at');

        expect(response.contact_count).toBe(0);
        expect(response.list_id).toBe(createdList.list_id);
        expect(response.list_name).toBe(renamedListName);
    });

    // APPEND CONTACT
    test('should append a new contact to the list', async () => {
        const payload = {
            fields: ['first_name', 'phone'],
            values: [['Hunter', process.env.TEST_PHONE_NUMBER]]
        };
        const response: AppendContactsResponse = await client.appendContactsToList(createdList.list_id, payload);

        expect(response).toHaveProperty('accepted_count');
        expect(response).toHaveProperty('rejected');

        expect(response.accepted_count).toBe(1);
        expect(response.rejected).toEqual([]);
    });

    // GET (after append)
    test('should reflect the new contact count', async () => {
        const response: ContactList = await client.getContactList(createdList.list_id);

        expect(response).toHaveProperty('list_name');
        expect(response).toHaveProperty('list_id');
        expect(response).toHaveProperty('contact_count');
        expect(response).toHaveProperty('created_at');

        expect(response.contact_count).toBeGreaterThan(0);
        expect(response.list_id).toBe(createdList.list_id);
        expect(response.list_name).toBe(renamedListName);
    });

    // DELETE
    test('should delete the list', async () => {
        const response = await client.deleteContactList(createdList.list_id);
        
        expect(response).toHaveProperty('list_id');
        expect(response.list_id).toBe(createdList.list_id);
    });
});
