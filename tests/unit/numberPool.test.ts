// use npConfig (number pool config) to control which tests to run
// set to "1" to run, "0" to skip
const npConfig = {
    testsToRun: {
        listPools:  0,
    }
};

interface NumberPool {
    pool_id: string;
    name: string;
    brand_id: string;
    service_type: string;
    number_count: number;
};

// LIST NUMBER POOLS
// use npTestOrSkip (number pool test or skip) to control which tests to run
let npTestOrSkip = (npConfig.testsToRun.listPools ? test : test.skip);
npTestOrSkip('should list all number pools for an account', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "listPools" method
    const response: Array<NumberPool> = await client.listPools({});

    expect(Array.isArray(response)).toBe(true);
    // check that each item in the array has the correct properties
    for (let index = 0; index < response.length; index++) {
        const element = response[index];

        expect(element).toHaveProperty('pool_id');
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('brand_id');
        expect(element).toHaveProperty('service_type');
        expect(element).toHaveProperty('number_count');
    }
});