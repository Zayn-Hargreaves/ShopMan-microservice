const _ = require("lodash")

// lay cac truong tu 1 object cu the
// const user = await User.findOne({ where: { id: 1 } });
// const filteredUser = getInfoData({
//     fields: ['id', 'name', 'email'], 
//     object: user.dataValues
// });
// const users = await User.findAll({
//     attributes: getSelectData(['id', 'name', 'email']) // Tương đương: ['id', 'name', 'email']
// });

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
const getSelectData = (select = []) => {
    return select
}
const getUnselectData = (exclude = []) => {
    return { exclude }
}

const removeUndefinedCheck = (obj) => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k];
        }
    });
    return obj;
};

const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

module.exports = {
    getInfoData,
    getSelectData,
    getUnselectData,
    removeUndefinedCheck,
    updateNestedObjectParser
}