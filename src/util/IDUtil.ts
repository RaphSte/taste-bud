import {v4 as uuidv4} from 'uuid';
import {getUserIdFromPreferences, setUserIdToPreferences} from "@/controller/LocalStorage";


export async function createUserIdAndSaveToLocalStorage(): Promise<string> {
    await setUserIdToPreferences(uuidv4())
    return getUserIdFromPreferences() //to make sure the id was set
}