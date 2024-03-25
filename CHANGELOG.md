# Changelog

## v0.1.2

### Add

- Support display modes of grid and table
- Add `ACCESS_CODE` to protect the access of the website

## v0.1.1

### Breaking

- Replace env var `BUCKET_NAME` with `BUCKET_ID`

### Add

- Integrate `@upstash/redis` to reduce [Transactions Class C calls](https://www.backblaze.com/cloud-storage/transaction-pricing).
- Add edge runtime in `/api/v1` router

### Changed

- Remove `backblaze-b2`
- Refactor backblaze api based on [B2 NATIVE API](https://www.backblaze.com/apidocs/introduction-to-the-b2-native-api)
