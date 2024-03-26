'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const maxFiles = 5

export function Header() {
  const { cache, mutate } = useSWRConfig()
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<any[]>([])
  const [uploadProcess, setUploadProcess] = useState(0)
  const [open, setOpen] = useState(false)

  let { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles,
      disabled: loadingUpload,
    })

  const onOpenChange = (isOpen: boolean) => {
    if (cache.get('/api/v1/file')?.isLoading) {
      return toast.warning('Loading data...')
    }

    if (open) {
      acceptedFiles = []
      setUploadFiles([])
    }
    setOpen(isOpen)
  }

  useEffect(() => {
    setUploadFiles(acceptedFiles)
  }, [acceptedFiles])

  useEffect(() => {
    if (fileRejections.length) {
      toast.error('Somthing went wrong!')
    }
  }, [fileRejections])

  const onUpload = async () => {
    try {
      setUploadProcess(0)
      setLoadingUpload(true)

      for (const file of uploadFiles) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/v1/file', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json())

        if (!res.code) {
          setUploadProcess((prev) => {
            if (prev + 1 === uploadFiles.length) {
              acceptedFiles = []
              setUploadFiles([])
              toast.success('Upload success!')
            }
            return prev + 1
          })
          // addList(res.data)
          mutate('/api/v1/file', {
            data: [...cache.get('/api/v1/file')?.data.data, res.data],
          })
        } else {
          toast.error(res.msg || 'Upload failed')
        }
      }
    } catch (error) {
    } finally {
      setLoadingUpload(false)
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur">
      <div className="container flex items-center justify-between font-semibold">
        <Link href="/">Backblaze Interface</Link>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-1.5"
              size="sm"
              // disabled={cache.get('/api/v1/file')?.isLoading}
            >
              <span className="i-mingcute-upload-line h-4 w-4" />
              <span className="hidden md:block">Upload</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">
                Upload Files (max {maxFiles})
              </DialogTitle>
              <div
                className="flex h-28 cursor-pointer items-center justify-center rounded-md border border-dashed bg-muted"
                {...getRootProps()}
              >
                <input {...getInputProps({ maxLength: 2 })} />
                <p
                  className={cn({
                    'text-muted-foreground': loadingUpload,
                  })}
                >
                  Drag drop some files here, or click to select files
                </p>
              </div>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="i-mingcute-attachment-line text-muted-foreground" />
                    <div className="flex-1 text-sm">{file.name}</div>
                  </div>
                  {!loadingUpload && (
                    <span
                      className="i-mingcute-close-line flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        acceptedFiles.splice(index, 1)
                        setUploadFiles(
                          uploadFiles.filter((item) => item !== file),
                        )
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                disabled={!uploadFiles.length || loadingUpload}
                onClick={onUpload}
              >
                {loadingUpload && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload
              </Button>
              {loadingUpload && (
                <>
                  <div>
                    {uploadProcess}/{uploadFiles.length}
                  </div>
                  <Progress
                    value={(uploadProcess / uploadFiles.length) * 100}
                  />
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
