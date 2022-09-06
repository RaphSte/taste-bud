// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore, collection, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc} from 'firebase/firestore/lite';
import {
    TasteRating,
    TastingItem,
    TastingSession,
    TastingSessionConfiguration
} from "@/types/TastingSessionConfiguration";
import {skipHydrate} from "pinia";

const ROOT_COLLECTION_NAME = 'tasting-sessions';
const TASTING_ITEM_COLLECTION_NAME = 'tasting-items';
const TASTING_ITEMS_FIELD_NAME = 'tastingItems';
const TASTE_RATINGS_FIELD_NAME = 'ratings';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6zdmObugoHeAln81mbHa7skGUmQlP1As",
    authDomain: "taste-bud-b4074.firebaseapp.com",
    projectId: "taste-bud-b4074",
    storageBucket: "taste-bud-b4074.appspot.com",
    messagingSenderId: "51655125655",
    appId: "1:51655125655:web:71550529219f3f2197d7d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export async function createTastingSessionConfig(tastingSessionConfig: TastingSessionConfiguration) {
    const tastingSession: TastingSession = {
        config: tastingSessionConfig,
        tastingItems: [],
    }
    const tastingSessionsCollection = collection(db, ROOT_COLLECTION_NAME);
    const sessionDocRef = await addDoc(tastingSessionsCollection, tastingSession)
    console.log("document added with id: " + sessionDocRef.id);
    return sessionDocRef.id;
}


export async function fetchTastingSession(documentId: string): Promise<any> {
    const tastingSessionRef = doc(db, ROOT_COLLECTION_NAME, documentId);
    const tastingSessionSnap = await getDoc(tastingSessionRef);

    return new Promise<any>((resolve, reject) => {

        if (tastingSessionSnap.exists()) {
            resolve(tastingSessionSnap.data());
        } else {
            reject("No such document!");
        }

    })
}


export async function writeTastingItemsToFirestore(tastingItems: TastingItem[], tastingSessionKey: string) {
    const tastingSessionDoc = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey);
    const tastingItemMap: any = {};
    tastingItems.forEach((item: TastingItem) => {
        tastingItemMap[item.tastingItemName] = item;
    });
    return updateDoc(tastingSessionDoc, {tastingItems: tastingItemMap})
}

// export async function writeTastingItemsToFirestore(tastingItems: TastingItem[], tastingSessionKey: string) {
//     tastingItems.forEach((item: TastingItem) => {
//         const tastingItemsCollection = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey, TASTING_ITEM_COLLECTION_NAME, item.tastingItemName);
//         setDoc(tastingItemsCollection, {'tastingItemName': item.tastingItemName}, {merge: true}).then(() => {
//             console.log(item.tastingItemName, 'was set to firestore')
//         });
//     });
// }


export async function writeTasteRatingsToFirestore(ratings: TasteRating[], itemName: string, tastingSessionKey: string, userId: string) {
    const tastingSessionDoc = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey);


    // const ratingsObject: any = {[userId]: {}};
    // ratings.forEach((rating: TasteRating) => {
    //     ratingsObject[userId][rating.category] = rating;
    // });

    const ratingsObject: any = {};
    ratings.forEach((rating: TasteRating) => {
        ratingsObject[rating.category] = rating;
    });


    //return updateDoc(tastingSessionDoc, {[TASTING_ITEMS_FIELD_NAME + '.' + itemName + '.' + TASTE_RATINGS_FIELD_NAME]: ratingsObject});

    return updateDoc(tastingSessionDoc, {
        [TASTING_ITEMS_FIELD_NAME + '.' + itemName + '.' + TASTE_RATINGS_FIELD_NAME + '.' + userId]: ratingsObject
    });

    // ratings.forEach((rating: TasteRating) => {
    //     const tasteRatingCollection = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey, TASTING_ITEM_COLLECTION_NAME, itemName, RATING_COLLECTION_NAME, rating.category);
    //     setDoc(tasteRatingCollection, rating, {merge: true}).then(() => {
    //         console.log('rating for ', rating.category, ' was set to firestore')
    //     });
    // });
}
