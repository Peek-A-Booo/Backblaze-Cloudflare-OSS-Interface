'use client'

import { useLayoutEffect, useState } from 'react'
import { PhotoProvider } from 'react-photo-view'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'

import { GridData } from '@/components/modules/content/grid'
import { TableData } from '@/components/modules/content/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCommonStore } from '@/store/common'

export default function Home() {
  const [loading, setLoading] = useCommonStore(
    useShallow((state) => [state.loading, state.updateLoading]),
  )
  const setLists = useCommonStore((state) => state.updateLists)
  const [type, setType] = useState('grid')

  const getLists = () => {
    setLoading(true)

    fetch('/api/v1/file')
      .then((res) => res.json())
      .then((res) => {
        if (res.code) {
          toast.error(res.msg)
          setLists([])
        } else {
          setLists(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useLayoutEffect(() => {
    const localType = localStorage.getItem('display-mode')
    if (localType && ['table', 'grid'].includes(localType)) {
      setType(localType)
    }

    getLists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            {loading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <>{type === 'grid' ? <GridData /> : <TableData />}</>
            )}
          </CardContent>
        </Card>
      </PhotoProvider>
    </div>
  )
}
