"""FastAPI application cho AquaTrade AI service.

Entry point (worker/dev):
    uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

Kiến trúc:
    main.py      - FastAPI app factory + routes
    settings.py  - cấu hình từ env vars
    schemas.py   - Pydantic models (request/response/webhook)
    deps.py      - X-Internal-Secret auth
    store.py     - JobStore in-memory (Sprint 3 sẽ chuyển sang Redis/Postgres)
    service.py   - orchestration: download video → analyze → webhook
    webhook.py   - httpx async client + tenacity retry
"""
