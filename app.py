import os
from flask import Flask, request, render_template, jsonify, send_from_directory, session, redirect, url_for

app = Flask(__name__, template_folder='docs', static_folder='docs/resource')
app.secret_key = os.urandom(24)

# Serve static resource files from the 'resource' directory
@app.route('/resource/<path:path>')
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory('docs/resource', path)

# Handle login functionality
@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    # ...
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        captcha_input = request.form.get('loginCaptchaInput')

        # Get the stored CAPTCHA text from the session
        captcha_hidden = session.get('loginCaptchaText')

        # Check if captcha is correct
        if captcha_input != captcha_hidden:
            return jsonify({'success': False, 'error': 'captcha'})

        # Check if username and password are correct
        if username == "user" and password == "123":
            session['logged_in'] = True
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})

    # Render the login page for GET requests
    return render_template('index.html')

# Display the main page for logged-in users
@app.route('/main')
def main_page():
    # Redirect to login page if user is not logged in
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('main.html')

# Log out the current user
@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        # Log the error and return an error message
        print(f"Error during logout: {e}")
        return jsonify({"message": "Error during logout"}), 500

if __name__ == "__main__":
    app.run(debug=True)