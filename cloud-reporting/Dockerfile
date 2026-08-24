FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    REPORT_OUTPUT_DIR=/data/reports \
    REPORT_TIMEZONE=Europe/London \
    PORT=8000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gosu \
       libreoffice-writer \
       fonts-dejavu-core \
       fonts-liberation \
       fonts-noto-core \
       fonts-noto-cjk \
       tini \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system arclight \
    && useradd --system --gid arclight --home-dir /app --create-home arclight

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY pyproject.toml ./
COPY src ./src
RUN pip install --no-cache-dir --no-deps .

COPY docker-entrypoint.sh /usr/local/bin/arclight-reporting-entrypoint
RUN chmod 0755 /usr/local/bin/arclight-reporting-entrypoint

EXPOSE 8000

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/arclight-reporting-entrypoint"]

