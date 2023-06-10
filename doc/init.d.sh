service mysql start
service redis start

pm2 delete all

cd ~/lianting-www
pm2 start npm --name "lianting-www" -- run start --watch
cd ~/lianting-m
pm2 start npm --name "lianting-m" -- run start --watch
cd ~/lianting-my
pm2 start npm --name "lianting-my" -- run start --watch

cd ~/apache-tomcat-9.0.76/bin
./startup.sh


nginx -s reload