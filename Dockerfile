FROM python:3.6

# ENV BBDBPASS=**TO SET**

RUN apt-get update

ADD . /

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python", "./app.py" ]
