
const generalTools = {};



generalTools.objectValuesHolder = (object, elements) => {
    
    let result = {};
    for (const key in object) {
        (elements.includes(key))? result[key] = object[key] : null;
    };
    return result;
};



generalTools.trimObjectValues = (object) => {
    for (const key in object) {
        typeof(object[key]) === 'string'? object[key] = object[key].trim() : null;
    };
    return object;
};





module.exports = generalTools;
