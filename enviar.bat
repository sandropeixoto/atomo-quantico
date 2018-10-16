xcopy /Y /S "C:\xampp\htdocs\ionic\output\atomo_quantico\*"

xcopy /Y config-phonegap2.xml config.xml

git add .

git commit -m "Add existing file"

git push origin master

ECHO #### FIM #####