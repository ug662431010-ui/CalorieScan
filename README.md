# How to Run the Project Locally

### 1. Clone the Project
```powershell
git clone https://github.com/ug662431010-ui/CalorieScan.git
cd CalorieScan
```

### 2. Create and Activate a Virtual Environment
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install the Required Libraries
```powershell
pip install -r requirements.txt
```

### 4. Set the Roboflow API Key
```powershell
$env:ROBOFLOW_API_KEY = "YOUR_API_KEY_HERE"
```

### 5. Set Up the Database and Create an Admin Account
```powershell
cd BackEnd
python manage.py migrate
python manage.py createsuperuser
```

### 6. Run the Development Server

Run the following command, then open http://127.0.0.1:8000/ in your browser.

```powershell
python manage.py runserver
```


**Need a Roboflow API Key?**

If you need access to the Roboflow API Key to run the food recognition feature, please contact the project owner directly.

**Note:** The API Key is private and will not be shared publicly in this repository.
