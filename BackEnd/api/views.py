from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Meal
import json
import os, base64, io, requests
from PIL import Image

ROBOFLOW_URL = "https://serverless.roboflow.com/afifahs-workspace/workflows/foods-project-vfoods-project-pl16z-3-yolo11n-t1-logic"
MIN_CONFIDENCE = 0.40
# แคลอรี่โดยประมาณ (kcal) ต่อ 1 จาน / 1 แก้ว / 1 หน่วยบริโภคทั่วไป
CALORIES = {
    "Boiled Egg": 78,                 # 1 ฟอง
    "Chicken Rice": 600,              # ข้าวมันไก่ 1 จาน
    "Coffee": 5,                      # กาแฟดำ ไม่ใส่น้ำตาล
    "Fish Chili Paste": 80,           # น้ำพริกปลา 2 ช้อนโต๊ะ
    "French Fries": 365,              # 1 เสิร์ฟกลาง
    "Fried Chicken": 250,             # 1 ชิ้น
    "Fried Chicken Wings": 200,       # 2 ชิ้น
    "Fried Egg": 90,                  # 1 ฟอง
    "Fried Rice": 550,                # ข้าวผัด 1 จาน
    "Fried Sausage": 150,             # 2 ชิ้น
    "Garlic Chicken": 300,            # 1 เสิร์ฟ
    "Green Tea": 100,                 # ชาเขียวใส่น้ำตาล 1 แก้ว
    "Ice": 0,
    "Iced Cocoa": 200,                # 1 แก้ว
    "Iced Coffee": 150,               # กาแฟเย็นใส่นมและน้ำตาล 1 แก้ว
    "Lemonade": 100,                  # 1 แก้ว
    "Morning glory": 150,             # ผักบุ้งไฟแดง 1 จาน
    "Omelet": 300,                    # ไข่เจียว 2 ฟอง
    "Orange Juice": 110,              # 1 แก้ว (250 มล.)
    "Pad krapow": 550,                # ผัดกะเพราราดข้าว 1 จาน
    "Pad Thai": 550,                  # 1 จาน
    "Pink Milk": 200,                 # นมเย็น 1 แก้ว
    "Rice": 200,                      # ข้าวสวย 1 ถ้วย
    "Rice Porridge": 250,             # 1 ชาม
    "Sandwich": 300,                  # 1 ชิ้น
    "Stir-fried Curry Paste": 250,    # 1 เสิร์ฟ
    "Stir-fried Mixed Vegetables": 120,  # 1 จาน
    "Stir-fried Rice Noodles with Soy Sauce": 550,  # ผัดซีอิ๊ว 1 จาน
    "Thai Iced Tea": 220,             # 1 แก้ว
    "Water": 0,
}


def find_predictions(data):
    found = []
    if isinstance(data, dict):
        if "class" in data and "confidence" in data:
            found.append(data)
        else:
            for v in data.values():
                found.extend(find_predictions(v))
    elif isinstance(data, list):
        for item in data:
            found.extend(find_predictions(item))
    return found


# =========================
# SIGN UP
# =========================

@csrf_exempt
def signup(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")


            # Check empty fields

            if not username or not email or not password:

                return JsonResponse({
                    "success": False,
                    "message": "Please fill in all fields."
                })


            # Check username already exists

            if User.objects.filter(username=username).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Username already exists."
                })


            # Check email already exists

            if User.objects.filter(email=email).exists():

                return JsonResponse({
                    "success": False,
                    "message": "Email already exists."
                })


            # Create user

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )


            # Login automatically

            login(request, user)


            return JsonResponse({
                "success": True,
                "message": "Account created successfully!",
                "username": user.username
            })


        except Exception as error:

            return JsonResponse({
                "success": False,
                "message": str(error)
            })


    return JsonResponse({
        "success": False,
        "message": "POST request required."
    })


# =========================
# LOGIN
# =========================

@csrf_exempt
def login_user(request):

    if request.method == "POST":

        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:

            user = User.objects.get(email=email)

            user = authenticate(
                username=user.username,
                password=password
            )

            if user is not None:

                login(request, user)

                return JsonResponse({
                    "success": True,
                    "username": user.username,
                    "is_admin":user.is_staff
                })

            else:

                return JsonResponse({
                    "success": False,
                    "message": "Invalid email or password."
                })

        except User.DoesNotExist:

            return JsonResponse({
                "success": False,
                "message": "Email not found."
            })

    return JsonResponse({
        "success": False,
        "message": "POST request required."
    })



