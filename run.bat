@echo off
title AnimM&A: O Jogo do Controle Corporativo
echo ========================================================
echo   Iniciando AnimM&A: O Jogo do Controle Corporativo
echo   Web App PWA Mobile-First
echo ========================================================
echo.
python serve.py
if errorlevel 1 (
  echo Python nao encontrado, tentando Node.js...
  node server.js
)
pause
