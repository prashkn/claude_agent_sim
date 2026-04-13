# Claude Display Server

## Setup

```bash
python3 -m venv venv
source venv/bin/activate      # bash/zsh
source venv/bin/activate.fish # fish
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload
```

```bash
nohup uvicorn server.main:app --host 0.0.0.0 --port 8000 &
```

The server starts at http://localhost:8000.

## Verify

```bash
curl localhost:8000/status
```
