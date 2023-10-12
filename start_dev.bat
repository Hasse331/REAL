@echo off

start cmd /k "cd C:\Projects\REAL\backend\api && ..\real-env\Scripts\activate.bat && uvicorn main:app --reload"

timeout /t 5

start cmd /k "cd C:\Projects\REAL\backend\api && ..\real-env\Scripts\activate.bat

start cmd /k "cd C:\Projects\REAL\frontend\real && npm run dev"

exit