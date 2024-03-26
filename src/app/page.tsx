'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { PhotoProvider } from 'react-photo-view'
import { toast } from 'sonner'
import useSWR from 'swr'

import { GridData } from '@/components/modules/content/grid'
import { TableData } from '@/components/modules/content/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const fetcher = async (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/v1/file', fetcher)

  const [type, setType] = useState('grid')

  useLayoutEffect(() => {
    const localType = localStorage.getItem('display-mode')
    if (localType && ['table', 'grid'].includes(localType)) {
      setType(localType)
    }
  }, [])

  useEffect(() => {
    if (data?.code) toast.error(data?.msg)
  }, [data])

  return (
    <div className="container">
      <PhotoProvider>
        <Card>
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Files
              </h3>
              <div>
                <Tabs
                  value={type}
                  onValueChange={(value) => {
                    localStorage.setItem('display-mode', value)
                    setType(value)
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid" className="gap-1">
                      <span className="i-mingcute-grid-line" />
                      <span className="hidden md:block">Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="table" className="gap-1">
                      <span className="i-mingcute-table-2-line" />
                      <span className="hidden md:block">Table</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100vh-170px)] overflow-y-auto pt-2">
            {isLoading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : error ? (
              <div>Error</div>
            ) : (
              <>{type === 'grid' ? <GridData /> : <TableData />}</>
            )}
          </CardContent>
        </Card>
      </PhotoProvider>
    </div>
  )
}
