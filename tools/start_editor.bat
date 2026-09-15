@echo off
rem ============================================================================
rem  XiaoLiZi VM - API Support Editor  (launcher)
rem
rem  NOTE: keep this file ASCII-only. cmd.exe reads .bat files with the system
rem  ANSI code page, so non-ASCII comments corrupt the parser (they get executed
rem  as commands). All user-facing Chinese text lives in api_editor.py instead.
rem
rem  Why so many candidates? On this machine the "python" found on PATH is the
rem  Microsoft Store execution alias (a 0-byte placeholder). Running it prints
rem  nothing and never executes the script, which is exactly why double-clicking
rem  start_editor.bat appeared to do nothing. Every candidate below is probed by
rem  actually running it, and only a real Python 3.8+ is accepted.
rem ============================================================================
setlocal enabledelayedexpansion
chcp 65001 >nul 2>nul
title API Support Editor - XiaoLiZi VM
cd /d "%~dp0"

set "PYCMD="

rem ---- 1) official py launcher -----------------------------------------------
call :probe py -3
call :probe py

rem ---- 2) WorkBuddy managed python (the only real install on this machine) ---
if not defined PYCMD call :probe "%USERPROFILE%\.workbuddy\binaries\python\versions\current\python.exe"
if not defined PYCMD call :probe "%USERPROFILE%\.workbuddy\binaries\python\versions\3.13.12\python.exe"

rem ---- 3) common install locations -------------------------------------------
for %%V in (
  "%LOCALAPPDATA%\Programs\Python\Python3*\python.exe"
  "%ProgramFiles%\Python3*\python.exe"
  "%ProgramFiles(x86)%\Python3*\python.exe"
  "C:\Python3*\python.exe"
) do if not defined PYCMD call :probe "%%~fV"

rem ---- 4) python on PATH, but skip the Microsoft Store placeholder -----------
for /f "delims=" %%P in ('where python 2^>nul') do (
  if not defined PYCMD echo %%P | findstr /i /v "WindowsApps" >nul && call :probe "%%P"
)
for /f "delims=" %%P in ('where python3 2^>nul') do (
  if not defined PYCMD echo %%P | findstr /i /v "WindowsApps" >nul && call :probe "%%P"
)

rem ---- 5) uv as last resort --------------------------------------------------
if not defined PYCMD for /f "delims=" %%P in ('uv python find 2^>nul') do (
  if not defined PYCMD call :probe "%%P"
)
if not defined PYCMD call :probe uv run --no-project python

if not defined PYCMD goto :nopy

rem ---- run ------------------------------------------------------------------
echo   Python : %PYCMD%
%PYCMD% -V
echo   Script : %~dp0api_editor.py
echo.
%PYCMD% "%~dp0api_editor.py" %*
set "RC=!errorlevel!"
if not "!RC!"=="0" (
  echo.
  echo   [ERROR] api_editor.py exited with code !RC!
  echo   Please copy the message above when reporting the problem.
  echo.
  pause
)
exit /b !RC!

rem ============================================================================
:probe
rem  %* = candidate command line. Accept it only if it really runs Python 3.8+.
%* -c "import sys;sys.exit(0 if sys.version_info>=(3,8) else 1)" >nul 2>&1
if errorlevel 1 exit /b 0
set "PYCMD=%*"
exit /b 0

:nopy
echo.
echo   [ERROR] No usable Python 3 ^(3.8+^) found.
echo.
echo   Already tried:
echo     - py -3 / py launcher
echo     - %%USERPROFILE%%\.workbuddy\binaries\python\versions\current\python.exe
echo     - %%LOCALAPPDATA%%\Programs\Python\Python3*
echo     - python / python3 on PATH ^(Microsoft Store placeholder skipped^)
echo     - uv
echo.
echo   How to fix ^(any one^):
echo     1. Install Python 3.8+ from https://www.python.org/downloads/
echo        and tick "Add python.exe to PATH" during setup.
echo     2. Have uv installed?  run:  uv run --no-project python tools\api_editor.py
echo     3. Or drop a portable Python into %%LOCALAPPDATA%%\Programs\Python\Python313
echo.
pause
exit /b 1
