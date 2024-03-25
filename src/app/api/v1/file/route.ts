import CryptoJS from 'crypto-js'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

import { env } from '@/env.mjs'
import { b2_authorize_account, b2_get_upload_url } from '@/lib/backblaze'
import { delRedisValue } from '@/lib/redis'
import { CORS_HEADERS } from '@/lib/response'

export const runtime = 'edge'

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function GET() {
  try {
    const [authorizationToken, apiUrl] = await b2_authorize_account()

    const res = await fetch(
      `${apiUrl}/b2api/v3/b2_list_file_names?maxFileCount=1000&startFileName=/&bucketId=${env.BUCKET_ID}`,
      {
        headers: {
          Authorization: authorizationToken,
        },
      },
    ).then((res) => res.json())

    return NextResponse.json({
      code: 0,
      data: res.files.sort(
        (a: any, b: any) => b.uploadTimestamp - a.uploadTimestamp,
      ),
    })
  } catch (error: any) {
    console.log(error.message, 'get error')
    await delRedisValue('accountInfo')
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Internal server error',
    })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = `${nanoid(64)}.${file.name.split('.').at(-1)}`
    const fileBuffer = await file.arrayBuffer()

    const [uploadToken, uploadUrl] = await b2_get_upload_url()

    const res = await fetch(uploadUrl, {
      headers: {
        Authorization: uploadToken,
        'X-Bz-File-Name': fileName,
        'Content-Type': 'b2/x-auto',
        'Content-Length': Buffer.from(fileBuffer).byteLength.toString(),
        'X-Bz-Content-Sha1': CryptoJS.SHA1(
          CryptoJS.lib.WordArray.create(fileBuffer),
        ).toString(CryptoJS.enc.Hex),
      },
      method: 'POST',
      body: Buffer.from(fileBuffer),
    }).then((res) => res.json())

    if (res.fileId) {
      return NextResponse.json(
        { code: 0, data: res },
        {
          headers: CORS_HEADERS,
        },
      )
    }

    if (res.code === 'bad_auth_token') {
      await delRedisValue('accountInfo')
      await delRedisValue('uploadInfo')
    }

    return NextResponse.json(
      {
        code: -1,
        msg: res.code || 'Internal server error',
      },
      {
        headers: CORS_HEADERS,
      },
    )
  } catch (error: any) {
    console.log(error.message, 'upload error')
    return NextResponse.json(
      {
        code: -1,
        msg: error.message || 'Internal server error',
      },
      {
        headers: CORS_HEADERS,
      },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileId, fileName } = await request.json()

    const [authorizationToken, apiUrl] = await b2_authorize_account()

    const res = await fetch(`${apiUrl}/b2api/v3/b2_delete_file_version`, {
      headers: {
        Authorization: authorizationToken,
      },
      method: 'POST',
      body: JSON.stringify({ fileId, fileName }),
    }).then((res) => res.json())

    if (res.fileId) {
      return NextResponse.json(
        { code: 0, data: res },
        {
          headers: CORS_HEADERS,
        },
      )
    }

    if (res.code === 'bad_auth_token') {
      await delRedisValue('accountInfo')
    }

    return NextResponse.json(
      {
        code: -1,
        msg: res.code || 'Internal server error',
      },
      {
        headers: CORS_HEADERS,
      },
    )
  } catch (error: any) {
    console.log(error.message, 'delete error')
    return NextResponse.json(
      {
        code: -1,
        msg: error.message || 'Internal server error',
      },
      {
        headers: CORS_HEADERS,
      },
    )
  }
}
