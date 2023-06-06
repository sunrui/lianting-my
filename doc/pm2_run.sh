cd lianting-www
pm2 start npm --name "lianting-www" -- run start --watch
cd ..
cd lianting-m
pm2 start npm --name "lianting-m" -- run start --watch
cd ..
cd lianting-b
pm2 start npm --name "lianting-b" -- run start --watch