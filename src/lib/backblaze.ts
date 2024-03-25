import { env } from '@/env.mjs'
import { getRedisValue, setRedisValue } from '@/lib/redis'

/**
 * An authorization token to use with all calls, other than b2_authorize_account, that need an Authorization header.
 * This authorization token is valid for at most 24 hours.
 *
 * If Redis is configured, the token will be stored in Redis and saved for 24 hours; otherwise, the token will be fetched each time.
 */
export async function b2_authorize_account(): Promise<string[]> {
  try {
    const accountInfo = await getRedisValue('accountInfo')
    if (accountInfo) return accountInfo.split(',')

    const res = await fetch(
      'https://api.backblazeb2.com/b2api/v3/b2_authorize_account',
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${env.APP_KEY_ID}:${env.APP_KEY}`).toString('base64'),
        },
      },
    ).then((res) => res.json())
    if (res.authorizationToken && res.apiInfo.storageApi.apiUrl) {
      await setRedisValue(
        'accountInfo',
        `${res.authorizationToken},${res.apiInfo.storageApi.apiUrl}`,
        { ex: 3600 },
      )
      return [res.authorizationToken, res.apiInfo.storageApi.apiUrl]
    }

    throw new Error('Failed to authorize account')
  } catch (error) {
    console.log(error, 'b2_authorize_account error')
    throw new Error('Failed to authorize account')
  }
}

export async function b2_get_upload_url(): Promise<string[]> {
  try {
    const [authorizationToken, apiUrl] = await b2_authorize_account()

    const uploadInfo = await getRedisValue('uploadInfo')
    if (uploadInfo) return uploadInfo.split(',')

    const res = await fetch(
      `${apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${env.BUCKET_ID}`,
      {
        headers: {
          Authorization: authorizationToken,
        },
      },
    ).then((res) => res.json())

    if (res.authorizationToken && res.uploadUrl) {
      await setRedisValue(
        'uploadInfo',
        `${res.authorizationToken},${res.uploadUrl}`,
        { ex: 3600 },
      )
      return [res.authorizationToken, res.uploadUrl]
    }

    throw new Error('Failed to get upload url')
  } catch (error) {
    console.log(error, 'b2_get_upload_url error')
    throw new Error('Failed to get upload url')
  }
}
