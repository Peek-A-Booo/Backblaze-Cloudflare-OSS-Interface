import { create } from 'zustand'

interface CommonStore {
  loading: boolean
  lists: any[]

  updateLoading: (loading: boolean) => void
  updateLists: (lists: any[]) => void
  addList: (list: any) => void
}

export const useCommonStore = create<CommonStore>((set, get) => ({
  loading: false,
  lists: [],

  updateLoading: (loading) => set({ loading }),
  updateLists: (lists) => set({ lists }),
  addList: (list) => set((state) => ({ lists: [list, ...state.lists] })),
}))
