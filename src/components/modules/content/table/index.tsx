import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { PhotoView } from 'react-photo-view'
import { formatDistance } from 'date-fns'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { env } from '@/env.mjs'
import { useCopy } from '@/hooks/useCopy'
import { formatSize } from '@/lib/format'
import { useCommonStore } from '@/store/common'

export function TableData() {
  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useCommonStore((state) => [
    state.lists,
    state.updateLists,
  ])
  const [, copy] = useCopy()

  const handleDelete = (item: any) => {
    setLoading(true)
    fetch('/api/v1/file', {
      method: 'DELETE',
      body: JSON.stringify({ fileId: item.fileId, fileName: item.fileName }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.code) {
          toast.success('Deleted successfully')
          setLists(lists.filter((list) => list.fileId !== item.fileId))
        } else {
          toast.error(res.msg || 'Delete failed')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="relative h-[calc(100vh-210px)] overflow-y-auto">
      <Table className="min-w-[700px]">
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-32">Size</TableHead>
            <TableHead className="w-48">Uploaded</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((item) => (
            <TableRow key={item.fileId}>
              <TableCell className="font-medium">
                <div className="line-clamp-1 break-all">
                  <PhotoView
                    src={`https://${env.NEXT_PUBLIC_HOSTNAME}/${item.fileName}`}
                  >
                    <a className="cursor-pointer text-sky-400 underline transition-colors hover:text-sky-500">
                      {item.fileName}
                    </a>
                  </PhotoView>
                </div>
              </TableCell>
              <TableCell>{formatSize(item.contentLength)}</TableCell>
              <TableCell>
                {formatDistance(new Date(item.uploadTimestamp), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 px-0" variant="ghost">
                      <span className="i-mingcute-more-1-fill" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          copy(
                            `https://${env.NEXT_PUBLIC_HOSTNAME}/${item.fileName}`,
                          )
                          toast.success('Copied successfully')
                        }}
                      >
                        <span className="i-mingcute-copy-2-line mr-2 h-4 w-4" />
                        <span>Copy Url</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="h-8 w-8 px-0" variant="ghost">
                      <span className="i-mingcute-delete-2-line text-red-500 transition-colors hover:text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete
                        your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => handleDelete(item)}
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
