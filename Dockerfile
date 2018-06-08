FROM python:3.6

# ENV BBDBPASS=**TO SET**

RUN apt-get update && \
    apt-get install pcscd libusb-dev libpcsclite1 libpcsclite-dev dh-autoreconf

WORKDIR /opt/
RUN wget https://github.com/nfc-tools/libnfc/archive/libnfc-1.7.1.zip
RUN unzip libnfc-1.7.1.zip

WORKDIR libnfc-libnfc-1.7.1
RUN autoreconf -vis
RUN ./configure --with-drivers=all
RUN make
RUN make install

WORKDIR /

ADD . /

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python", "./app.py" ]
