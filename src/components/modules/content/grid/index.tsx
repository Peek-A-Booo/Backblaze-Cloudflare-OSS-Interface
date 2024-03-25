import { ImageItem } from '@/components/modules/imageItem'
import { useCommonStore } from '@/store/common'

export function GridData() {
  const [lists, setLists] = useCommonStore((state) => [
    state.lists,
    state.updateLists,
  ])

  const onDelete = (fileId: string) => {
    setLists(lists.filter((item) => item.fileId !== fileId))
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {lists.map((item) => (
        <ImageItem key={item.fileId} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
