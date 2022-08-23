// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore, collection, doc, getDoc, addDoc, deleteDoc, setDoc} from 'firebase/firestore/lite';
import {TastingSessionConfiguration} from "@/types/TastingSessionConfiguration";

const ROOT_COLLECTION_NAME = 'tasting-sessions';
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


export async function createTastingSession(tastingSessionConfig: TastingSessionConfiguration) {
    const tastingSessionsCollection = collection(db, ROOT_COLLECTION_NAME);
    const sessionDocRef = await addDoc(tastingSessionsCollection, tastingSessionConfig)
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