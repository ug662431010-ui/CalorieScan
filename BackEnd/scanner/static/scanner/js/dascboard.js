// ===============================
// CURRENT USER
// ===============================

const currentUserEmail =
    localStorage.getItem(
        "calorieScanUserEmail"
    ) || "guest";


// ===============================
// USER-SPECIFIC MEALS
// ===============================

const mealStorageKey =
    "calorieScanMeals_" +
    currentUserEmail;


// ===============================
// GET MEALS
// ===============================

let meals =
    JSON.parse(
        localStorage.getItem(
            mealStorageKey
        )
    ) || [];


// ===============================
// SAVE MEALS
// ===============================

function saveMeals() {

    localStorage.setItem(
        mealStorageKey,
        JSON.stringify(meals)
    );

}


// ===============================
// GET DAILY CALORIE GOAL
// ===============================

function getDailyGoal() {

    const currentUserEmail =
        localStorage.getItem(
            "calorieScanUserEmail"
        ) || "guest";


    const calorieGoalStorageKey =
        "dailyCalorieGoal_" +
        currentUserEmail;


    const savedGoal =
        localStorage.getItem(
            calorieGoalStorageKey
        );


    return Number(savedGoal) || 2000;

}


// ===============================
// LOAD PROFILE DATA
// ===============================

function loadProfileData() {

    const currentUserEmail =
        localStorage.getItem(
            "calorieScanUserEmail"
        ) || "guest";


    const profileStorageKey =
        "calorieProfile_" +
        currentUserEmail;


    const userNameStorageKey =
        "calorieScanUserName_" +
        currentUserEmail;


    const profile =
        JSON.parse(
            localStorage.getItem(
                profileStorageKey
            )
        ) || {};


    const userName =
        document.getElementById(
            "userName"
        );


    const dailyGoal =
        document.getElementById(
            "dailyGoal"
        );


    // ===============================
    // USER NAME
    // ===============================

    const savedUserName =
        localStorage.getItem(
            userNameStorageKey
        );


    if (
        userName &&
        savedUserName
    ) {

        userName.textContent =
            savedUserName;

    }

    else if (
        userName &&
        profile.fullName
    ) {

        userName.textContent =
            profile.fullName;

    }


    // ===============================
    // DAILY CALORIE GOAL
    // ===============================

    const goal =
        getDailyGoal();


    if (dailyGoal) {

        dailyGoal.textContent =
            goal;

    }

}


// ===============================
// GET TODAY'S MEALS
// ===============================

function getTodayMeals() {

    const today =
        new Date();


    return meals.filter(
        meal => {

            if (!meal.date) {
                return false;
            }


            const mealDate =
                new Date(
                    meal.date
                );


            return (

                mealDate.getFullYear() ===
                today.getFullYear()

                &&

                mealDate.getMonth() ===
                today.getMonth()

                &&

                mealDate.getDate() ===
                today.getDate()

            );

        }
    );

}


// ===============================
// DISPLAY MEALS
// ===============================

