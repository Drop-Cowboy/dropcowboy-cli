// use rConfig (recording config) to control which tests to run
// set to "1" to run, "0" to skip
const rConfig = {
    testsToRun: {
        listAllRecordings:              0,
        listApprovedRecordings:         0,
        listNonApprovedRecordings:      0,
    }
};

interface Recording {
    media_id: string;
    name: string;
    created_at: string;
    api_allowed: string;
};

// LIST ALL RECORDINGS
// use rTestOrSkip (recording test or skip) to control which tests to run
let rTestOrSkip = (rConfig.testsToRun.listAllRecordings ? test : test.skip);
rTestOrSkip('should list all recordings for an account', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "listRecordings" method
    const response: Array<Recording> = await client.listRecordings({});

    expect(Array.isArray(response)).toBe(true);
    // check that each item in the array has the correct properties
    for (let index = 0; index < response.length; index++) {
        const element = response[index];

        expect(element).toHaveProperty('media_id');
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('created_at');
        expect(element).toHaveProperty('api_allowed');
    }
});

// LIST APPROVED RECORDINGS
rTestOrSkip = (rConfig.testsToRun.listApprovedRecordings ? test : test.skip);
rTestOrSkip('should list all approved recordings for an account', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "listRecordings" method
    const response: Array<Recording> = await client.listRecordings({ api_allowed: true });

    expect(Array.isArray(response)).toBe(true);
    // check that each item in the array has the correct properties
    for (let index = 0; index < response.length; index++) {
        const element = response[index];

        expect(element).toHaveProperty('media_id');
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('created_at');
        expect(element).toHaveProperty('api_allowed');
        // check that api_allowed is true
        expect(element.api_allowed).toBe(true);
    }
});

// LIST NON APPROVED RECORDINGS
rTestOrSkip = (rConfig.testsToRun.listApprovedRecordings ? test : test.skip);
rTestOrSkip('should list all non approved recordings for an account', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "listRecordings" method
    const response: Array<Recording> = await client.listRecordings({ api_allowed: false });

    expect(Array.isArray(response)).toBe(true);
    // check that each item in the array has the correct properties
    for (let index = 0; index < response.length; index++) {
        const element = response[index];

        expect(element).toHaveProperty('media_id');
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('created_at');
        expect(element).toHaveProperty('api_allowed');
        // check that api_allowed is false
        expect(element.api_allowed).toBe(false);
    }
});