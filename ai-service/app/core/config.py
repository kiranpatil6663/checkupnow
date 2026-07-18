from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    node_api_base_url: str = "http://localhost:5000"
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()