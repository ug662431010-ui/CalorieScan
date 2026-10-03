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

const proteinElement =
    document.getElementById("protein");

const carbElement =
    document.getElementById("carb");

const fatElement =
    document.getElementById("fat");

const confidenceElement =
    document.getElementById("confidence");

const mealTypeElement =
    document.getElementById("mealType");


// ========================================
// CAMERA ELEMENTS
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

let cameraStream = null;


// ========================================
// DEBUG MESSAGE
// ========================================

function showDebug(message) {

    if (debugMessage) {

        debugMessage.textContent =
            message;

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


            // Check image file

            if (!file.type.startsWith("image/")) {

                showDebug(
                    "⚠️ Please select an image file."
                );

                return;

            }


            // Create image preview

            const imageURL =
                URL.createObjectURL(file);

            preview.src =
                imageURL;

            preview.style.display =
                "block";


            showDebug(
                "📷 Image selected!"
            );

        }
    );

}


// ========================================
// UPLOAD BUTTON
// ========================================

// Extra protection for the upload button

const uploadButton =
    document.querySelector(".upload-button");

if (uploadButton && imageInput) {

    uploadButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            imageInput.click();

        }
    );

}


// ========================================
// SCAN FOOD
// ========================================

if (scanBtn) {

    scanBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showDebug(
                "🔵 Scan started..."
            );


            // Check image

            if (
                !imageInput ||
                imageInput.files.length === 0
            ) {

                // If photo was taken from camera,
                // currentMealImage will exist

                if (!window.currentMealImage) {

                    showDebug(
                        "⚠️ Please upload or take a photo first."
                    );

                    return;

                }

            }


            // Show loading

            if (loading) {

                loading.style.display =
                    "block";

            }


            showDebug(
                "🤖 AI is analyzing..."
            );


            // ========================================
            // SIMULATE AI
            // ========================================

            setTimeout(
                function () {

                    if (loading) {

                        loading.style.display =
                            "none";

                    }


                    // ========================================
                    // AI RESULT
                    // ========================================

                    const foodName =
                        "Fried Rice 🍚";

                    const calories =
                        520;

                    const protein =
                        "14 g";

                    const carb =
                        "63 g";

                    const fat =
                        "18 g";

                    const confidence =
                        "97%";


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

                    if (proteinElement) {

                        proteinElement.textContent =
                            protein;

                    }

                    if (carbElement) {

                        carbElement.textContent =
                            carb;

                    }

                    if (fatElement) {

                        fatElement.textContent =
                            fat;

                    }

                    if (confidenceElement) {

                        confidenceElement.textContent =
                            confidence;

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

                        protein:
                            protein,

                        carb:
                            carb,

                        fat:
                            fat,

                        confidence:
                            confidence

                    };

                },
                2000
            );

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
                // SEND TO DJANGO
                // ========================================

                const response =
                    await fetch(
                        "/api/add-meal/",
                        {

                            method: "POST",

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

                                    protein:
                                        window.currentMeal.protein,

                                    carbohydrate:
                                        window.currentMeal.carb,

                                    fat:
                                        window.currentMeal.fat,

                                    confidence:
                                        window.currentMeal.confidence,

                                    meal:
                                        mealType

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
                    // SAVE LOCAL BACKUP
                    // ========================================

                    const meals =
                        JSON.parse(
                            localStorage.getItem(
                                "calorieScanMeals"
                            )
                        ) || [];


                    const now =
                        new Date();


                    meals.push({

                        food:
                            window.currentMeal.food_name,

                        foodName:
                            window.currentMeal.food_name,

                        calories:
                            window.currentMeal.calories,

                        protein:
                            window.currentMeal.protein,

                        carb:
                            window.currentMeal.carb,

                        fat:
                            window.currentMeal.fat,

                        confidence:
                            window.currentMeal.confidence,

                        meal:
                            mealType,

                        date:
                            now.toISOString(),

                        time:
                            now.toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )

                    });


                    localStorage.setItem(
                        "calorieScanMeals",
                        JSON.stringify(meals)
                    );


                    console.log(
                        "💾 Meal saved locally!"
                    );


                    console.log(
                        "🍽️ Meal Type:",
                        mealType
                    );


                    // ========================================
                    // RESET BUTTON
                    // ========================================

                    addMealBtn.disabled =
                        false;

                    addMealBtn.textContent =
                        "➕ Added to Meal";

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
// OPEN CAMERA
// ========================================

if (cameraBtn) {

    cameraBtn.addEventListener(
        "click",
        async function () {

            showDebug(
                "📷 Opening camera..."
            );


            // Check browser support

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                showDebug(
                    "❌ Your browser does not support camera access."
                );

                alert(
                    "Camera is not supported in this browser."
                );

                return;

            }


            try {

                // Stop previous camera

                stopCamera();


                // Request camera

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({

                        video: {

                            facingMode:
                                "environment"

                        },

                        audio:
                            false

                    });


                // Connect camera

                if (camera) {

                    camera.srcObject =
                        cameraStream;


                    await camera.play();

                }


                // Show camera area

                if (cameraContainer) {

                    cameraContainer.style.display =
                        "block";

                }


                showDebug(
                    "📷 Camera is ready!"
                );

            }

            catch (error) {

                console.error(
                    "Camera error:",
                    error
                );


                if (
                    error.name ===
                    "NotAllowedError"
                ) {

                    showDebug(
                        "❌ Camera permission was denied."
                    );

                    alert(
                        "Please allow camera permission in your browser."
                    );

                }

                else if (
                    error.name ===
                    "NotFoundError"
                ) {

                    showDebug(
                        "❌ No camera was found."
                    );

                    alert(
                        "No camera was found on this device."
                    );

                }

                else {

                    showDebug(
                        "❌ Cannot access camera."
                    );

                    alert(
                        "Cannot access camera. Please check browser permission."
                    );

                }

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

            if (
                !cameraStream ||
                !camera
            ) {

                showDebug(
                    "⚠️ Camera is not ready."
                );

                return;

            }


            // Wait until video has dimensions

            if (
                camera.videoWidth === 0 ||
                camera.videoHeight === 0
            ) {

                showDebug(
                    "⚠️ Camera is still loading..."
                );

                return;

            }


            // Create canvas

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                camera.videoWidth;

            canvas.height =
                camera.videoHeight;


            const context =
                canvas.getContext("2d");


            context.drawImage(
                camera,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // ========================================
            // SAVE CAPTURED IMAGE
            // ========================================

            const imageData =
                canvas.toDataURL(
                    "image/png"
                );


            preview.src =
                imageData;

            preview.style.display =
                "block";


            // Tell Scan button
            // that an image exists

            window.currentMealImage =
                imageData;


            showDebug(
                "📸 Photo captured! You can scan now."
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
                function (track) {

                    track.stop();

                }
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