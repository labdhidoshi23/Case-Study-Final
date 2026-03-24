@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Training ML model...
python train.py

echo.
echo Starting chatbot server on http://localhost:5050
python app.py
