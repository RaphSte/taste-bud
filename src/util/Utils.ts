import {v4 as uuidv4} from 'uuid';
import {
    getSessionKeyFromPreferences,
    getUserIdFromPreferences,
    setTastingSessionToPreferences,
    setUserIdToPreferences
} from "@/controller/LocalStorage";
import {TasteRating, TastingItem, TastingSession} from "@/types/TastingSessionConfiguration";
import {
    fetchTastingSession,
    writeScoreToFirestore,
    writeTasteRatingsToFirestore,
    writeTastingItemsToFirestore
} from "@/controller/TastingSession";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {useTastedItemsStore} from "@/store/tastedItemsStore";
import {useUserStore} from "@/store/userStore";
import {storeToRefs} from "pinia";
import {Ref} from "vue";
import {useScoreStore} from "@/store/scoreStore";
import {Action, UpdateActionItem} from "@/types/UpdateActions";


export async function createUserIdAndSaveToLocalStorage(): Promise<string> {
    await setUserIdToPreferences(uuidv4())
    return getUserIdFromPreferences() //to make sure the id was set
}

export function loadOrCreateUserId(): Ref<string> {
    const userStore = useUserStore();
    if (!userStore.userId) {
        getUserIdFromPreferences().then(id => userStore.$patch({userId: id})).catch(reason => {
            if (reason === 'No uid found') {
                userStore.$patch({userId: uuidv4()})
            } else {
                console.log(reason)
            }
        });
    }
    const {userId} = storeToRefs(userStore);
    return userId;
}


export async function fetchTastingSessionAndSaveToLocalStorage(sessionCode: string): Promise<TastingSession> {
    return fetchTastingSession(sessionCode).then(sessionObject => {
        setTastingSessionToPreferences(sessionObject).then(r => console.log("tasting session was set to storage"));
        const tastingSessionStore = useTastingSessionStore();
        tastingSessionStore.$reset();
        tastingSessionStore.$patch({
            tastingSession: sessionObject,
            sessionKey: sessionCode,
        });
        return sessionObject
    }).catch((err) => {
        return err;
    })
}

export function extractTastingItemNamesFromObject(session: TastingSession): string[] {
    if (session) {
        let tastingItemNames: any = [];
        const itemsObject = JSON.parse(JSON.stringify(session.tastingItems));
        tastingItemNames = Object.entries(itemsObject).map((item: any) => {
            return item[1]
        }).sort((a: any, b: any) => {
            return a.index - b.index
        })
        return tastingItemNames.map((item: any) => {
            return item.tastingItemName
        })
    } else {
        return []
    }
}


export function saveItemRatingToStore(itemName: string, categoryName: string, rating: TasteRating) {
    const tastedItemStore = useTastedItemsStore();

    const storedItem = tastedItemStore.items.get(itemName);
    const items: TasteRating[] = storedItem ? storedItem : [] as TasteRating[];
    items.push(rating)
    tastedItemStore.$patch({
        items: tastedItemStore.items.set(itemName, items)
    })
}

export function getRatingMapForItemFromStore(itemName: string): Map<string, TasteRating> {
    const userStore = useUserStore();
    const tastingSessionStore = useTastingSessionStore();
    const session = tastingSessionStore.tastingSession;
    const items = JSON.parse(JSON.stringify(session.tastingItems));
    const categories = JSON.parse(JSON.stringify(session.config.categories));
    const itemRatings = items[itemName].ratings[userStore.userId];
    const itemRatingsMap = new Map<string, TasteRating>();

    categories.forEach((category: string) => {
        if (itemRatings && itemRatings[category]) {
            itemRatingsMap.set(category, itemRatings[category]);
        } else {
            itemRatingsMap.set(category, {
                category: category,
                rating: 0,
                ratedBy: '',
            });
        }
    });
    return itemRatingsMap;
}


export function tasteRatingExistsFor(tastingItemName: string, tastingCategoryName: string) {
    const tastingItem = getRatingMapForItemFromStore(tastingItemName);
    const category = tastingItem.get(tastingCategoryName)
    const userStore = useUserStore();

    return category?.ratedBy === userStore.userId ?? false
}


