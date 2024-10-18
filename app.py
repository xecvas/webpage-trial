import os
from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, session, url_for, send_file
from io import BytesIO
import pandas as pd
from sqlalchemy.orm import sessionmaker
from database import Product, SessionLocal

# Initialize Flask app
app = Flask(__name__, template_folder="docs", static_folder="docs/resource")
app.secret_key = os.urandom(24)  # Secure secret key for session management

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Serve static resource files from the 'resource' directory
@app.route("/resource/<path:path>")
def send_resource(path):
    return send_from_directory("docs/resource", path)

# Add data to the database
@app.route('/add_product', methods=['POST'])
def add_product():
    """Add a new product to the database."""
    # Extract form data
    nama_pengguna = request.form.get('namapengguna') 
    nama_barang = request.form.get('namabarang')
    kode = request.form.get('kode')
    quantity = request.form.get('quantity', type=int)
    berat = request.form.get('berat', type=float)
    harga = request.form.get('harga', type=int)
    shipping_status = request.form.get('shippingstatus')
    payment_status = request.form.get('paymentstatus')

    # Validate form data
    if not all([nama_pengguna, nama_barang, kode]) or quantity is None or berat is None or harga is None or  shipping_status is None or payment_status is None:
        return "All fields are required", 400
    
    # Create a new product record
    new_product = Product(
        nama_pengguna=nama_pengguna,
        nama_barang=nama_barang,
        kode=kode,
        quantity=quantity,
        berat=berat,
        harga=harga,
        shipping_status=shipping_status,
        payment_status=payment_status
    )

    session = SessionLocal()
    try:
        session.add(new_product)
        session.commit()
        return redirect(url_for('test'))  # Redirect or render a success template
    except Exception as e:
        session.rollback()
        return f"An error occurred: {e}", 500
    finally:
        session.close()

# Delete a product from the database
@app.route('/delete_product/<int:id>', methods=['POST'])
def delete_product(id):
    """Delete a product by ID."""
    session = SessionLocal()
    try:
        product = session.query(Product).get(id)
        if product is None:
            return "Product not found", 404
        session.delete(product)
        session.commit()
        return redirect(url_for('test'))  # Redirect or render a success template
    except Exception as e:
        session.rollback()
        return f"An error occurred: {e}", 500
    finally:
        session.close()

@app.route("/get_product/<int:id>", methods=["GET"])
def get_product(id):
    db = next(get_db())  # Get a new database session
    product = db.query(Product).filter(Product.id == id).first()

    if product:
        return jsonify(product.to_dict())  # Use the model's `to_dict` method to return JSON
    else:
        return jsonify({'error': 'Product not found'}), 404



# Get data from the database with pagination
@app.route('/data', methods=['GET'])
def get_data():
    session = SessionLocal()
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        offset = (page - 1) * per_page
        search_value = request.args.get('search[value]', '')  # Get the search value

        # Base query
        query = session.query(Product)

        # If there's a search value, filter the query
        if search_value:
            search_value = f"%{search_value}%"
            query = query.filter(
                Product.nama_pengguna.ilike(search_value) |  # Search in 'nama_pengguna'
                Product.nama_barang.ilike(search_value) |   # Search in 'nama_barang'
                Product.kode.ilike(search_value)            # Search in 'kode'
            )

        # Paginate and count rows
        total_rows = query.count()
        products_query = query.limit(per_page).offset(offset)

        data = [product.to_dict() for product in products_query]

        response = {
            'data': data,
            'recordsTotal': total_rows,
            'recordsFiltered': total_rows,  # Adjust if using filters
            'page': page
        }
        return jsonify(response)
    finally:
        session.close()

# Display the main page
@app.route("/")
@app.route("/main")
def main_page():
    return render_template("main.html")

# Test route rendering products in HTML template
@app.route('/test', methods=['GET', 'POST'])
def test():
    session = SessionLocal()

    # Handle form submission (POST request)
    if request.method == 'POST':
        # Capture the form data
        product_id = request.form.get('id')  # Hidden field with product ID
        nama_pengguna = request.form.get('nama_pengguna')
        nama_barang = request.form.get('nama_barang')
        kode = request.form.get('kode')
        quantity = request.form.get('quantity')
        berat = request.form.get('berat')
        harga = request.form.get('harga')
        shipping_status = request.form.get('shippingstatus')
        payment_status = request.form.get('paymentstatus')

        # Query the product by ID and update its details
        product = session.query(Product).filter(Product.id == product_id).first()
        if product:
            product.nama_pengguna = nama_pengguna
            product.nama_barang = nama_barang
            product.kode = kode
            product.quantity = quantity
            product.berat = berat
            product.harga = harga
            product.shipping_status = shipping_status
            product.payment_status = payment_status

            # Commit the changes to the database
            session.commit()

            # Optionally redirect back to the test page or elsewhere
            return redirect(url_for('test'))  # Redirect to avoid resubmission
        else:
            return "Product not found", 404

    # Handle GET request - Render the page with all products
    products = session.query(Product).all()
    session.close()

    return render_template("test.html", products=products)

@app.route('/export_excel')
def export_excel():
    # Create a new session to query the database
    session = SessionLocal()
    try:
        # Query the data from the database
        records = session.query(
            Product.id,
            Product.nama_pengguna,
            Product.nama_barang,
            Product.kode,
            Product.quantity,
            Product.berat,
            Product.harga,
            Product.shipping_status,
            Product.payment_status
        ).all()

        # Convert the SQLAlchemy query result to a list of dictionaries
        data = [
            {
                'ID': record.id,
                'Nama Pengguna': record.nama_pengguna,
                'Nama Barang': record.nama_barang,
                'Kode': record.kode,
                'Quantity': record.quantity,
                'Berat': record.berat,
                'Harga': record.harga,
                'Shipping Status': record.shipping_status,
                'Payment Status': record.payment_status,
            }
            for record in records
        ]

        # Use pandas to create a DataFrame
        df = pd.DataFrame(data)

        # Create an in-memory Excel file
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Data')

        output.seek(0)  # Move to the beginning of the stream

        # Send the Excel file as a response
        return send_file(
            output,
            as_attachment=True,
            download_name='data_export.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    finally:
        # Close the session
        session.close()

if __name__ == "__main__":
    app.run(debug=True)