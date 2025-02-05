FROM python:3.12-alpine
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

RUN apk update && \
  apk add --virtual build-deps gcc python3-dev musl-dev && \
  apk add postgresql-dev

RUN adduser --disabled-password --gecos '' appuser && mkdir -p /app/celerybeat
WORKDIR /app

COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser
EXPOSE 8000
CMD ["daphne", "-u", "/app/daphne.sock", "backend_site.asgi:application"]
