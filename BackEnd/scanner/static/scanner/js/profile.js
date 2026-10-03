// =========================================
// CalorieScan Profile
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // CURRENT USER
    // =========================================

    const currentUserEmail =
        localStorage.getItem("calorieScanUserEmail") || "guest";

    const profileStorageKey =
        "calorieProfile_" + currentUserEmail;

    const userNameStorageKey =
        "calorieScanUserName_" + currentUserEmail;

    const calorieGoalStorageKey =
        "dailyCalorieGoal_" + currentUserEmail;


    // =========================================
    // GET ELEMENTS
    // =========================================

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const age =
        document.getElementById("age");

    const gender =
        document.getElementById("gender");

    const weight =
        document.getElementById("weight");

    const height =
        document.getElementById("height");

    const calorieGoal =
        document.getElementById("calorieGoal");

    const displayName =
        document.getElementById("displayName");

    const calculateButton =
        document.getElementById("calculateCalories");

    const calculateMessage =
        document.getElementById("calculateMessage");

    const saveButton =
        document.getElementById("saveProfile");

    const saveMessage =
        document.getElementById("saveMessage");


    // =========================================
    // LOAD SAVED PROFILE
    // =========================================

    const savedProfile =
        JSON.parse(
            localStorage.getItem(profileStorageKey)
        ) || {};


    if (savedProfile.fullName) {
        fullName.value = savedProfile.fullName;
        displayName.textContent = savedProfile.fullName;
    }

    if (savedProfile.email) {
        email.value = savedProfile.email;
    }

    if (savedProfile.age) {
        age.value = savedProfile.age;
    }

    if (savedProfile.gender) {
        gender.value = savedProfile.gender;
    }

    if (savedProfile.weight) {
        weight.value = savedProfile.weight;
    }

    if (savedProfile.height) {
        height.value = savedProfile.height;
    }


    // =========================================
    // LOAD DAILY CALORIE GOAL
    // =========================================

    const savedGoal =
        localStorage.getItem(calorieGoalStorageKey);

    if (savedGoal) {
        calorieGoal.value = savedGoal;
    }
    else if (savedProfile.calorieGoal) {
        calorieGoal.value =
            savedProfile.calorieGoal;
    }


    // =========================================
    // CALCULATE BMR
    // =========================================

    function calculateBMR() {

        const userAge =
            Number(age.value);

        const userWeight =
            Number(weight.value);

        const userHeight =
            Number(height.value);

        const userGender =
            gender.value;


        if (
            !userAge ||
            !userWeight ||
            !userHeight ||
            !userGender
        ) {
            return null;
        }


        let bmr;


        if (userGender === "female") {

            bmr =
                (10 * userWeight) +
                (6.25 * userHeight) -
                (5 * userAge) -
                161;

        }
        else {

            bmr =
                (10 * userWeight) +
                (6.25 * userHeight) -
                (5 * userAge) +
                5;

        }


        return bmr;
    }


    // =========================================
    // CALCULATE DAILY CALORIES
    // =========================================

    function calculateDailyCalories() {

        const bmr =
            calculateBMR();

        if (!bmr) {
            return null;
        }


        // Lightly active
        const activityFactor = 1.375;


        const calories =
            bmr * activityFactor;


        return Math.round(calories);
    }


    // =========================================
    // CALCULATE BUTTON
    // =========================================

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            function () {

                const calories =
                    calculateDailyCalories();


                if (!calories) {

                    if (calculateMessage) {
                        calculateMessage.textContent =
                            "⚠️ Please enter age, gender, weight and height.";
                    }

                    return;
                }


                calorieGoal.value =
                    calories;


                if (calculateMessage) {
                    calculateMessage.textContent =
                        "🔥 Recommended calorie goal calculated!";
                }


                setTimeout(function () {

                    if (calculateMessage) {
                        calculateMessage.textContent = "";
                    }

                }, 3000);

            }
        );

    }


    // =========================================
    // AUTO CALCULATE
    // =========================================

    function autoCalculate() {

        const calories =
            calculateDailyCalories();

        if (calories) {
            calorieGoal.value =
                calories;
        }
    }


    age.addEventListener("input", autoCalculate);
    weight.addEventListener("input", autoCalculate);
    height.addEventListener("input", autoCalculate);
    gender.addEventListener("change", autoCalculate);


    // =========================================
    // SAVE PROFILE
    // =========================================

    saveButton.addEventListener(
        "click",
        function () {

            // =====================================
            // CHECK INFORMATION
            // =====================================

            if (
                !fullName.value ||
                !age.value ||
                !gender.value ||
                !weight.value ||
                !height.value
            ) {

                saveMessage.textContent =
                    "⚠️ Please complete your information.";

                return;
            }


            // =====================================
            // USE CURRENT CALORIE GOAL
            // =====================================

            const currentGoal =
                Number(calorieGoal.value);


            if (!currentGoal || currentGoal <= 0) {

                saveMessage.textContent =
                    "⚠️ Please enter a valid calorie goal.";

                return;
            }


            // =====================================
            // CREATE PROFILE
            // =====================================

            const profile = {

                fullName:
                    fullName.value.trim(),

                email:
                    email.value.trim(),

                age:
                    Number(age.value),

                gender:
                    gender.value,

                weight:
                    Number(weight.value),

                height:
                    Number(height.value),

                calorieGoal:
                    currentGoal
            };


            // =====================================
            // SAVE PROFILE
            // =====================================

            localStorage.setItem(
                profileStorageKey,
                JSON.stringify(profile)
            );


            // =====================================
            // SAVE USER NAME
            // =====================================

            localStorage.setItem(
                userNameStorageKey,
                fullName.value.trim()
            );


            // =====================================
            // SAVE DAILY GOAL
            // =====================================

            localStorage.setItem(
                calorieGoalStorageKey,
                currentGoal
            );


            // =====================================
            // UPDATE DISPLAY NAME
            // =====================================

            displayName.textContent =
                fullName.value.trim();


            // =====================================
            // SUCCESS MESSAGE
            // =====================================

            saveMessage.textContent =
                "✅ Profile saved successfully!";


            console.log(
                "✅ Profile saved:",
                profile
            );

            console.log(
                "🔥 Daily Calorie Goal:",
                currentGoal,
                "kcal"
            );


            setTimeout(function () {

                saveMessage.textContent = "";

            }, 3000);

        }
    );

});