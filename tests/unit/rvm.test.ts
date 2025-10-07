// use rvmConfig (rvm config) to control which tests to run
// set to "1" to run, "0" to skip
const rvmConfig = {
    testsToRun: {
        sendRvm:    0,
    }
};

interface RVMResponse {
    status: string;
};

// SEND RVM
// use rvmTestOrSkip (rvm test or skip) to control which tests to run
let rvmTestOrSkip = (rvmConfig.testsToRun.sendRvm ? test : test.skip);
rvmTestOrSkip('should send an rvm', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "sendRvm" method
    const response: RVMResponse = await client.sendRvm({
        team_id: process.env.TEAM_ID as string,
        secret: process.env.SECRET as string,
        brand_id: '00000000-0000-0000-0000-000000000000',
        recording_id: '00000000-0000-0000-0000-000000000000',
        phone_number: process.env.TEST_PHONE_NUMBER as string
    });

    // check for properties in data
    expect(response).toHaveProperty('status');
    // check that status is correct
    expect(response.status).toBe('queued');
});