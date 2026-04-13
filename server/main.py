from contextlib import asynccontextmanager

from fastapi import FastAPI

from routes import router
from store import load_agents


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_agents()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router)
