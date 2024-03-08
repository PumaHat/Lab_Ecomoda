FROM python:alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /srv/
COPY src /srv/phct
RUN pip3 install -r /srv/requirements.txt
WORKDIR /srv/phct
RUN python3 manage.py makemigrations usuarios comentarios archivos
RUN python3 manage.py migrate

EXPOSE 8000/tcp

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
