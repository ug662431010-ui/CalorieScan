// ========================================
// CalorieScan Goal
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ========================================
        // CURRENT USER
        // ========================================

        const currentUserEmail =
            localStorage.getItem("calorieScanUserEmail") || "guest";


        // ========================================
        // USER-SPECIFIC STORAGE KEYS
        // ========================================

        const profileStorageKey =
            "calorieProfile_" + currentUserEmail;

        const mealStorageKey =
            "calorieScanMeals_" + currentUserEmail;

        const calorieGoalStorageKey =
            "dailyCalorieGoal_" + currentUserEmail;


        // ========================================
        // LOAD PROFILE
        // ========================================

        const profile =
            JSON.parse(
                localStorage.getItem(profileStorageKey)
            ) || {};


        // ========================================
        // LOAD MEALS
        // ========================================

        const meals =
            JSON.parse(
                localStorage.getItem(mealStorageKey)
            ) || [];


        // ========================================
        // DATE
        // ========================================

        const todayDate =
            document.getElementById(
                "todayDate"
            );


        if (todayDate) {

            todayDate.textContent =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        // ========================================
        // PROFILE VALUES
        // ========================================

        const age =
            Number(profile.age) || 0;

        const weight =
            Number(profile.weight) || 0;

        const height =
            Number(profile.height) || 0;

        const gender =
            profile.gender || "";


        // ========================================
        // DISPLAY PROFILE
        // ========================================

        const userAge =
            document.getElementById(
                "userAge"
            );

        const userWeight =
            document.getElementById(
                "userWeight"
            );

        const userHeight =
            document.getElementById(
                "userHeight"
            );


        if (userAge) {

            userAge.textContent =
                age
                    ? age + " years"
                    : "-";

        }


        if (userWeight) {

            userWeight.textContent =
                weight
                    ? weight + " kg"
                    : "-";

        }


        if (userHeight) {

            userHeight.textContent =
                height
                    ? height + " cm"
                    : "-";

        }


        // ========================================
        // CALCULATE BMR
        // ========================================

        let bmr = 0;


        if (
            age > 0 &&
            weight > 0 &&
            height > 0
        ) {

            if (gender === "male") {

                bmr =
                    (
                        10 * weight
                    ) +
                    (
                        6.25 * height
                    ) -
                    (
                        5 * age
                    ) +
                    5;

            }

            else if (
                gender === "female"
            ) {

                bmr =
                    (
                        10 * weight
                    ) +
                    (
                        6.25 * height
                    ) -
                    (
                        5 * age
                    ) -
                    161;

            }

        }


        // ========================================
        // RECOMMENDED DAILY CALORIES
        // ========================================

        let recommendedCalories =
            2000;


        if (bmr > 0) {

            recommendedCalories =
                Math.round(
                    bmr * 1.375
                );

        }


        // ========================================
        // LOAD SAVED GOAL
        // ========================================

        const savedGoal =
            Number(
                localStorage.getItem(
                    calorieGoalStorageKey
                )
            );


        let goal;


        if (
            savedGoal &&
            savedGoal > 0
        ) {

            goal = savedGoal;

        }

        else if (
            profile.calorieGoal &&
            Number(profile.calorieGoal) > 0
        ) {

            goal =
                Number(
                    profile.calorieGoal
                );

        }

        else {

            goal =
                recommendedCalories;

        }


        // ========================================
        // TODAY'S CALORIES
        // ========================================

        let todayCalories = 0;


        const today =
            new Date();


        meals.forEach(
            function (meal) {

                if (!meal.date) {
                    return;
                }


                const mealDate =
                    new Date(meal.date);


                if (

                    mealDate.getFullYear() ===
                    today.getFullYear()

                    &&

                    mealDate.getMonth() ===
                    today.getMonth()

                    &&

                    mealDate.getDate() ===
                    today.getDate()

                ) {

                    todayCalories +=
                        Number(
                            meal.calories
                        ) || 0;

                }

            }
        );


        // ========================================
        // DISPLAY GOAL
        // ========================================

        const goalCalories =
            document.getElementById(
                "goalCalories"
            );


        const todayCaloriesElement =
            document.getElementById(
                "todayCalories"
            );


        if (goalCalories) {

            goalCalories.textContent =
                goal;

        }


        if (todayCaloriesElement) {

            todayCaloriesElement.textContent =
                todayCalories;

        }


        // ========================================
        // PROGRESS
        // ========================================

        const progress =
            document.getElementById(
                "goalProgress"
            );


        let percentage = 0;


        if (goal > 0) {

            percentage =
                Math.min(
                    (
                        todayCalories /
                        goal
                    ) * 100,
                    100
                );

        }


        if (progress) {

            progress.style.width =
                percentage + "%";

        }


        // ========================================
        // MESSAGE
        // ========================================

        const goalMessage =
            document.getElementById(
                "goalMessage"
            );


        const remaining =
            Math.max(
                goal - todayCalories,
                0
            );


        if (goalMessage) {

            if (
                todayCalories > goal
            ) {

                goalMessage.textContent =
                    "You have exceeded your daily calorie goal.";

            }

            else {

                goalMessage.textContent =
                    remaining +
                    " kcal remaining";

            }

        }


        // ========================================
        // RECOMMENDATION
        // ========================================

        const recommendation =
            document.getElementById(
                "recommendation"
            );


        if (recommendation) {

            if (
                age &&
                weight &&
                height &&
                gender
            ) {

                recommendation.innerHTML = `

                    Based on your profile, your estimated
                    daily calorie requirement is approximately

                    <strong>
                        ${recommendedCalories} kcal/day
                    </strong>.

                    <br><br>

                    This is an estimate based on the
                    Mifflin-St Jeor equation and a moderate
                    activity assumption.

                    <br><br>

                    You can adjust your goal from your
                    <a href="/profile/">
                        Profile
                    </a>.

                `;

            }

            else {

                recommendation.textContent =
                    "Please complete your age, gender, weight, and height in your Profile to calculate your recommended calorie intake.";

            }

        }

    }
);