export function getTastedItemsFromStore(): Map<string, any> {
    const userStore = useUserStore();
    const tastingSessionStore = useTastingSessionStore();

    const session = tastingSessionStore.tastingSession;

    console.log("loading session" + JSON.stringify(session))

    const items = JSON.parse(JSON.stringify(session.tastingItems));

    const tastedItemsMap = new Map<string, TasteRating>();
    Object.entries(items).forEach((item: any) => {
        const key: string = item[0];
        const value = item[1];
        const ratings = value.ratings[userStore.userId];
        if (ratings) { //if item has rating add it to tastedItemMap
            tastedItemsMap.set(key, value)
        }
    })
    return tastedItemsMap;
}


export function populateScoreStoreFromSession(sessionObject: TastingSession) {
    const scoreStore = useScoreStore();

    //TODO set userScore in scoreStore as well
    Object.entries(sessionObject.tastingItems).forEach((entry) => {
        const key = entry[0];
        const value = entry[1];

        const scoreStoreObject: any = scoreStore.participantsScores
        scoreStoreObject[key] = value.score
        scoreStore.$patch({
            participantsScores: scoreStoreObject
        });
    })
}


export function getTastingScoresFor(item: string): number[] {
    const scoreStore = useScoreStore();
    const scores: any = scoreStore.participantsScores;
    const tastingScores: number[] = [];

    if (scores) {
        const itemScores: any = scores[item];
        if (itemScores) {
            Object.entries(itemScores).forEach((entry) => {
                const key = entry[0];
                const value: any = entry[1];
                const valueEntries = Object.entries(value)
                tastingScores.push(value)
                if (key === item) {
                    tastingScores.push(valueEntries[0][1] as number)
                }
            })
        }
    }
    return tastingScores;
}

export function getTastingItemsFromStore(): TastingItem[] {
    const tastingSessionStore = useTastingSessionStore();

    const tastingItemObjects = tastingSessionStore.tastingSession.tastingItems
    const tastingItems: TastingItem[] = []

    Object.entries(tastingItemObjects).forEach((entry: any) => {
        const value: TastingItem = entry[1];
        tastingItems.push(value)
    })

    return tastingItems
}

/**
 * gets session key from store if exits. else it will try to set it from the preferences if existent
 * */
export function getSessionKey(): string {
    const tastingSessionStore = useTastingSessionStore();
    if (!tastingSessionStore) {
        getSessionKeyFromPreferences().then((preferenceSessionKey: string) => {
            setSessionKeyToStore(preferenceSessionKey)
        })
    }
    return tastingSessionStore.sessionKey;
}

export function setSessionKeyToStore(sessionKey: string) {
    const tastingSessionStore = useTastingSessionStore();
    tastingSessionStore.$patch({sessionKey: sessionKey})
}

/**
 * adds new tasting items to the store and firebase
 * */
export function updateTastingItems(tastingItemUpdates: UpdateActionItem[]) {
    const tastingItems = getTastingItemsFromStore();
    const tastingItemMap: Map<string, TastingItem> = new Map(tastingItems.map(tastingItem => [tastingItem.tastingItemName, tastingItem]));

    tastingItemUpdates.forEach((item: UpdateActionItem) => {
        switch (item.action) {
            case Action.Create:
                tastingItemMap.set(item.itemName, {
                    tastingItemName: item.itemName,
                    index: item.index,
                    ratings: [],
                });
                break;
            case Action.Rename: { //renaming is essentially creating a new entry and deleting the old one
                const itemToUpdate = tastingItemMap.get(item.itemName);
                if (itemToUpdate && itemToUpdate.tastingItemName && item.newName) {
                    itemToUpdate.tastingItemName = item.newName;
                    tastingItemMap.delete(item.itemName);
                    tastingItemMap.set(item.newName, itemToUpdate);
                } else {
                    console.warn("something went wrong while renaming for ", item.itemName)
                }
                break;
            }
            case Action.UpdateIndex: {
                const itemToUpdate = tastingItemMap.get(item.itemName);
                if (itemToUpdate && itemToUpdate.tastingItemName && item.newIndex != null) {
                    itemToUpdate.index = item.newIndex;
                    tastingItemMap.set(item.itemName, itemToUpdate);
                } else {
                    console.warn("something went wrong while updating index for ", item.itemName)
                }
                break;
            }
            case Action.Delete:
                tastingItemMap.delete(item.itemName);
                break;
            default:
                console.warn("something went wrong while performing item update for ", item.itemName)
                break;
        }
    })
    return writeTastingItemsToFirestore(tastingItemMap, getSessionKey());
}


