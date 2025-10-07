// use bConfig (brand config) to control which tests to run
// set to "1" to run, "0" to skip
const bConfig = {
    testsToRun: {
        listAllBrands:  0,
    }
};

interface Brand {
    brand_id: string;
    company_name: string;
    dba_name: string;
    registered?: boolean;
    api_allowed?: boolean;
};

// LIST ALL BRANDS
// use bTestOrSkip (brand test or skip) to control which tests to run
let bTestOrSkip = (bConfig.testsToRun.listAllBrands ? test : test.skip);
bTestOrSkip('should list all brands for an account', async () => {
    const { getClient } = require('../testUtils');
    const client = getClient();

    // call the "listBrands" method
    const response: Array<Brand> = await client.listBrands({});

    expect(Array.isArray(response)).toBe(true);
    // check that each item in the array has the correct properties
    for (let index = 0; index < response.length; index++) {
        const element = response[index];

        expect(element).toHaveProperty('brand_id');
        expect(element).toHaveProperty('company_name');
        expect(element).toHaveProperty('dba_name');
    }
});