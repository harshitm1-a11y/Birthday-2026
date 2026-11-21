@echo off
echo ========================================================
echo   Sameeksha Birthday Website - Auto Build & Deploy
echo ========================================================
echo.
echo [1/3] Building latest 3D site bundles & syncing assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please check your code.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Adding changes and committing to Git...
git add -A
git commit -m "update: auto-deploy changes %date% %time%"

echo.
echo [3/3] Pushing to GitHub (main branch)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git push failed! Please check your internet or git credentials.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo   SUCCESS! Pushed to GitHub.
echo   GitHub Actions will automatically deploy to GitHub Pages!
echo   Live URL: https://harshitm1-a11y.github.io/Birthday-2026/
echo ========================================================
echo.
pause
