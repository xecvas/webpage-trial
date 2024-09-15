import os
from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for
from sqlalchemy.orm import sessionmaker
from database import Product, SessionLocal

# Initialize Flask app
app = Flask(__name__, template_folder="docs", static_folder="docs/resource")
app.secret_key = os.urandom(24)  # Secure secret key for session management

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
@app.route("/test")
def test():
    session = SessionLocal()
    products = session.query(Product).all()
    session.close()
    return render_template("test.html", products=products)

if __name__ == "__main__":
    app.run(debug=True)