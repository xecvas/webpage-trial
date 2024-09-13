# Import necessary modules
from itertools import product
import math
import os
from flask import Flask, request, jsonify, redirect, send_from_directory, url_for, render_template, session
from datetime import timedelta
from sqlalchemy import Engine, create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base
from database import Product, SessionLocal, Base

# Initialize Flask app
app = Flask(__name__, template_folder="docs", static_folder="docs/resource")

# Set secret key for session management
app.secret_key = os.urandom(24)

# Serve static resource files from the 'resource' directory
@app.route("/resource/<path:path>")
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory("docs/resource", path)

# Set up database connection
DATABASE_URL = "postgresql+psycopg://postgres:mashiro@localhost/mydatabase"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Get data from database with pagination
@app.route('/data', methods=['GET'])
def get_data():
    """Get data from database with pagination."""
    session = Session()
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        offset = (page - 1) * per_page

        # Query the database
        query = session.query(Product).limit(per_page).offset(offset)
        total_rows = session.query(Product).count()  # Get the total count of rows

        # Serialize the data using the to_dict method
        data = [row.to_dict() for row in query]  # Convert each row to a dictionary

        # Prepare the response to fit DataTable's expected format
        response = {
            'data': data,
            'recordsTotal': total_rows,
            'recordsFiltered': total_rows,  # Adjust if you have filters
            'page': page,
            'pages': math.ceil(total_rows / per_page)
        }
        return jsonify(response)
    finally:
        session.close()  # Ensure the session is closed after the request

# Add data to database
@app.route('/add_product', methods=['POST'])
def add_product():
    """Add a new product to the database."""
    # Extract form data
    nama_pengguna = request.form.get('namaPengguna') 
    nama_barang = request.form.get('namaBarang')
    kode = request.form.get('kode')
    quantity = request.form.get('quantity', type=int)
    berat = request.form.get('berat', type=float)
    harga = request.form.get('harga', type=int)

    # Validate form data
    if not all([nama_pengguna, nama_barang, kode]) or quantity is None or berat is None or harga is None:
        return "All fields are required", 400
    
    # Create a new product record
    new_product = Product(
        nama_pengguna=nama_pengguna,
        nama_barang=nama_barang,
        kode=kode,
        quantity=quantity,
        berat=berat,
        harga=harga
    )

    # Save to the database
    db_session = SessionLocal()
    try:
        db_session.add(new_product)
        db_session.commit()
        return redirect(url_for('testing'))  # Redirect or render a success template
    except Exception as e:
        db_session.rollback()
        return f"An error occurred: {e}", 500
    finally:
        db_session.close()

# Display the main page for logged-in users
@app.route("/")
@app.route("/main")
def main_page():
    return render_template("main.html")

@app.route("/test")
def testing():
    """Test page."""
    # Retrieve all products from the database
    db_session = SessionLocal()
    products = db_session.query(Product).all()
    db_session.close()

    # Pass the products to the HTML template
    return render_template("test.html", products=products)

if __name__ == "__main__":
    app.run(debug=True)