# health-pinger

Script en Python que hace `GET {API_URL}/health` cada N minutos (por defecto 15)
y guarda un log rotativo (`pinger.log`) de cada intento, para evitar que una API
en el free tier de Render se duerma.

## 1. Probarlo local

```bash
pip install -r requirements.txt
export API_URL="https://api.vimazdev.com"
export INTERVAL_MINUTES=15
python pinger.py
```

Vas a ver algo así en consola (y en `pinger.log`):

```
2026-07-19 10:00:00 [INFO] Iniciando health-pinger -> https://tu-api.onrender.com/health cada 15.0 min
2026-07-19 10:00:00 [INFO] OK  status=200 tiempo=284.3ms body={'status': 'ok'}
```

Nota: mientras el proceso corre en tu computadora, solo mantiene la API despierta
si tu compu está encendida y con internet. Si la apagas, se detiene el ping.

## 2. Correrlo en background en un servidor propio (VPS, etc.)

Opción rápida con `nohup`:

```bash
nohup python3 pinger.py > /dev/null 2>&1 &
```

Opción robusta (recomendada) con `systemd`, para que arranque solo al reiniciar
el servidor y se reinicie si falla:

```bash
sudo cp health-pinger.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now health-pinger
sudo systemctl status health-pinger   # ver estado
journalctl -u health-pinger -f        # ver logs en vivo
```

Edita antes las rutas y la variable `API_URL` dentro de `health-pinger.service`.

## 3. Correrlo 24/7 sin depender de tu compu: como Worker en Render

Esta es la opción más simple si ya tienes tu API en Render: subes este mismo
script como un segundo servicio tipo **Background Worker** (no Web Service),
en el mismo proyecto/cuenta. Corre siempre, no se duerme (los Background
Workers de Render no tienen el auto-sleep de los Web Services free), y no
depende de Vercel ni de tu computadora.

1. Sube esta carpeta a un repo de GitHub.
2. En Render: **New +** → **Background Worker** → conecta el repo.
3. Render detecta `render.yaml`, o configúralo manual:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python pinger.py`
   - Variable de entorno `API_URL` con la URL de tu API.

## Variables de entorno

| Variable          | Default                        | Descripción                          |
|-------------------|---------------------------------|---------------------------------------|
| `API_URL`         | `https://tu-api.onrender.com`  | Base de tu API (sin `/health` al final) |
| `INTERVAL_MINUTES`| `15`                            | Minutos entre cada ping               |
| `LOG_FILE`        | `./pinger.log`                  | Ruta del archivo de log               |
| `TIMEOUT_SECONDS` | `10`                             | Timeout de la request                 |
