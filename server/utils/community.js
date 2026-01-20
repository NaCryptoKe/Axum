
const isOfficialSpace = (space, game) => {
    if (!space || !game) {
        return false;
    }
    if (!space.organization_id || !game.org_id) {
        return false;
    }
    return space.organization_id === game.org_id;
};

module.exports = {
    isOfficialSpace,
};
