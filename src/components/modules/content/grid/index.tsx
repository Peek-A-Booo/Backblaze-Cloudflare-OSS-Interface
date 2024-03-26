import { useSWRConfig } from 'swr'

import { ImageItem } from '@/components/modules/imageItem'

export function GridData() {
  const { cache, mutate } = useSWRConfig()

  const lists: any[] = cache.get('/api/v1/file')?.data?.data || []

  const onDelete = (fileId: string) => {
    mutate('/api/v1/file', {
      data: lists.filter((item) => item.fileId !== fileId),
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {lists.map((item) => (
        <ImageItem key={item.fileId} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
