import {defineStore} from 'pinia'
import {TasteRating} from "@/types/TastingSessionConfiguration";

export const useTastedItemsStore = defineStore('tastedItemsStore', {
    state: () => ({
        items: new Map<string, TasteRating[]>()
    }),
})