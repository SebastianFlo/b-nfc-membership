# Installing docker
echo 'Installing Docker'
sudo apt-get update
sudo apt-get install git

sudo apt-get install -y apt-transport-https
wget -q https://packagecloud.io/gpg.key -O - | sudo apt-key add -
echo 'deb https://packagecloud.io/Hypriot/Schatzkiste/debian/ wheezy main' | sudo tee /etc/apt/sources.list.d/hypriot.list
sudo apt-get update
sudo apt-get install -y docker-hypriot
sudo systemctl enable docker


# Installing nfc drivers
echo 'Installing nfc'
sudo apt-get install -y pcscd libusb-dev libpcsclite1 libpcsclite-dev dh-autoreconf

cd /opt/
sudo wget https://github.com/nfc-tools/libnfc/archive/libnfc-1.7.1.zip
sudo unzip libnfc-1.7.1.zip
cd libnfc-libnfc-1.7.1/
sudo autoreconf -vis
sudo ./configure --with-drivers=all
sudo make
sudo make install

echo '/usr/local/lib' | sudo tee -a /etc/ld.so.conf.d/usr-local-lib.conf && sudo ldconfig

# Install node
echo 'Installing node'
sudo wget https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-armv7l.tar.gz
tar -xzf node-v8.11.2-linux-armv7l.tar.gz
cd node-v8.11.2-linux-armv7l/
sudo cp -R * /usr/local/
node -v
npm -v
sudo rm -rf node-v8.11.2-linux-armv7l
sudo rm -rf node-v8.11.2-linux-armv7l.tar.gz

# Install node app manager
echo 'Installing node app manager'
sudo npm install -g pm2
