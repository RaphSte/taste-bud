import {defineStore} from 'pinia'

export const useScoreStore = defineStore('scoreStore', {
    state: () => ({
        participantsScores: {},
        userScore: 0,
    }),
})
