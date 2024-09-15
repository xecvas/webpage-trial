from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"

# Create a SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define the Product model
class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    nama_pengguna = Column(String, nullable=False)
    nama_barang = Column(String, nullable=False)
    kode = Column(String, nullable=False, unique=True)
    quantity = Column(Integer, nullable=False)
    berat = Column(Float, nullable=False)
    harga = Column(Integer, nullable=False)
    shipping_status = Column(String, nullable=False)
    payment_status =  Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nama_pengguna': self.nama_pengguna,
            'nama_barang': self.nama_barang,
            'kode': self.kode,
            'quantity': self.quantity,
            'berat': self.berat,
            'harga': self.harga,
            'shipping_status':  self.shipping_status,
            'payment_status': self.payment_status
        }

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Session factory
SessionLocal = sessionmaker(bind=engine)