function displayMeals() {

    const tableBody =
        document.getElementById(
            "mealTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML =
        "";


    meals
        .slice()
        .reverse()
        .forEach(
            (meal, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const realIndex =
                    meals.length -
                    1 -
                    index;


                let formattedDate =
                    "-";


                if (meal.date) {

                    formattedDate =
                        new Date(
                            meal.date
                        ).toLocaleDateString(
                            "en-US",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );

                }


                let formattedTime =
                    meal.time || "-";


                row.innerHTML = `

                    <td>
                        ${
                            meal.foodName ||
                            meal.food ||
                            "Unknown Food"
                        }
                    </td>


                    <td>
                        ${
                            Number(
                                meal.calories
                            ) || 0
                        } kcal
                    </td>


                    <td>
                        ${
                            meal.meal ||
                            "Meal"
                        }
                    </td>


                    <td>
                        ${formattedDate}
                    </td>


                    <td>
                        ${formattedTime}
                    </td>


                    <td>

                        <button
                            type="button"
                            onclick="deleteMeal(${realIndex})"
                            style="
                                background:red;
                                color:white;
                                padding:8px 12px;
                                border:none;
                                border-radius:8px;
                                cursor:pointer;
                            "
                        >
                            DELETE
                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );


    updateCalories();

}


// ===============================
// DELETE MEAL
// ===============================

function deleteMeal(index) {

    const confirmDelete =
        confirm(
            "Do you want to delete this meal?"
        );


    if (!confirmDelete) {
        return;
    }


    meals.splice(
        index,
        1
    );


    saveMeals();


    displayMeals();


    updateMealChart();


    updateWeeklyChart();

}


// ===============================
// TODAY'S CALORIES
// ===============================

function updateCalories() {

    let total =
        0;


    // ONLY TODAY
    const todayMeals =
        getTodayMeals();


    todayMeals.forEach(
        meal => {

            total +=
                Number(
                    meal.calories
                ) || 0;

        }
    );


    // Goal
    const goal =
        getDailyGoal();


    const totalCalories =
        document.getElementById(
            "totalCalories"
        );


    const remainingCalories =
        document.getElementById(
            "remainingCalories"
        );


    const progress =
        document.getElementById(
            "calorieProgress"
        );


    const dailyGoal =
        document.getElementById(
            "dailyGoal"
        );


    // Total Calories
    if (totalCalories) {

        totalCalories.textContent =
            total;

    }


    // Daily Goal
    if (dailyGoal) {

        dailyGoal.textContent =
            goal;

    }


    // Remaining
    if (remainingCalories) {

        remainingCalories.textContent =
            Math.max(
                goal - total,
                0
            ) +
            " kcal Remaining";

    }


    // Progress
    if (progress) {

        const percentage =
            goal > 0
                ? Math.min(
                    (total / goal) * 100,
                    100
                )
                : 0;


        progress.style.width =
            percentage + "%";

    }

}


// ===============================
// MEAL CHART
// ===============================

let mealChart;


function updateMealChart() {

    const canvas =
        document.getElementById(
            "mealChart"
        );


    if (!canvas) {
        return;
    }


    const breakfast =
        getMealCalories(
            "Breakfast"
        );


    const lunch =
        getMealCalories(
            "Lunch"
        );


    const dinner =
        getMealCalories(
            "Dinner"
        );


    const snack =
        getMealCalories(
            "Snack"
        );


    if (mealChart) {

        mealChart.destroy();

    }


    mealChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels: [

                        "Breakfast",
                        "Lunch",
                        "Dinner",
                        "Snack"

                    ],


                    datasets: [{

                        data: [

                            breakfast,
                            lunch,
                            dinner,
                            snack

                        ]

                    }]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position:
                                "right"

                        }

                    }

                }

            }
        );

}


// ===============================
// GET CALORIES BY MEAL
// ===============================

function getMealCalories(
    mealType
) {

    return getTodayMeals()

        .filter(
            meal =>
                meal.meal ===
                mealType
        )

        .reduce(
            (
                total,
                meal
            ) => {

                return (
                    total +
                    (
                        Number(
                            meal.calories
                        ) || 0
                    )
                );

            },
            0
        );

}


// ===============================
// WEEKLY CHART
// ===============================

let weeklyChart;


function updateWeeklyChart() {

    const canvas =
        document.getElementById(
            "weeklyChart"
        );


    if (!canvas) {
        return;
    }


    if (weeklyChart) {

        weeklyChart.destroy();

    }


    const scanMeals =
        JSON.parse(
            localStorage.getItem(
                mealStorageKey
            )
        ) || [];


    const today =
        new Date();


    const labels =
        [];


    const weeklyCalories =
        [];


    // ===============================
    // LAST 7 DAYS
    // ===============================

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(
                today
            );


        date.setDate(
            today.getDate() -
            i
        );


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday:
                        "short"
                }
            );


        labels.push(
            dayName
        );


        const dailyTotal =
            scanMeals

                .filter(
                    meal => {

                        if (!meal.date) {
                            return false;
                        }


                        const mealDate =
                            new Date(
                                meal.date
                            );


                        return (

                            mealDate.getFullYear() ===
                            date.getFullYear()

                            &&

                            mealDate.getMonth() ===
                            date.getMonth()

                            &&

                            mealDate.getDate() ===
                            date.getDate()

                        );

                    }
                )

                .reduce(
                    (
                        total,
                        meal
                    ) => {

                        return (
                            total +
                            (
                                Number(
                                    meal.calories
                                ) || 0
                            )
                        );

                    },
                    0
                );


        weeklyCalories.push(
            dailyTotal
        );

    }


    // ===============================
    // CREATE CHART
    // ===============================

    weeklyChart =
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


// ===============================
// TODAY DATE
// ===============================

function showDate() {

    const dateElement =
        document.getElementById(
            "todayDate"
        );


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

}


// ===============================
// START DASHBOARD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfileData();

        showDate();

        displayMeals();

        updateCalories();

        updateMealChart();

        updateWeeklyChart();

    }
);

// ===============================
// FOOD RECOMMENDATION
// ===============================

const recommendedFoods = [

    {
        name: "ข้าวกะเพราไก่",
        calories: 550,
        icon: "🍗"
    },

    {
        name: "ข้าวผัดไก่",
        calories: 520,
        icon: "🍚"
    },

    {
        name: "ก๋วยเตี๋ยวไก่",
        calories: 450,
        icon: "🍜"
    },

    {
        name: "ข้าวมันไก่",
        calories: 550,
        icon: "🍗"
    },

    {
        name: "สลัดอกไก่",
        calories: 380,
        icon: "🥗"
    },

    {
        name: "ข้าวต้มไก่",
        calories: 350,
        icon: "🍲"
    },

    {
        name: "ข้าวไข่เจียว",
        calories: 480,
        icon: "🍳"
    },

    {
        name: "ผัดซีอิ๊วไก่",
        calories: 600,
        icon: "🍜"
    },

    {
        name: "ยำวุ้นเส้น",
        calories: 300,
        icon: "🥗"
    }

];


// ===============================
// GET REMAINING CALORIES
// ===============================

function getRemainingCalories() {

    const goal =
        getDailyGoal();


    const todayMeals =
        getTodayMeals();


    const todayCalories =
        todayMeals.reduce(
            (
                total,
                meal
            ) => {

                return (
                    total +
                    (
                        Number(
                            meal.calories
                        ) || 0
                    )
                );

            },
            0
        );


    return Math.max(
        goal - todayCalories,
        0
    );

}


// ===============================
// DISPLAY FOOD RECOMMENDATIONS
// ===============================

function displayFoodRecommendations() {

    const list =
        document.getElementById(
            "foodRecommendationList"
        );


    const remainingElement =
        document.getElementById(
            "foodRemainingCalories"
        );


    if (!list) {
        return;
    }


    const remaining =
        getRemainingCalories();


    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }


    // ===============================
    // FIND FOODS THAT FIT
    // ===============================

    let suitableFoods =
        recommendedFoods.filter(
            food =>
                food.calories <= remaining
        );


    // ===============================
    // IF NOTHING FITS
    // ===============================

    if (
        suitableFoods.length === 0
    ) {

        list.innerHTML = `

            <div class="no-food-recommendation">

                😅 ตอนนี้เหลือ
                <strong>
                    ${remaining} kcal
                </strong>
                เท่านั้น

                <br>

                ลองเลือกอาหารมื้อเล็ก ๆ
                หรือรอวันใหม่ได้เลย 💜

            </div>

        `;

        return;

    }


    // ===============================
    // RANDOM 3 FOODS
    // ===============================

    suitableFoods =
        suitableFoods
            .sort(
                () =>
                    Math.random() - 0.5
            )
            .slice(
                0,
                3
            );


    list.innerHTML =
        "";


    suitableFoods.forEach(
        food => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "food-recommendation-item";


            item.innerHTML = `

                <div class="food-icon">
                    ${food.icon}
                </div>

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.calories} kcal
                </p>

            `;


            list.appendChild(
                item
            );

        }
    );

}


// ===============================
// RANDOM FOOD BUTTON
// ===============================

function randomizeFoodRecommendations() {

    displayFoodRecommendations();

}


// ===============================
// START FOOD RECOMMENDATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayFoodRecommendations();


        const randomFoodBtn =
            document.getElementById(
                "randomFoodBtn"
            );


        if (randomFoodBtn) {

            randomFoodBtn.addEventListener(
                "click",
                randomizeFoodRecommendations
            );

        }

    }
);