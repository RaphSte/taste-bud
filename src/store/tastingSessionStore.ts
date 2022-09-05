import {defineStore} from 'pinia'
import {TasteRating} from "@/types/TastingSessionConfiguration";

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
        },
        sessionKey: '',
    }),
    actions: {
        getTastingItems(){
            return this.tastingSession.tastingItems
        }
    },
})

// tastingItems: [{
//     tastingItemName: 'string',
//     ratings: [],
// }],