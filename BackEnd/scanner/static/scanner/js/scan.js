// ========================================
// SCAN.JS
// ========================================

console.log("🟢 scan.js loaded!");


// ========================================
// GET ELEMENTS
// ========================================

const imageInput =
    document.getElementById("imageInput");

const preview =
    document.getElementById("preview");

const scanBtn =
    document.getElementById("scanBtn");

const loading =
    document.getElementById("loading");

const debugMessage =
    document.getElementById("debugMessage");

const addMealBtn =
    document.getElementById("addMeal");

const foodNameElement =
    document.getElementById("foodName");

const caloriesElement =
    document.getElementById("calories");

const confidenceElement =
    document.getElementById("confidence");

const mealTypeElement =
    document.getElementById("mealType");


// ========================================
// TEMPORARY IMAGE FILE
// ========================================

let selectedImageFile = null;


// ========================================
// DEBUG MESSAGE
// ========================================

function showDebug(message) {

    if (debugMessage) {
        debugMessage.textContent = message;
    }

    console.log(message);
}


// ========================================
// IMAGE PREVIEW
// ========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            selectedImageFile =
                file;

            preview.src =
                URL.createObjectURL(file);

            preview.style.display =
                "block";

            showDebug(
                "📷 Image selected!"
            );

        }
    );

}


// ========================================
// SCAN FOOD
// ========================================

if (scanBtn) {

    scanBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            showDebug(
                "🔵 Scan started..."
            );


            // ========================================
            // CHECK IMAGE
            // ========================================

            if (!selectedImageFile) {

                showDebug(
                    "⚠️ Please select or capture an image first."
                );

                return;
            }


            // ========================================
            // SHOW LOADING
            // ========================================

            if (loading) {

                loading.style.display =
                    "block";

            }


            showDebug(
                "🤖 AI is analyzing..."
            );


            // ========================================
            // SEND IMAGE TO DJANGO
            // ========================================

            try {

                const formData =
                    new FormData();


                formData.append(
                    "image",
                    selectedImageFile
                );


                const response =
                    await fetch(
                        "/api/scan-food/",
                        {
                            method: "POST",
                            credentials: "include",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "🤖 Roboflow result:",
                    data
                );


                // ========================================
                // HIDE LOADING
                // ========================================

                if (loading) {

                    loading.style.display =
                        "none";

                }


                // ========================================
                // CHECK RESULT
                // ========================================

                if (!data.success) {

                    showDebug(
                        "❌ " +
                        (
                            data.message ||
                            "Food scan failed."
                        )
                    );

                    return;
                }


                // ========================================
                // GET AI RESULT
                // ========================================

                const foodName =
                    data.food_name;

                const confidence =
                    data.confidence;


                const calories =
                    data.calories;


                // ========================================
                // SHOW RESULT
                // ========================================

                if (foodNameElement) {

                    foodNameElement.textContent =
                        foodName;

                }


                if (caloriesElement) {

                    caloriesElement.textContent =
                        calories + " kcal";

                }


                if (confidenceElement) {

                    confidenceElement.textContent =
                        confidence + "%";

                }


                showDebug(
                    "✅ Scan complete! Choose Meal Type 👇"
                );


                // ========================================
                // STORE TEMPORARY RESULT
                // ========================================

                window.currentMeal = {

                    food_name:
                        foodName,

                    calories:
                        calories,

                    confidence:
                        confidence

                };

            }

            catch (error) {

                console.error(
                    "❌ Scan error:",
                    error
                );


                if (loading) {

                    loading.style.display =
                        "none";

                }


                showDebug(
                    "❌ Cannot connect to AI server."
                );

            }

        }
    );

}


// ========================================
// ADD TO MEAL
// ========================================

