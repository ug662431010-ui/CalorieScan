// ========================================
// CalorieScan User Storage
// NEW FILE - DO NOT REMOVE OLD CODE
// ========================================


// ========================================
// GET CURRENT USER
// ========================================

function getCurrentUser() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "calorieScanCurrentUser"
            )
        );

    return user;

}


// ========================================
// GET CURRENT USER KEY
// ========================================

function getUserKey(baseKey) {

    const user =
        getCurrentUser();


    if (!user || !user.email) {

        console.warn(
            "⚠️ No current user found."
        );

        return baseKey;

    }


    return (
        baseKey +
        "_" +
        user.email.toLowerCase()
    );

}


// ========================================
// SAVE USER DATA
// ========================================

function saveUserData(
    baseKey,
    data
) {

    const key =
        getUserKey(baseKey);


    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


// ========================================
// GET USER DATA
// ========================================

function getUserData(
    baseKey,
    defaultValue
) {

    const key =
        getUserKey(baseKey);


    const data =
        localStorage.getItem(key);


    if (!data) {

        return defaultValue;

    }


    try {

        return JSON.parse(data);

    }

    catch (error) {

        console.error(
            "❌ Cannot read user data:",
            error
        );

        return defaultValue;

    }

}


// ========================================
// REMOVE USER DATA
// ========================================

function removeUserData(
    baseKey
) {

    const key =
        getUserKey(baseKey);


    localStorage.removeItem(key);

}