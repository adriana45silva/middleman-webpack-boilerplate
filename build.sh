clear

# Color Variables
Color_Off='\033[0m'       # Text Reset
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White


echo "${Purple}----------------------------------------------------------"
echo "Removing old build folder from Webpack 🗑️ "
echo "----------------------------------------------------------${Color_Off}"
rm -rf ./dist


echo "${Purple}----------------------------------------------------------"
echo "Installing dependencies ✍️ "
echo "----------------------------------------------------------${Color_Off}"
npm install

echo "${Purple}----------------------------------------------------------"
echo "Building package 📦"
echo "----------------------------------------------------------${Color_Off}"
npm run build



echo "${Purple}----------------------------------------------------------"
echo "Removing old build folder from Middleman 🗑️ "
echo "----------------------------------------------------------${Color_Off}"
rm -rf ./build


echo "${Purple}----------------------------------------------------------"
echo "🎉  Hooraaay, script finished! 🎉"
echo "----------------------------------------------------------${Color_Off}"

