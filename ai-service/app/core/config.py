from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    node_api_base_url: str = "http://localhost:5000"
    environment: str = "development"
    groq_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()