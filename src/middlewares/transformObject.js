function transformObjectKeys(obj) {
    const transformedObj = {};
    
    for (const [key, value] of Object.entries(obj)) {
      let transformedKey = key;
      transformedKey = transformedKey.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      transformedObj[transformedKey] = value;
    }
    
    return transformedObj;
  }

module.exports = { transformObjectKeys };
  