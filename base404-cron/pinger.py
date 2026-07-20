#!/usr/bin/env python3
"""
health-pinger
-------------
Hace una consulta GET a {API_URL}/health cada INTERVAL_MINUTES minutos
para evitar que un servicio en Render (free tier) se duerma, y guarda
un log de cada intento (éxito o error) en un archivo rotativo.

Configuración vía variables de entorno (o edítalas abajo directamente):
    API_URL            -> URL base de tu API, ej: https://mi-api.onrender.com
    INTERVAL_MINUTES    -> minutos entre cada ping (default: 15)
    LOG_FILE            -> ruta del archivo de log (default: ./pinger.log)
    TIMEOUT_SECONDS      -> timeout de la request (default: 10)
"""

import os
import sys
import time
import logging
import signal
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler

import requests

# --------------------------------------------------------------------------
# Configuración
# --------------------------------------------------------------------------
API_URL = os.getenv("API_URL", "https://api.vimazdev.com").rstrip("/")
INTERVAL_MINUTES = float(os.getenv("INTERVAL_MINUTES", "15"))
LOG_FILE = os.getenv("LOG_FILE", os.path.join(os.path.dirname(__file__), "pinger.log"))
TIMEOUT_SECONDS = float(os.getenv("TIMEOUT_SECONDS", "10"))

HEALTH_ENDPOINT = f"{API_URL}/health"

# --------------------------------------------------------------------------
# Logging: a archivo (con rotación, máx 5 archivos de 1MB) y a consola
# --------------------------------------------------------------------------
logger = logging.getLogger("health_pinger")
logger.setLevel(logging.INFO)

file_handler = RotatingFileHandler(LOG_FILE, maxBytes=1_000_000, backupCount=5, encoding="utf-8")
console_handler = logging.StreamHandler(sys.stdout)

formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

_running = True


def _handle_signal(signum, _frame):
    global _running
    logger.info(f"Señal {signum} recibida, cerrando el pinger...")
    _running = False


signal.signal(signal.SIGTERM, _handle_signal)
signal.signal(signal.SIGINT, _handle_signal)


def ping_once() -> None:
    """Hace una sola consulta a /health y loguea el resultado."""
    start = time.monotonic()
    try:
        resp = requests.get(HEALTH_ENDPOINT, timeout=TIMEOUT_SECONDS)
        elapsed_ms = round((time.monotonic() - start) * 1000, 1)

        # Intentamos parsear JSON, si no, mostramos el texto crudo (recortado)
        try:
            body = resp.json()
        except ValueError:
            body = resp.text[:300]

        if resp.ok:
            logger.info(f"OK  status={resp.status_code} tiempo={elapsed_ms}ms body={body}")
        else:
            logger.warning(f"FAIL status={resp.status_code} tiempo={elapsed_ms}ms body={body}")

    except requests.exceptions.RequestException as exc:
        elapsed_ms = round((time.monotonic() - start) * 1000, 1)
        logger.error(f"ERROR al consultar {HEALTH_ENDPOINT} tras {elapsed_ms}ms -> {exc}")


def main() -> None:
    logger.info(f"Iniciando health-pinger -> {HEALTH_ENDPOINT} cada {INTERVAL_MINUTES} min")
    interval_seconds = INTERVAL_MINUTES * 60

    while _running:
        ping_once()

        # Dormir en pedacitos de 1s para poder salir rápido si llega SIGTERM/SIGINT
        slept = 0
        while slept < interval_seconds and _running:
            time.sleep(min(1, interval_seconds - slept))
            slept += 1

    logger.info("health-pinger detenido.")


if __name__ == "__main__":
    main()
