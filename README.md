Danilov DWP APP

Build notes: 
cordova build --release android
[1st time] keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms\android\build\outputs\apk\android-release-unsigned.apk alias_name
zipalign -v 4 platforms\android\build\outputs\apk\android-release-unsigned.apk dontworrypapa.apk