import {v4 as uuidv4} from 'uuid';
import {
    getUserIdFromPreferences,
    setTastingSessionToPreferences,
    setUserIdToPreferences
} from "@/controller/LocalStorage";
import {TasteRating, TastingItem, TastingSession} from "@/types/TastingSessionConfiguration";
import {fetchTastingSession} from "@/controller/TastingSession";
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
        tastingSessionStore.$patch({tastingSession: sessionObject})

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
    const tastedItems = getTastedItemsFromStore(); //get rating map
    const itemRatings = tastedItems.get(itemName); //get nested item map
    const itemRatingsMap = itemRatings ? new Map(JSON.parse(itemRatings)) : new Map<string, TasteRating>(); //parse it to map if exits
    itemRatingsMap.set(categoryName, rating); //set rating for category
    tastedItems.set(itemName, JSON.stringify(Array.from(itemRatingsMap.entries()))); //serialize back
    saveTastedItemsToStore(tastedItems);
}


export function saveTastedItemsToStore(map: Map<string, any>) {
    const tastedItemsStore = useTastedItemsStore();
    tastedItemsStore.$patch({items: JSON.stringify(Array.from(map.entries()))});
}

export function getTastedItemsFromStore(): Map<string, any> {
    const tastedItemsStore = useTastedItemsStore();
    return tastedItemsStore.items ? new Map(JSON.parse(tastedItemsStore.items)) : new Map<string, any>();
}