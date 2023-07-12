function makeConfig(method, url, config) {
    return {
      ...config,
      method,
      url
    };
}

module.exports = {
    makeConfig
};
