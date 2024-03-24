'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoProvider } from 'react-photo-view'
import { toast } from 'sonner'

import { ImageItem } from '@/components/modules/imageItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const maxFiles = 5

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState<any[]>([])

  const [loadingUpload, setLoadingUpload] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<any[]>([])
  const [uploadProcess, setUploadProcess] = useState(0)

  let { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles,
      disabled: loadingUpload,
    })

  const getBuckets = () => {
    setLoading(true)

    fetch('/api/file')
      .then((res) => res.json())
      .then((res) => {
        setLists(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onUpload = async () => {
    try {
      setUploadProcess(0)
      setLoadingUpload(true)

      for (const file of uploadFiles) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/file', {
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
          setLists((prev) => [res.data, ...prev])
        } else {
          toast.error(res.msg || 'Upload failed')
        }
      }
    } catch (error) {
    } finally {
      setLoadingUpload(false)
    }
  }

  const onDelete = (fileId: string) => {
    setLists((prev) => prev.filter((item) => item.fileId !== fileId))
  }

  useEffect(() => {
    getBuckets()
  }, [])

  useEffect(() => {
    setUploadFiles(acceptedFiles)
  }, [acceptedFiles])

  useEffect(() => {
    if (fileRejections.length) {
      toast.error('Somthing went wrong!')
    }
  }, [fileRejections])

  return (
    <div className="container">
      <PhotoProvider>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Files
              </h3>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={loading}>Upload</Button>
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
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
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
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {lists.map((item) => (
                  <ImageItem
                    key={item.fileId}
                    item={item}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PhotoProvider>
    </div>
  )
}
