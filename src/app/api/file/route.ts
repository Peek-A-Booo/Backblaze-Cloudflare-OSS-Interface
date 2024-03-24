import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

import { env } from '@/env.mjs'
import { b2 } from '@/lib/b2'

export async function GET() {
  try {
    await b2.authorize()
    const bucketRes = await b2.getBucket({ bucketName: env.BUCKET_NAME })
    const bucket = bucketRes.data.buckets[0]
    const listRes = await b2.listFileNames({
      bucketId: bucket.bucketId,
      startFileName: '/',
      // The maximum number of files returned per transaction is 1000. If you set maxFileCount to more than 1000 and more than 1000 are returned,
      // the call will be billed as multiple transactions, as if you had made requests in a loop asking for 1000 at a time.
      maxFileCount: 1000,
      delimiter: '',
      prefix: '',
    })
    const fileList = listRes.data.files.sort(
      (a: any, b: any) => b.uploadTimestamp - a.uploadTimestamp,
    )

    return NextResponse.json({ code: 0, data: fileList })
  } catch (error: any) {
    console.log(error.message, 'get error')
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

    await b2.authorize() // must authorize first (authorization lasts 24 hrs)
    const bucketRes = await b2.getBucket({ bucketName: env.BUCKET_NAME })
    const bucket = bucketRes.data.buckets[0]
    const uploadUrlRes = await b2.getUploadUrl({ bucketId: bucket.bucketId })
    const res = await b2.uploadFile({
      uploadUrl: uploadUrlRes.data.uploadUrl,
      uploadAuthToken: uploadUrlRes.data.authorizationToken,
      fileName,
      data: Buffer.from(fileBuffer),
    })

    return NextResponse.json({ code: 0, data: res.data })
  } catch (error: any) {
    console.log(error.message, 'upload error')
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Internal server error',
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileId, fileName } = await request.json()
    await b2.authorize()
    const res = await b2.deleteFileVersion({ fileId, fileName })

    return NextResponse.json({ code: 0, data: res.data })
  } catch (error: any) {
    console.log(error.message, 'delete error')
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Internal server error',
    })
  }
}
