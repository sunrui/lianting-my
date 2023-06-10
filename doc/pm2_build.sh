pm2 delete all
cd ~/lianting-www
rm -rf package-lock.json
git pull
npm install
npm run build
pm2 start npm --name "lianting-www" -- run start --watch
cd ~/lianting-m
rm -rf package-lock.json
git pull
npm install
npm run build
pm2 start npm --name "lianting-m" -- run start --watch
cd ~/lianting-my
rm -rf package-lock.json
git pull
npm install
npm run build
pm2 start npm --name "lianting-my" -- run start --watch
~