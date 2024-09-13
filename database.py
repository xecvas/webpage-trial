from sqlalchemy import Float, create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define database URL with credentials
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"

# Create a SQLAlchemy engine instance
engine = create_engine(DATABASE_URL)

# Define the base class for declarative class definitions
Base = declarative_base()

# Define the Product model
class Product(Base):
    """
    Represents a product in the database
    """
    __tablename__ = 'products'

    # Define columns for the Product model
    id = Column(Integer, primary_key=True)  # Unique identifier for each product
    nama_pengguna = Column(String, nullable=False)  # User name
    nama_barang = Column(String, nullable=False)  # Product name
    kode = Column(String, nullable=False, unique=True)  # Unique product code
    quantity = Column(Integer, nullable=False)  # Product quantity
    berat = Column(Float, nullable=False)  # Product weight
    harga = Column(Integer, nullable=False)  # Product price

    # Define a method to convert the Product instance to a dictionary
    def to_dict(self):
        """
        Returns a dictionary representation of the Product instance
        """
        return {
            'nama_pengguna': self.nama_pengguna,
            'nama_barang': self.nama_barang,
            'kode': self.kode,
            'quantity': self.quantity,
            'berat': self.berat,
            'harga': self.harga
        }

# Create tables in the database if they do not already exist
Base.metadata.create_all(bind=engine)

# Create a session maker instance
SessionLocal = sessionmaker(bind=engine)