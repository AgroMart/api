module.exports = ({ env }) => ({
  upload: {
    provider: "firestore",
    providerOptions: {
      customBucket: env("BUCKET_NAME"),
      serviceAccount: require("../service_account_keys.json"),
      bucket: env("STORAGE_BUCKET_URL"),
      uploadOptions: {},
      deleteOptions: {},
    },
  },
});
