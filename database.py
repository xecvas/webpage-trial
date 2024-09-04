from sqlalchemy import create_engine, Column, Integer, String, Float, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLAlchemy Database Configuration
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"  # Update with your credentials

# Set up SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)

Base = declarative_base()

# Define the Product model with extend_existing=True
# Define the Product model
class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    nama_pengguna = Column(String, nullable=False)
    nama_barang = Column(String, nullable=False)
    kode = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    berat = Column(Float, nullable=False)
    harga = Column(Integer, nullable=False)
    
# Create tables in the database if they do not already exist
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)