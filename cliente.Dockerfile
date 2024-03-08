FROM python:alpine

WORKDIR /srv/phct
COPY src/cliente .

EXPOSE 8000/tcp

CMD ["python3", "-m", "http.server", "8000"]
