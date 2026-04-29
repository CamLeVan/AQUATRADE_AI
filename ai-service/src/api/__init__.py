"""FastAPI application cho AquaTrade AI service.

Entry point (worker/dev):
    uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

Kiến trúc:
    main.py            - FastAPI app factory + routes
    settings.py        - cấu hình từ env vars
    schemas.py         - Pydantic models (request/response/webhook)
    deps.py            - X-Internal-Secret auth
    store.py           - JobStore (in-memory hoặc Redis)
    queue.py           - submit job qua background hoặc Arq (feature-flag)
    worker.py          - Arq worker settings + task entrypoint
    service.py         - orchestration: download video → analyze → upload → webhook
    storage.py         - MinIO upload + signed URL
    webhook.py         - httpx async client + tenacity retry
    logging_config.py  - structlog JSON/console (Sprint 4)
    metrics.py         - Prometheus counters/histograms + middleware (Sprint 4)
"""
