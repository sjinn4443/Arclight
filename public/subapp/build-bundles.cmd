@echo off
setlocal
cd /d "%~dp0"

call :bundle "Amsler" "script.js" || exit /b 1
call :bundle "Cataract" "script.js" || exit /b 1
call :bundle "Diabetic" "script.js" || exit /b 1
call :bundle "Fundal Reflex" "script.js" || exit /b 1
call :bundle "Glaucoma" "scripts.js" || exit /b 1
call :bundle "Mires" "app.js" || exit /b 1
call :bundle "Refract" "scripts.js" || exit /b 1
call :bundle "Sauron" "script.js" || exit /b 1
call :bundle "Swollen Discs" "script.js" || exit /b 1

echo Bundles rebuilt.
exit /b 0

:bundle
echo Bundling %~1
pushd "%~1" || exit /b 1
call npx --yes esbuild "%~2" --bundle --format=iife --target=es2018 --outfile=app.bundle.js --log-level=warning
set "status=%errorlevel%"
popd
exit /b %status%
