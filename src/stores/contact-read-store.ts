import { create } from 'zustand'

const STORAGE_KEY = 'sammi_contact_read_ids'
const isBrowser = typeof window !== 'undefined'

const loadIds = (): number[] => {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === 'number') : []
  } catch {
    return []
  }
}

const saveIds = (ids: number[]) => {
  if (!isBrowser) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore quota / private-mode errors
  }
}

interface ContactReadState {
  readIds: number[]
  markRead: (id: number) => void
  markUnread: (id: number) => void
  markAllRead: (ids: number[]) => void
}

export const useContactReadStore = create<ContactReadState>()((set) => ({
  readIds: loadIds(),

  markRead: (id) =>
    set((state) => {
      if (state.readIds.includes(id)) return state
      const next = [...state.readIds, id]
      saveIds(next)
      return { readIds: next }
    }),

  markUnread: (id) =>
    set((state) => {
      const next = state.readIds.filter((x) => x !== id)
      saveIds(next)
      return { readIds: next }
    }),

  markAllRead: (ids) =>
    set((state) => {
      const next = Array.from(new Set([...state.readIds, ...ids]))
      saveIds(next)
      return { readIds: next }
    }),
}))
