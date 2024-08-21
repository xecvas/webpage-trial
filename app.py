from flask import Flask, request, render_template, jsonify, send_from_directory, session, redirect, url_for

app = Flask(__name__, template_folder='docs')
app.secret_key = 'your_secret_key'  # Replace with your actual secret key

# Send resource files (e.g., images, CSS, JS)
@app.route('/resource/<path:path>')
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory('resource', path)

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        captcha_input = request.form.get('loginCaptchaInput')
        captcha_hidden = request.form.get('loginCaptchaHidden')

        if captcha_input != captcha_hidden:
            return jsonify({'success': False, 'error': 'captcha'})
        
        if username == "user" and password == "123":
            session['logged_in'] = True
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})

    return render_template('index.html')

@app.route('/main')
def main_page():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('main.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)
