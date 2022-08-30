import {defineStore} from 'pinia'

export const useTastedItemsStore = defineStore('tastedItemsStore', {
    state: () => ({
        items: ''
    }),
})