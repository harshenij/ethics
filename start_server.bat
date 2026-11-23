@echo off
title Ethical Med-AI Local Web Server
cd /d "%~dp0"
echo =======================================================================
echo  Starting Ethical Med-AI Server on Windows (No Python/Node required)...
echo =======================================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
