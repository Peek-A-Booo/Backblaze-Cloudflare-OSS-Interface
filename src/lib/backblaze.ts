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
    if (
      res.authorizationToken &&
      res.accountId &&
      res.apiInfo.storageApi.apiUrl
    ) {
      // 23 hours ===> 82800
      // redis.set('key', 'value', { ex: 82800 })
      setRedisValue(
        'accountInfo',
        `${res.authorizationToken},${res.accountId},${res.apiInfo.storageApi.apiUrl}`,
        { ex: 82800 },
      )
      return [
        res.authorizationToken,
        res.accountId,
        res.apiInfo.storageApi.apiUrl,
      ]
    }

    throw new Error('Failed to authorize account')
  } catch (error) {
    console.log(error, 'b2_authorize_account error')
    throw new Error('Failed to authorize account')
  }
}
