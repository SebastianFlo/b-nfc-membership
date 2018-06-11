<p align="center">
  <strong>NFC Membership.</strong> An application to register and read nfc membership cards
</p>

Build using python and SQLite

**Architecture**
```
_________________________
|                        |
| ))) ARC122U NFC Reader |
|________________________|
            |
            |
            |
____________________________________________________________________
|RPi                                                               |
|                                                                  |
|    _Server App_                                                  |
|        -- Docker (auto-restarting)                               |
|            -- Python3.6 - Flask Application running on :5000     |
|            -- Shared VOL: /b-vol/                                |
|                -- DB sqlite3                                     |
|                                                                  |
|    _Reader App_                                                  |
|        -- PM2 (auto-restarting service)                          |
|            -- NodeJS application                                 |
|                -- NFC Reader                                     |
|                -- Rpi GPIO Pins                                  |
|                                                                  |
|                                                                  |
|__________________________________________________________________|
```

Tech Stack
* Python3.6 - Flask
* NodeJS
* sqlLite3

SETUP:

> Run the raspberry pi setup script
`sudo sh setup.sh`


This installs docker and the nfc drivers, nodejs, nvm

> Run the reader app using pm2

`pm2 start /reader/reader.js`

>To give permissions for the automatic starting of the reader run
```
pm2 startup systemd
```
Then run with root persmission the outputted command;


Check logs using
`pm2 logs reader`

### Create Docker Volume

Docker is used in order to control the env, but can also be omitted [not recommended]
`sudo docker volume create --name=b-vol --opt o=size=100m`


> Edit DockerFile
Add BBDBPASS env;

> Build Image
`sudo docker build --rm -f Dockerfile -t seftek/b-nfc-membership:latest .`

> Run Image
`sudo docker run --restart=unless-stopped -d -v /b-vol:/data/db -p 5000:5000 seftek/b-nfc-membership:latest`

`--restart=unless-stopped` - Restart the container unless it is explicitly stopped or Docker itself is stopped or restarted.

`-it` - Interactive [optional]

`-d` - detached [optional]

`-v /b-vol:/data/db` - Mount external volume to local `data/db`

`-p 5000:5000` - Bind internal port to external port


Interact with image
`sudo docker exec -it #containerID#  bash`

TODO: Add nfc reader into container


Sebastian Florian @SebFlorian