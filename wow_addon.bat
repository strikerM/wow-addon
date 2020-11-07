@echo off
SETLOCAL EnableDelayedExpansion

for /f "tokens=5" %%a in ('netstat -aon ^| findstr -i "listening" ^| findstr "0.0.0.0:3000"') do set /A pid=%%a
echo pid is: %pid%
if errorlevel 1 ( goto :StartApp )

for /f "tokens=1" %%b in ('tasklist /NH /FI "PID eq %pid%"') do set node_proc=%%b
echo node_proc is: %node_proc%

echo %node_proc% | find "node.exe" > nul
if not errorlevel 1 (
	echo Program is already running
	timeout 3 > NUL
	exit
)

:StartApp
cd /D "%~dp0"
start npm run server
rem start chrome.exe localhost:3000 
start http://localhost:3000