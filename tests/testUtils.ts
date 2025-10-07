const getClient = () => {
    const DropCowboy = require('../src/index').default;
    return new DropCowboy({
        teamId: process.env.TEAM_ID,
        secret: process.env.SECRET,
    });
}

export { getClient };