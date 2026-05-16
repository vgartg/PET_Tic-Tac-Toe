@echo off
setlocal
cd /d "%~dp0"

call .\mvnw.cmd -B -q -DskipTests package
if errorlevel 1 exit /b %errorlevel%

java -jar "target\tictactoe-backend.jar" %*
