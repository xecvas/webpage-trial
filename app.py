import os
from flask import Flask, request, jsonify, redirect, send_from_directory, url_for, render_template, session
from datetime import timedelta
from sqlalchemy import Engine, create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base
from database import Product, SessionLocal, Base

# Initialize Flask app
app = Flask(__name__, template_folder="docs", static_folder="docs/resource")

# Configuration for session management
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"  # Use filesystem-based sessions
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)
app.secret_key = os.urandom(24)

# Serve static resource files from the 'resource' directory
@app.route("/resource/<path:path>")
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory("docs/resource", path)
    
@app.route('/add_product', methods=['POST'])
def add_product():
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

# Handle login functionality
@app.route("/")
@app.route("/login", methods=["GET", "POST"])
def login():
    # Check if user is already logged in
    if session.get("logged_in"):
        # Redirect to the main page if already logged in
        return redirect(url_for("main_page"))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        captcha_input = request.form.get("loginCaptchaInput")
        # Get the stored CAPTCHA text from the session
        captcha_hidden = session.get("loginCaptchaText")
        # Check if captcha is correct
        if captcha_input != captcha_hidden:
            return jsonify({"success": False, "error": "captcha"})
        # Check if username and password are correct
        if username == "user" and password == "123":
            session["logged_in"] = True
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    # Render the login page for GET requests
    return render_template("index.html")

# Display the main page for logged-in users
@app.route("/main")
def main_page():
    # Redirect to login page if user is not logged in
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    
    # Retrieve all products from the database
    db_session = SessionLocal()
    products = db_session.query(Product).all()
    db_session.close()

    # Pass the products to the HTML template
    return render_template("main.html", products=products)

@app.route("/test")
def testing():
    
    # Retrieve all products from the database
    db_session = SessionLocal()
    products = db_session.query(Product).all()
    db_session.close()

    # Pass the products to the HTML template
    return render_template("test.html", products=products)

# Log out the current user
@app.route("/logout", methods=["POST"])
def logout():
    try:
        # Clear the session to log the user out
        session.clear()
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        # Log the error and return an error message
        print(f"Error during logout: {e}")
        return jsonify({"message": "Error during logout"}), 500

if __name__ == "__main__":
    app.run(debug=True)
