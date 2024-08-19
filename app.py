from flask import Flask, send_from_directory

# Create the web server
app = Flask(__name__)

# Send resource files (e.g. images, CSS, JS)
@app.route('/resource/<path:path>')
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory('resource', path)

# Send the default page
@app.route("/")
def default_page():
    """Send the default page."""
    return send_from_directory('.', 'index.html')

# Send the help page
@app.route("/help")
def help_page():
    """Send the help page."""
    return send_from_directory('./', 'src/main.html')

# Send the test page
@app.route("/test")
def test_page():
    """Send the test page."""
    return send_from_directory('./', 'src/test.html')

# Send the about page
@app.route("/about")
def about_page():
    """Send the about page."""
    return send_from_directory('./', 'src/main.html')

# Catch all other URLs and return a 404 error
@app.route('/<path:path>')
def catch_all(path):
    """Catch all other URLs and return a 404 error."""
    if path not in ['help', 'index', 'about', 'test']:
        return 'Page Not Found', 404

# Run the web server
if __name__ == "__main__":
    app.run(debug=True)
