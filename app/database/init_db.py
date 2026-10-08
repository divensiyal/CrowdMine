from app.database.connection import engine
from app.database.base import Base

from app.models.user import User
from app.models.dataset_request import DatasetRequest
from app.models.schema_field import SchemaField
from app.models.dataset import Dataset
from app.models.dataset_access import DatasetAccess


def init_db():
    Base.metadata.create_all(bind=engine)