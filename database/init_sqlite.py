import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Define the SQLite database file path
db_file = os.path.join(os.path.dirname(__file__), 'mycircles.sqlite')

# Create SQLite engine
engine = create_engine(f'sqlite:///{db_file}', echo=True)

# Create all tables defined in models.py
Base.metadata.create_all(engine)

print(f"SQLite database created at {db_file}")
