import {Preferences} from "@capacitor/preferences";

const TASTING_SESSION_KEY = "tasting_session_key"

// JSON "set" example
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
    console.log(ret.value)
    return new Promise((resolve, reject) => {
        if (ret.value) {
            resolve(ret.value)
        } else {
            reject("No session found")
        }
    })
}



getSessionKeyFromPreferences().then((key) => {
    console.log("session key is: ", key)
}).catch((err) => {
    console.log(err)
})