export function submitRatingFromStoreToFirestore(tastingItemName: string) {
    const tastedItemStore = useTastedItemsStore();

    const itemMap = tastedItemStore.items;
    const tasteRatings: TasteRating[] | undefined = itemMap.get(tastingItemName)

    if (tasteRatings) {
        const tasteRatingArray: TasteRating[] = tasteRatings;
        const userStore = useUserStore();
        const tastingSessionStore = useTastingSessionStore(); //update session store

        const tastingSession: any = tastingSessionStore.tastingSession;

        const ratingsObject: any = {}
        tasteRatings.forEach((rating: TasteRating) => {
            ratingsObject[rating.category] = {
                category: rating.category,
                rating: rating.rating,
                ratedBy: rating.ratedBy,
            };
        })
        // I hate myself for doing this. at least I got it to work with this dirty hack
        let ratings = tastingSession.tastingItems[tastingItemName].ratings //returns []
        if (ratings.length == 0){
            ratings = {}
        }
        ratings[userStore.userId] = ratingsObject;
        tastingSession.tastingItems[tastingItemName].ratings = ratings
        tastingSessionStore.$patch({tastingSession: tastingSession})


        return writeTasteRatingsToFirestore(tasteRatingArray, tastingItemName, getSessionKey(), userStore.userId);
    } else {
        return new Promise((resolve, reject) => {
            reject('no items submitted')
        })
    }
}


export function submitScoreToLocalAndFirestore(tastingItemName: string, score: number) {
    const userStore = useUserStore();
    const scoreStore = useScoreStore();

    const userId: string = userStore.userId;
    const participantsScores: any = scoreStore.participantsScores;

    if (!participantsScores[tastingItemName]) {
        participantsScores[tastingItemName] = {}
    }
    participantsScores[tastingItemName][userId] = score

    const userScore: any = scoreStore.userScore;
    userScore[tastingItemName] = score;

    scoreStore.$patch({
        participantsScores,
        userScore,
    });

    return writeScoreToFirestore(score, tastingItemName, getSessionKey(), userStore.userId)
}

export function getConsolidatedRatings(itemName: string) {
    const consolidatedRatings: any = {};
    const tastingSessionStore = useTastingSessionStore();
    const items: any = tastingSessionStore.tastingSession.tastingItems
    const ratings = items[itemName].ratings
    const categories = tastingSessionStore.tastingSession.config.categories;

    categories.forEach((categoryName) => {
        consolidatedRatings[categoryName] = [];
        Object.entries(ratings).forEach((item) => {
            const categories: any = item[1];
            const category = categories[categoryName]
            if (category) {
                const categoryRatingsArray: any[] = consolidatedRatings[categoryName];
                categoryRatingsArray.push(category.rating)
                consolidatedRatings[categoryName] = categoryRatingsArray
            }
        })
    })
    return consolidatedRatings;
}

export function getUserScoreFromStoreForItem(item: string): number {
    const scoreStore = useScoreStore();
    const userStore = useUserStore();

    const userId: string = userStore.userId;
    const participantsScores: any = scoreStore.participantsScores;

    const userScore: number | undefined = participantsScores[item]?.[userId];
    return userScore ? userScore : 0;
}


export function calculateMedian(numbers: number[]): number {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        const median = (sorted[middle - 1] + sorted[middle]) / 2;
        return median ? median : 0;
    }
    return sorted[middle];
}

export function calculateAverage(numbers: number[]): number {
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length) || 0;
}