if (addMealBtn) {

    addMealBtn.addEventListener(
        "click",
        async function () {

            // Check scan result
            if (!window.currentMeal) {

                showDebug(
                    "⚠️ Please scan your food first."
                );

                return;
            }


            // ========================================
            // GET MEAL TYPE
            // ========================================

            const mealType =
                mealTypeElement
                    ? mealTypeElement.value
                    : "Lunch";


            showDebug(
                "📡 Saving meal..."
            );


            addMealBtn.disabled =
                true;

            addMealBtn.textContent =
                "Saving...";


            try {

                // ========================================
                // CREATE DATE + TIME
                // ========================================

                const now =
                    new Date();


                const date =
                    now.toISOString();


                const time =
                    now.toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                // ========================================
                // SEND TO DJANGO
                // ========================================

                const response =
                    await fetch(
                        "/api/add-meal/",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            credentials:
                                "include",

                            body:
                                JSON.stringify({

                                    food_name:
                                        window.currentMeal.food_name,

                                    calories:
                                        window.currentMeal.calories,

                                    confidence:
                                        window.currentMeal.confidence,

                                    meal:
                                        mealType,

                                    date:
                                        date,

                                    time:
                                        time

                                })

                        }
                    );


                // ========================================
                // GET RESPONSE
                // ========================================

                const text =
                    await response.text();


                console.log(
                    "Django response:",
                    text
                );


                let data;


                try {

                    data =
                        JSON.parse(text);

                }

                catch (error) {

                    showDebug(
                        "❌ Django returned invalid response."
                    );

                    console.error(
                        error
                    );

                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Add to Meal";

                    return;

                }


                // ========================================
                // SUCCESS
                // ========================================

                if (data.success) {

                    showDebug(
                        "🎉 Meal added successfully!"
                    );


                    alert(
                        "Meal added successfully! 🎉"
                    );


                    // ========================================
                    // USER-SPECIFIC LOCAL STORAGE
                    // ========================================

                    const currentUserEmail =
                        localStorage.getItem(
                            "calorieScanUserEmail"
                        ) || "guest";


                    const mealStorageKey =
                        "calorieScanMeals_" +
                        currentUserEmail;


                    const meals =
                        JSON.parse(
                            localStorage.getItem(
                                mealStorageKey
                            )
                        ) || [];


                    // ========================================
                    // SAVE MEAL
                    // ========================================

                    meals.push({

                        food:
                            window.currentMeal.food_name,

                        foodName:
                            window.currentMeal.food_name,

                        calories:
                            window.currentMeal.calories,

                        confidence:
                            window.currentMeal.confidence,

                        meal:
                            mealType,

                        date:
                            date,

                        time:
                            time

                    });


                    // ========================================
                    // SAVE LOCAL STORAGE
                    // ========================================

                    localStorage.setItem(
                        mealStorageKey,
                        JSON.stringify(meals)
                    );


                    console.log(
                        "💾 Meal saved locally!"
                    );


                    // ========================================
                    // GO TO DASHBOARD
                    // ========================================

                    window.location.href =
                        "/dashboard/";

                }


                else {

                    showDebug(
                        "❌ " +
                        (
                            data.message ||
                            "Meal was not saved."
                        )
                    );


                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Add to Meal";

                }

            }


            catch (error) {

                console.error(
                    "❌ Django error:",
                    error
                );


                showDebug(
                    "❌ Cannot connect to Django."
                );


                addMealBtn.disabled =
                    false;

                addMealBtn.textContent =
                    "➕ Add to Meal";

            }

        }
    );

}


// ========================================
// CAMERA
// ========================================

const cameraBtn =
    document.getElementById("cameraBtn");

const cameraContainer =
    document.getElementById("cameraContainer");

const camera =
    document.getElementById("camera");

const captureBtn =
    document.getElementById("captureBtn");

const closeCameraBtn =
    document.getElementById("closeCameraBtn");

let cameraStream =
    null;


// ========================================
// OPEN CAMERA
// ========================================

if (cameraBtn) {

    cameraBtn.addEventListener(
        "click",
        async function () {

            try {

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true
                    });


                camera.srcObject =
                    cameraStream;


                cameraContainer.style.display =
                    "block";


                showDebug(
                    "📷 Camera is ready!"
                );

            }

            catch (error) {

                console.error(
                    "Camera error:",
                    error
                );


                showDebug(
                    "❌ Cannot access camera."
                );


                alert(
                    "Cannot access camera. Please allow camera permission."
                );

            }

        }
    );

}


// ========================================
// CAPTURE PHOTO
// ========================================

if (captureBtn) {

    captureBtn.addEventListener(
        "click",
        function () {

            if (!cameraStream) {
                return;
            }


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                camera.videoWidth;

            canvas.height =
                camera.videoHeight;


            const context =
                canvas.getContext(
                    "2d"
                );


            context.drawImage(
                camera,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // ========================================
            // SAVE CAPTURED IMAGE AS FILE
            // ========================================

            canvas.toBlob(
                function (blob) {

                    selectedImageFile =
                        new File(
                            [blob],
                            "captured-food.png",
                            {
                                type: "image/png"
                            }
                        );

                },
                "image/png"
            );


            // ========================================
            // SHOW CAPTURED IMAGE
            // ========================================

            preview.src =
                canvas.toDataURL(
                    "image/png"
                );


            preview.style.display =
                "block";


            showDebug(
                "📸 Photo captured!"
            );


            // Close camera
            stopCamera();

        }
    );

}


// ========================================
// CLOSE CAMERA
// ========================================

if (closeCameraBtn) {

    closeCameraBtn.addEventListener(
        "click",
        function () {

            stopCamera();


            showDebug(
                "📷 Camera closed."
            );

        }
    );

}


// ========================================
// STOP CAMERA
// ========================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream =
            null;

    }


    if (camera) {

        camera.srcObject =
            null;

    }


    if (cameraContainer) {

        cameraContainer.style.display =
            "none";

    }

}