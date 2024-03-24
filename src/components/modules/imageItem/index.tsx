'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { PhotoView } from 'react-photo-view'
import { formatDistance } from 'date-fns'
import Image from 'next/image'
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
import { env } from '@/env.mjs'
import { useCopy } from '@/hooks/useCopy'
import { formatSize } from '@/lib/format'

export function ImageItem({
  item,
  onDelete,
}: {
  item: any
  onDelete: (fileId: string) => void
}) {
  const [isCopied, copy] = useCopy()
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)
    fetch('/api/file', {
      method: 'DELETE',
      body: JSON.stringify({ fileId: item.fileId, fileName: item.fileName }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.code) {
          toast.success('Deleted successfully')
          onDelete(res.data.fileId)
        } else {
          toast.error(res.msg || 'Delete failed')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-md border shadow-[0_1px_6px_#00000014]">
      <div className="flex h-52 w-full cursor-pointer overflow-hidden border-b">
        <PhotoView src={`https://${env.NEXT_PUBLIC_HOSTNAME}/${item.fileName}`}>
          <Image
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            src={`https://${env.NEXT_PUBLIC_HOSTNAME}/${item.fileName}`}
            alt="image"
            width={208}
            height={208}
          />
        </PhotoView>
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-medium">{item.fileName}</div>
        <div className="mt-1 flex justify-between">
          <div className="text-xs text-muted-foreground">
            {formatSize(item.contentLength)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistance(new Date(item.uploadTimestamp), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <Button
            className="h-6 px-3 text-xs"
            variant="outline"
            onClick={() => {
              if (isCopied) return
              copy(`https://${env.NEXT_PUBLIC_HOSTNAME}/${item.fileName}`)
            }}
          >
            {isCopied ? (
              <span className="i-mingcute-check-line h-4 w-4" />
            ) : (
              'Copy'
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="h-6 px-3 text-xs" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure to delete?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete your
                  data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
