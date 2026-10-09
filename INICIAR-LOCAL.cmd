@echo off
cd /d "%~dp0"
echo Site Braga e Delfino
echo Abra http://127.0.0.1:4173 no navegador.
echo Mantenha esta janela aberta enquanto estiver utilizando o site.
python -m http.server 4173 --bind 127.0.0.1 --directory dist
pause
