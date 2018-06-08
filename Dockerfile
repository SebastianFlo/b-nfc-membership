FROM python:3.6

ADD code /

# ENV BBDBPASS=**TO SET**

RUN apt-get update && pip install -r requirements.txt

EXPOSE 5000

CMD [ "python", "./app.py" ]
