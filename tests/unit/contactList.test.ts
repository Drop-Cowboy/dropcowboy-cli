// use clConfig (contact list config) to control which tests to run
// set to "1" to run, "0" to skip
const clConfig = {
    testsToRun: {
        createContactList:      0,
        getContactList:         0,
        renameContactList:      0,
        appendContactsToList:   0,
        deleteContactList:      0,
    }
};

interface ContactList {
    list_id: string;
    list_name: string;
    created_at: string;
    contact_count?: number;
};

interface AppendContactsResponse {
    accepted_count: number;
    rejected: Array<{ index: number; reason: string }>;
};

// CREATE CONTACT LIST
// use clTestOrSkip (contact list test or skip) to control which tests to run
let clTestOrSkip = (clConfig.testsToRun.createContactList ? test : test.skip);
clTestOrSkip('should create a new list, and return with a payload including list_id, list_name, and created_at', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "createContactList" method
    const listName = 'NPM Package Test List';
    const response: ContactList = await client.createContactList({ list_name: listName });
    
    // check for properties in data
    expect(response).toHaveProperty('list_id');
    expect(response).toHaveProperty('created_at');
    expect(response).toHaveProperty('list_name');
    // check that list_name is correct
    expect(response.list_name).toBe(listName);
});

// GET CONTACT LIST
clTestOrSkip = (clConfig.testsToRun.getContactList ? test : test.skip);
clTestOrSkip('should get a list, and return with a payload including list_id, list_name, contact_count, and created_at', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "getContactList" method
    const listId = '00000000-0000-0000-0000-000000000000';
    const listName = 'NPM Package Test List';
    const createdAt = 1756851172641;
    const contactCount = 1;
    const response: ContactList = await client.getContactList(listId);
    
    // check for properties in data
    expect(response).toHaveProperty('list_id');
    expect(response).toHaveProperty('created_at');
    expect(response).toHaveProperty('contact_count');
    expect(response).toHaveProperty('list_name');
    // check that values are correct
    expect(response.list_id).toBe(listId);
    expect(response.list_name).toBe(listName);
    expect(response.created_at).toBe(createdAt);
    expect(response.contact_count).toBe(contactCount);
});

// RENAME CONTACT LIST
clTestOrSkip = (clConfig.testsToRun.renameContactList ? test : test.skip);
clTestOrSkip('should rename a list, and return with no errors', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();
    
    // call the "renameContactList" method
    const listId = '00000000-0000-0000-0000-000000000000';
    const response: any = await client.renameContactList(listId, { list_name: 'NPM Package Test List' });
    expect(response).toBe('');
});

// APPEND CONTACTS TO LIST
clTestOrSkip = (clConfig.testsToRun.appendContactsToList ? test : test.skip);
clTestOrSkip('should append contacts to a list, and return with no errors', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();
    
    // call the "appendContactsToList" method
    const listId = '00000000-0000-0000-0000-000000000000';
    const payload = {
        fields: ['first_name', 'phone'],
        values: [['John', process.env.TEST_PHONE_NUMBER]]
    };
    const response: AppendContactsResponse = await client.appendContactsToList(listId, payload);
    // check for properties in data
    expect(response).toHaveProperty('accepted_count');
    expect(response).toHaveProperty('rejected');
    // check that values are correct
    expect(response.accepted_count).toBe(1);
    expect(response.rejected).toEqual([]);
});

// DELETE CONTACT LIST
clTestOrSkip = (clConfig.testsToRun.deleteContactList ? test : test.skip);
clTestOrSkip('should delete a list, and return with no errors', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();
    
    // call the "deleteContactList" method
    const listId = '00000000-0000-0000-0000-000000000000';
    const response: ContactList = await client.deleteContactList(listId);

    // check for properties in data
    expect(response).toHaveProperty('list_id');
    // check that values are correct
    expect(response.list_id).toBe(listId);
});