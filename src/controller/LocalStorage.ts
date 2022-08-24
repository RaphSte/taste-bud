import {Preferences} from "@capacitor/preferences";
import {TastingSession} from "@/types/TastingSessionConfiguration";

const TASTING_SESSION_KEY = "tasting_session_key"
const USER_ID_KEY = "user_id"
const TASTING_SESSION = "tasting_session"


export async function setSessionKeyToPreferences(tastingSessionKey: string) {
    console.log("setting", tastingSessionKey)
    await Preferences.set({
        key: TASTING_SESSION_KEY,
        value: tastingSessionKey
    }).then(() => {
        console.log("...", tastingSessionKey, "was set")
    });
}

export async function getSessionKeyFromPreferences(): Promise<string> {
    const ret = await Preferences.get({key: TASTING_SESSION_KEY});
    return new Promise((resolve, reject) => {
        if (ret.value) {
            resolve(ret.value)
        } else {
            reject("No session found")
        }
    })
}


export async function setUserIdToPreferences(userId: string) {
    await Preferences.set({
        key: USER_ID_KEY,
        value: userId
    }).then(() => {
        console.log("...", userId, "was set")
    });
}


export async function getUserIdFromPreferences(): Promise<string> {
    const ret = await Preferences.get({key: USER_ID_KEY});
    return new Promise((resolve, reject) => {
        if (ret.value) {
            resolve(ret.value)
        } else {
            reject("No uid found")
        }
    })
}

export async function setTastingSessionToPreferences(session: TastingSession) {
    const sessionString = JSON.stringify(session);
    await Preferences.set({key: TASTING_SESSION, value: sessionString})
}

export async function getTastingSessionFromPreferences(): Promise<TastingSession> {
    const ret = await Preferences.get({key: TASTING_SESSION});
    return new Promise((resolve, reject) => {
        if (ret.value) {
            resolve(JSON.parse(ret.value));
        } else {
            reject("No session found");
        }
    })

    //return newPromise<TastingSession>(ret.value, "not found");
}




//TODO refactor / make it work

// function newPromise<T>(parameter: string | null, rejectMessage: string): Promise<T> {
//     return new Promise((resolve, reject) => {
//         if (parameter) {
//             const param: any = JSON.parse(parameter);
//             if (param as T) { //TODO i have no idea if this actually works lol -> check if it does
//                 resolve(param as T)
//             }
//             reject("got unexpected type")
//         } else {
//             reject(rejectMessage)
//         }
//     })
// }