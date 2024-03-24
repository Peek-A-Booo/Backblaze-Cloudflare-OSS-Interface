import { NextResponse } from 'next/server'

import { env } from '@/env.mjs'
import { b2_authorize_account } from '@/lib/backblaze'

export async function GET() {
  try {
    const [authorizationToken, accountId, apiUrl] = await b2_authorize_account()

    const bucketsRes = await fetch(`${apiUrl}/b2api/v3/b2_list_buckets`, {
      headers: {
        Authorization: authorizationToken,
      },
      method: 'POST',
      body: JSON.stringify({ accountId, bucketName: env.BUCKET_NAME }),
    }).then((res) => res.json())
    const bucket = bucketsRes.buckets[0]

    const { files } = await fetch(
      `${apiUrl}/b2api/v3/b2_list_file_names?maxFileCount=1000&startFileName=/&bucketId=${bucket.bucketId}`,
      {
        headers: {
          Authorization: authorizationToken,
        },
      },
    ).then((res) => res.json())

    return NextResponse.json({
      code: 0,
      data: files.sort(
        (a: any, b: any) => b.uploadTimestamp - a.uploadTimestamp,
      ),
    })
  } catch (error: any) {
    console.log(error.message, 'get error')
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Internal server error',
    })
  }
}