# =========================
# ADD MEAL
# =========================

@csrf_exempt
def add_meal(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "POST request required."
        })


    # Check login

    if not request.user.is_authenticated:

        return JsonResponse({
            "success": False,
            "message": "Please login first."
        })


    try:

        data = json.loads(request.body)

        food_name = data.get("food_name")
        calories = data.get("calories")


        # Check data

        if not food_name or calories is None:

            return JsonResponse({
                "success": False,
                "message": "Food name and calories are required."
            })


        # Save meal

        meal = Meal.objects.create(

            user=request.user,

            food_name=food_name,

            calories=calories

        )


        return JsonResponse({

            "success": True,

            "message": "Meal saved successfully!",

            "meal": {

                "id": meal.id,

                "food_name": meal.food_name,

                "calories": meal.calories

            }

        })


    except Exception as error:

        return JsonResponse({

            "success": False,

            "message": str(error)

        })

@csrf_exempt
def scan_food(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST request required."})

    file = request.FILES.get("image")
    if not file:
        return JsonResponse({"success": False, "message": "No image uploaded."})

    try:
        img = Image.open(file).convert("RGB")
        img.thumbnail((1024, 1024))
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        b64 = base64.b64encode(buf.getvalue()).decode()

        res = requests.post(
            ROBOFLOW_URL,
            json={
                "api_key": os.environ["ROBOFLOW_API_KEY"],
                "inputs": {"image": {"type": "base64", "value": b64}},
            },
            timeout=30,
        )
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        return JsonResponse({"success": False, "message": f"Scan failed: {e}"})

    detections = find_predictions(data)

    # พิมพ์ทุกอย่างที่โมเดลเห็นลงเทอร์มินัล (ไว้ดูว่าโมเดลเจออะไรบ้างในรูป)
    print("🤖 DETECTIONS:", [(p["class"], round(p["confidence"], 2)) for p in detections])

    # เก็บทุกเมนูที่มั่นใจพอ โดยเมนูเดียวกันนับ 1 จาน (ถ้าเจอซ้ำให้เอาตัวที่มั่นใจสูงสุด)
    best_by_class = {}
    for p in detections:
        if p["confidence"] < MIN_CONFIDENCE:
            continue
        name = p["class"]
        if name not in best_by_class or p["confidence"] > best_by_class[name]["confidence"]:
            best_by_class[name] = p

    if not best_by_class:
        return JsonResponse({"success": False, "message": "ไม่พบอาหารในรูป ลองถ่ายใหม่"})

    # เมนูเหล่านี้ในตารางแคลอรี่นับข้าวรวมไปแล้ว ถ้าเจอ "Rice" ด้วยจะไม่นับซ้ำ
    # (ไม่ต้องการกฎนี้ ให้ลบ 3 บรรทัดนี้ออก)
    INCLUDES_RICE = {"Pad krapow", "Fried Rice", "Chicken Rice", "Rice Porridge"}
    if "Rice" in best_by_class and INCLUDES_RICE & set(best_by_class):
        del best_by_class["Rice"]

    ordered = sorted(best_by_class.values(), key=lambda p: p["confidence"], reverse=True)
    items = [
        {
            "food_name": p["class"],
            "calories": CALORIES.get(p["class"], 0),
            "confidence": round(p["confidence"] * 100),
        }
        for p in ordered
    ]

    return JsonResponse({
        "success": True,
        "food_name": " + ".join(i["food_name"] for i in items),
        "calories": sum(i["calories"] for i in items),
        "confidence": min(i["confidence"] for i in items),
        "items": items,
    })

# =========================
# GET MEALS
# =========================

def get_meals(request):
    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "GET request required."
        }, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({
            "success": False,
            "message": "Please login first."
        }, status=401)

    meals = Meal.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return JsonResponse({
        "success": True,
        "meals": [
            {
                "id": meal.id,
                "food_name": meal.food_name,
                "calories": meal.calories,
                "created_at": meal.created_at.isoformat(),
            }
            for meal in meals
        ]
    })


