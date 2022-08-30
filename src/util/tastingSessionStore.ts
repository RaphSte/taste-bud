import {defineStore} from 'pinia'
import {TastingItem, TastingSession} from "@/types/TastingSessionConfiguration";

export const useTastingSessionStore = defineStore('tastingSessionStore', {
    state: () => ({
        tastingSession: {
            config: {
                creatorId: '',
                creatorName: '',
                sessionName: '',
                categories: '',
            },
            tastingItems: [],
        }
    }),
})