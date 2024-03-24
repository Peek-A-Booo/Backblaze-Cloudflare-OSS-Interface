# Backblaze Cloudflare OSS Interface

Inspired by [Backblaze + Cloudflare搭建个人OSS](https://leezhian.com/faq/other/bb-cf-oss), this project aims to provide a simple interface to manage files in Backblaze B2 using Cloudflare Workers.

![cover](./public/cover.png)

## Features

- **Deploy for free with one-click** on Vercel
- Quickly view Backblaze resources
- Support upload and delete files

## Roadmap

- [ ] Batch delete
- [ ] Pagination of Data
- [ ] Basic permission verification (to avoid direct viewing of all documents)

## Before You Start

Please carefully read "[Backblaze + Cloudflare搭建个人OSS](https://leezhian.com/faq/other/bb-cf-oss)". Follow the instructions to complete:

- Register for a Backblaze account
- Set up Cloudflare with domain name resolution

## Getting Started

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peek-A-Booo/Backblaze-Cloudflare-OSS-Interface&env=APP_KEY_ID&env=APP_KEY&env=BUCKET_NAME&env=NEXT_PUBLIC_HOSTNAME)

### Environment Variables

#### `APP_KEY_ID` (required)

This allows B2 to communicate securely with different devices or apps.

- Step1: Add a New Application Key

  ![step1](./public/step1.jpg)

- Step2: Name your key and choose a bucket

  > **Type of Access: Read and Write**

  ![step2](./public/step2.png)

- Step3: Then you can get your `APP_KEY_ID` and `APP_KEY`

  `keyID` ===> `APP_KEY_ID`

  `applicationKey` ===> `APP_KEY`

  ![step3](./public/step3.png)

#### `APP_KEY` (required)

Look up ⬆️

#### `BUCKET_NAME` (required)

Create a bucket in Backblaze B2.

- Step1: Create a bucket

  ![step4](./public/step4.png)

- Step2: Name your bucket

  > **`Files in Bucket`** select **`Public`**

  ![step5](./public/step5.png)

- Step3: `Bucket Unique Name` ===> `BUCKET_NAME`

#### `NEXT_PUBLIC_HOSTNAME` (required)

Please provide the domain name you configured in the Transform Rules on Cloudflare.

![step6](./public/step6.png)

### Enjoy

<!-- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) and [Cloudflare Workers](https://workers.cloudflare.com/)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
