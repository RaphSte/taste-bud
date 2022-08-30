import {defineStore} from 'pinia'

export const useTastingSessionStore = defineStore('tastingSessionStore', {
    state: () => ({
        tastingSession: {
            config: {
                creatorId: '',
                creatorName: '',
                sessionName: '',
                categories: [],
            },
            tastingItems: [],
        }
    }),
})