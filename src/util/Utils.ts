import {v4 as uuidv4} from 'uuid';
import {
    getSessionKeyFromPreferences,
    getUserIdFromPreferences,
    setTastingSessionToPreferences,
    setUserIdToPreferences
} from "@/controller/LocalStorage";
import {TasteRating, TastingItem, TastingSession} from "@/types/TastingSessionConfiguration";
import {fetchTastingSession, writeTastingItemsToFirestore} from "@/controller/TastingSession";
import {useTastingSessionStore} from "@/store/tastingSessionStore";
import {useTastedItemsStore} from "@/store/tastedItemsStore";


export async function createUserIdAndSaveToLocalStorage(): Promise<string> {
    await setUserIdToPreferences(uuidv4())
    return getUserIdFromPreferences() //to make sure the id was set
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
        return session.tastingItems.map((e: TastingItem) => {
            return e.tastingItemName
        })
    } else {
        return []
    }
}


export function saveItemRatingToStore(itemName: string, categoryName: string, rating: TasteRating) {
    const tastedItems = getTastingItemsFromStore(); //get tastingItem map
    const itemRatingsMap = getRatingMapForItemFromStore(itemName)
    itemRatingsMap.set(categoryName, rating); //set rating for category
    tastedItems.set(itemName, JSON.stringify(Array.from(itemRatingsMap.entries()))); //serialize back
    saveTastedItemsToStore(tastedItems);
}

export function getRatingMapForItemFromStore(itemName: string): Map<string, TasteRating> {
    const tastingItems = getTastingItemsFromStore(); //get tastingItem map
    const itemRatings = tastingItems.get(itemName); //get nested item map
    return itemRatings ? new Map(JSON.parse(itemRatings)) : new Map<string, TasteRating>(); //parse it to map if exits
}


export function saveTastedItemsToStore(map: Map<string, any>) {
    const tastedItemsStore = useTastedItemsStore();
    tastedItemsStore.$patch({items: JSON.stringify(Array.from(map.entries()))});
}

export function getTastingItemsFromStore(): Map<string, any> {
    const tastedItemsStore = useTastedItemsStore();
    return tastedItemsStore.items ? new Map(JSON.parse(tastedItemsStore.items)) : new Map<string, any>();
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

    const tastingItemMap = getTastingItemsFromStore();

    tastingItemNames.forEach((itemName) => {
        if (!tastingItemMap.has(itemName)) {
            tastingItemMap.set(itemName, JSON.stringify(Array.from(new Map<string, TastingItem>)))
        }
    });
    const tastingItems: TastingItem[] = convertTastingItemMapToArray(tastingItemMap);
    writeTastingItemsToFirestore(tastingItems, getSessionKey());
}


export function submitRatingFromStoreToFirestore() {
    const tastingItemMap = getTastingItemsFromStore();
    const tastingItems: TastingItem[] = convertTastingItemMapToArray(tastingItemMap);
    return writeTastingItemsToFirestore(tastingItems, getSessionKey());
}


function extractRatingsFromValue(value: any): TasteRating[] {
    const arr = JSON.parse(value);
    return arr.map((value: any) => value[1]);
}

function convertTastingItemMapToArray(tastingItemMap: Map<string, TastingItem>): TastingItem[] {
    return Array.from(tastingItemMap, ([name, value]) => ({
        tastingItemName: name,
        ratings: extractRatingsFromValue(value),
    }));
}