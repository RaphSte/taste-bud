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
    writeTasteRatingsToFirestore,
    writeTastingItemsToFirestore
} from "@/controller/TastingSession";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {useTastedItemsStore} from "@/store/tastedItemsStore";
import {useUserStore} from "@/store/userStore";
import {storeToRefs} from "pinia";
import {Ref} from "vue";
import tastingItemSelection from "@/views/TastingItemSelection.vue";


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
    return userId
}


export async function fetchTastingSessionAndSaveToLocalStorage(sessionCode: string): Promise<TastingSession> {
    return fetchTastingSession(sessionCode).then(sessionObject => {
        setTastingSessionToPreferences(sessionObject).then(r => console.log("tasting session was set to storage"));
        const tastingSessionStore = useTastingSessionStore();
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


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const items: TasteRating[] = tastedItemStore.items.get(itemName) ? tastedItemStore.items.get(itemName) : [] as TasteRating[];


    items.push(rating)

    tastedItemStore.$patch({
        items: tastedItemStore.items.set(itemName, items)
    })
    // const tastedItemsStore = useTastedItemsStore();
    // tastedItemsStore.$patch({items: JSON.stringify(Array.from(tastedItems.entries()))});
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
    const items = JSON.parse(JSON.stringify(session.tastingItems));

    const tastedItemsMap = new Map<string, TasteRating>();
    Object.entries(items).forEach((item: any) => {
        const ratings = item[1].ratings[userStore.userId];
        if (ratings) {
            tastedItemsMap.set(item[0], ratings)
        }
    })
    console.log("tastedItemsMap", items)
    return tastedItemsMap;
}

export function getTastingItemsFromStore(): TastingItem[] {
    const tastingSessionStore = useTastingSessionStore();
    return tastingSessionStore.tastingSession.tastingItems
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
export function updateTastingItems(tastingItemNames: string[]) {

    const tastingItemMap = getTastedItemsFromStore();

    tastingItemNames.forEach((itemName, index) => {
        if (!tastingItemMap.has(itemName)) {
            //tastingItemMap.set(itemName, JSON.stringify(Array.from(new Map<string, TastingItem>)))
            tastingItemMap.set(itemName, {
                tastingItemName: itemName,
                index: index,
                ratings: {},
            });
        } else {
            const item: TastingItem = JSON.parse(tastingItemMap.get(itemName));
            item.index = index;
            tastingItemMap.set(itemName, item)
        }
    });
    const tastingItems: TastingItem[] = convertTastingItemMapToArray(tastingItemMap);
    writeTastingItemsToFirestore(tastingItems, getSessionKey());
}


export function submitRatingFromStoreToFirestore(tastingItemName: string) {
    const tastedItemStore = useTastedItemsStore();

    const itemMap = tastedItemStore.items;
    const tasteRatings: TasteRating[] | undefined = itemMap.get(tastingItemName)

    if (tasteRatings) {
        const tasteRatingArray: TasteRating[] = tasteRatings;
        const userStore = useUserStore();


        //update session store
        const tastingSessionStore = useTastingSessionStore();

        const tastingSession: any = tastingSessionStore.tastingSession;

        const ratingsObject: any = {}
        tasteRatings.forEach((rating) => {
            ratingsObject[rating.category] = {
                category: rating.category,
                rating: rating.rating,
                ratedBy: rating.ratedBy,
            };
        })
        tastingSession.tastingItems[tastingItemName].ratings[userStore.userId] = ratingsObject;
        tastingSessionStore.$patch({tastingSession: tastingSession})
        console.log("ratingsObject", ratingsObject)
        console.log("tastingSession", tastingSessionStore.tastingSession)


        return writeTasteRatingsToFirestore(tasteRatingArray, tastingItemName, getSessionKey(), userStore.userId);
    } else {
        return new Promise((resolve, reject) => {
            reject('no items submitted')
        })
    }
}


function convertTastingItemMapToArray(tastingItemMap: Map<string, TastingItem>): TastingItem[] {
    const arr = Array.from(tastingItemMap, ([name, value]) => ({
        tastingItemName: name,
        index: 0,
        ratings: value.ratings,
    }));
    arr.forEach((item, index) => {
        item.index = index;
    });
    return arr;
}


// function extractRatingsFromValue(value: any): TasteRating[] {
//     console.log("arr", value);
//     const arr = JSON.parse(value);
//     return arr.map((value: any) => value[1]);
// }


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


export function calculateMedian(numbers: number[]): number {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

export function calculateAverage(numbers: number[]): number {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = (sum / numbers.length) || 0;
    return avg;
}