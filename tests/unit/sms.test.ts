// use smsConfig (sms config) to control which tests to run
// set to "1" to run, "0" to skip
const smsConfig = {
    testsToRun: {
        sendSms:    0,
    }
};

interface SMSResponse {
    status: string;
};

// SEND sms
// use smsTestOrSkip (sms test or skip) to control which tests to run
let smsTestOrSkip = (smsConfig.testsToRun.sendSms ? test : test.skip);
smsTestOrSkip('should send an sms', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "sendSms" method
    const response: SMSResponse = await client.sendSms({
        team_id: process.env.TEAM_ID as string,
        secret: process.env.SECRET as string,
        sms_body: 'Hey there! This is a test message from the Drop Cowboy Public NPM package.',
        pool_id: '00000000-0000-0000-0000-000000000000',
        phone_number: process.env.TEST_PHONE_NUMBER as string,
        caller_id: '+15557778888',
        opt_in: true
    });

    // check for properties in data
    expect(response).toHaveProperty('status');
    // check that status is correct
    expect(response.status).toBe('queued');
});