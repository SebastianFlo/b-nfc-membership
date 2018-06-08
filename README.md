<p align="center">
  <strong>NFC Membership.</strong> An application to register and read nfc membership cards
</p>

Build using python and SQLite

**Structure**
NodeJS
Flash API
sqlLite3


**Quickstart**

:tada: :tada: :tada: :tada: :tada:

SETUP:

<!-- Run the raspberry pi setup script -->
rpi/setup.sh

### Create Docker Volume
`sudo docker volume create --name=b-vol --opt o=size=100m`



<!-- Edit DockerFile -->
Add BBDBPASS env;

<!-- Build Image -->

<!-- Run Image -->
`sudo docker run -d -v /b-vol:/data/db -p 5000:5000 b-nfc-membership:latest`

`-it` - Interactive [optional]
`-d` - detached [optional]
`-v /b-vol:/data/db` - Mount external volume to local `data/db`
`-p 5000:5000` - Bind internal port to external port

Interact with image
`sudo docker exec -it #containerID#  bash`


Sebastian Florian @SebFlorian