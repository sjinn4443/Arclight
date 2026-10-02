@echo off
setlocal
cd /d "%~dp0"

call :bundle "Amsler" || exit /b 1
call :bundle "Cataract" || exit /b 1
call :bundle "Diabetic" || exit /b 1
call :bundle "Discs" || exit /b 1
call :bundle "Fundal Reflex" || exit /b 1
call :bundle "Glaucoma" || exit /b 1
call :bundle "Mires" || exit /b 1
call :bundle "Refract" || exit /b 1
call :bundle "Sauron" || exit /b 1
call :bundle "Swollen Discs" || exit /b 1

echo Bundles rebuilt.
exit /b 0

:bundle
echo Bundling %~1
pushd "%~1" || exit /b 1
rem Delegate to each app's canonical build, including custom and multiple bundles.
call npm run build
set "status=%errorlevel%"
popd
exit /b %status%
