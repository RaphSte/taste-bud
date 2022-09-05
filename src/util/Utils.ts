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
    const tastedItems = getTastedItemsFromStore(); //get tastingItem map
    const itemRatingsMap = getRatingMapForItemFromStore(itemName)
    itemRatingsMap.set(categoryName, rating); //set rating for category
    tastedItems.set(itemName, JSON.stringify(Array.from(itemRatingsMap.entries()))); //serialize back
    saveTastedItemsToStore(tastedItems);
}

export function getRatingMapForItemFromStore(itemName: string): Map<string, TasteRating> {
    const tastingItems = getTastedItemsFromStore(); //get tastingItem map
    const itemRatings = tastingItems.get(itemName); //get nested item map
    return itemRatings ? new Map(JSON.parse(itemRatings)) : new Map<string, TasteRating>(); //parse it to map if exits
}

export function tasteRatingExistsFor(tastingItemName: string, tastingCategoryName: string) {
    const tastingItem = getRatingMapForItemFromStore(tastingItemName);
    return tastingItem.has(tastingCategoryName);
}

export function saveTastedItemsToStore(map: Map<string, any>) {
    const tastedItemsStore = useTastedItemsStore();
    tastedItemsStore.$patch({items: JSON.stringify(Array.from(map.entries()))});
}

export function getTastedItemsFromStore(): Map<string, any> {
    const tastedItemsStore = useTastedItemsStore();
    return tastedItemsStore.items ? new Map(JSON.parse(tastedItemsStore.items)) : new Map<string, any>();
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
    const tastedItemMap = getTastedItemsFromStore();
    const nestedArray = Array.from(JSON.parse(tastedItemMap.get(tastingItemName)));
    const tasteRatings: TasteRating[] = nestedArray.map((value: any) => value[1]);

    const userStore = useUserStore();

    return writeTasteRatingsToFirestore(tasteRatings, tastingItemName, getSessionKey(), userStore.userId);
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