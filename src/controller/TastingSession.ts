// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {addDoc, collection, doc, getDoc, getFirestore, updateDoc} from 'firebase/firestore/lite';
import {
    TasteRating,
    TastingItem,
    TastingSession,
    TastingSessionConfiguration
} from "@/types/TastingSessionConfiguration";

const ROOT_COLLECTION_NAME = 'tasting-sessions';
const TASTING_ITEMS_FIELD_NAME = 'tastingItems';
const TASTE_RATINGS_FIELD_NAME = 'ratings';
const TASTING_SCORES_FIELD_NAME = 'score';

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


export async function writeTastingItemsToFirestore(tastingItems: Map<string, TastingItem>, tastingSessionKey: string) {
    const tastingSessionDoc = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey);
    const tastingItemMapObject: any = {};

    tastingItems.forEach((entry) => {
        tastingItemMapObject[entry.tastingItemName] = entry;
    });

    return updateDoc(tastingSessionDoc, {tastingItems: tastingItemMapObject})
}

export async function writeTasteRatingsToFirestore(ratings: TasteRating[], itemName: string, tastingSessionKey: string, userId: string) {
    const tastingSessionDoc = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey);

    const ratingsObject: any = {};
    ratings.forEach((rating: TasteRating) => {
        ratingsObject[rating.category] = rating;
    });

    return updateDoc(tastingSessionDoc, {
        [TASTING_ITEMS_FIELD_NAME + '.' + itemName + '.' + TASTE_RATINGS_FIELD_NAME + '.' + userId]: ratingsObject
    });

}


export async function writeScoreToFirestore(score: number, itemName: string, tastingSessionKey: string, userId: string) {
    const tastingSessionDoc = doc(db, ROOT_COLLECTION_NAME, tastingSessionKey);
    return updateDoc(tastingSessionDoc, {
        [TASTING_ITEMS_FIELD_NAME + '.' + itemName + '.' + TASTING_SCORES_FIELD_NAME + '.' + userId]: score
    });
}
