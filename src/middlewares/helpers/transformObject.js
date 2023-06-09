function transformObjectKeys(obj) {
    const transformedObj = {};
    
    for (var [key, value] of Object.entries(obj)) {
      let transformedKey = key;
      transformedKey = transformedKey.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      if ((typeof value === 'object' && value !== null) || Array.isArray(value)){
        value = transformObjectKeys(value);
      }
      transformedObj[transformedKey] = value;
    }
    
    return transformedObj;
  }

module.exports = { transformObjectKeys };
  