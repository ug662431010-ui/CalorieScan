// ========================================
// CalorieScan Statistics
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ========================================
        // CURRENT USER
        // ========================================

        const currentUserEmail =
            localStorage.getItem(
                "calorieScanUserEmail"
            ) || "guest";


        // ========================================
        // USER-SPECIFIC MEALS
        // ========================================

        const mealStorageKey =
            "calorieScanMeals_" +
            currentUserEmail;


        // ========================================
        // GET MEALS
        // ========================================

        const meals =
            JSON.parse(
                localStorage.getItem(
                    mealStorageKey
                )
            ) || [];



        // ========================================
        // GET PROFILE
        // ========================================

        const profileStorageKey =
            "calorieProfile_" +
            currentUserEmail;


        const profile =
            JSON.parse(
                localStorage.getItem(
                    profileStorageKey
                )
            ) || {};



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
        // CALCULATE TOTAL CALORIES
        // ========================================

        let totalCalories = 0;


        meals.forEach(
            function (meal) {

                totalCalories +=
                    Number(
                        meal.calories
                    ) || 0;

            }
        );



        // ========================================
        // AVERAGE CALORIES
        // ========================================

        let averageCalories = 0;


        if (meals.length > 0) {

            averageCalories =
                Math.round(
                    totalCalories /
                    meals.length
                );

        }



        // ========================================
        // DISPLAY TOTAL CALORIES
        // ========================================

        const totalCaloriesElement =
            document.getElementById(
                "totalCalories"
            );


        if (totalCaloriesElement) {

            totalCaloriesElement.textContent =
                totalCalories;

        }



        // ========================================
        // DISPLAY AVERAGE CALORIES
        // ========================================

        const averageCaloriesElement =
            document.getElementById(
                "averageCalories"
            );


        if (averageCaloriesElement) {

            averageCaloriesElement.textContent =
                averageCalories;

        }



        // ========================================
        // WEEKLY DATA
        // ========================================

        const labels = [];

        const weeklyCalories = [];


        const today =
            new Date();



        // ========================================
        // LAST 7 DAYS
        // ========================================

        for (
            let i = 6;
            i >= 0;
            i--
        ) {


            const date =
                new Date(today);


            date.setDate(
                today.getDate() - i
            );


            const label =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            labels.push(
                label
            );


            let dailyCalories = 0;



            // ========================================
            // FIND MEALS FOR THIS DAY
            // ========================================

            meals.forEach(
                function (meal) {

                    if (!meal.date) {
                        return;
                    }


                    const mealDate =
                        new Date(
                            meal.date
                        );


                    if (

                        mealDate.getFullYear() ===
                        date.getFullYear()

                        &&

                        mealDate.getMonth() ===
                        date.getMonth()

                        &&

                        mealDate.getDate() ===
                        date.getDate()

                    ) {

                        dailyCalories +=
                            Number(
                                meal.calories
                            ) || 0;

                    }

                }
            );


            weeklyCalories.push(
                dailyCalories
            );

        }



        // ========================================
        // CHART
        // ========================================

        const canvas =
            document.getElementById(
                "statisticsChart"
            );


        if (canvas) {


            new Chart(
                canvas,
                {

                    type:
                        "bar",


                    data: {

                        labels:
                            labels,


                        datasets: [{

                            label:
                                "Calories",


                            data:
                                weeklyCalories

                        }]

                    },


                    options: {

                        responsive:
                            true,


                        maintainAspectRatio:
                            false,


                        scales: {

                            y: {

                                beginAtZero:
                                    true

                            }

                        }

                    }

                }
            );

        }



        // ========================================
        // CALORIE GOAL
        // ========================================

        const calorieGoalStorageKey =
            "dailyCalorieGoal_" +
            currentUserEmail;


        const savedGoal =
            localStorage.getItem(
                calorieGoalStorageKey
            );


        const goal =
            Number(
                savedGoal
            ) ||
            Number(
                profile.calorieGoal
            ) ||
            2000;



        // ========================================
        // INSIGHT
        // ========================================

        const message =
            document.getElementById(
                "statisticsMessage"
            );


        if (
            message &&
            meals.length > 0
        ) {


            // ========================================
            // USE TODAY'S CALORIES
            // ========================================

            const today =
                new Date();


            let todayCalories = 0;


            meals.forEach(
                function (meal) {

                    if (!meal.date) {
                        return;
                    }


                    const mealDate =
                        new Date(
                            meal.date
                        );


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
            // SHOW MESSAGE
            // ========================================

            if (
                todayCalories >
                goal
            ) {

                message.textContent =
                    "You have consumed more calories than your daily goal. Try to balance your meals tomorrow.";

            }

            else {

                message.textContent =
                    "Your calorie intake is currently within your daily goal. Keep maintaining a balanced diet! 💜";

            }

        }

    }
);