cd lianting-www
pm2 start npm --name "lianting-www" -- run start --watch
cd ..
cd lianting-m
pm2 start npm --name "lianting-m" -- run start --watch
cd ..
cd lianting-shop
pm2 start npm --name "lianting-shop" -- run start --watch