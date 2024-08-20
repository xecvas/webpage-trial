from flask import Flask, request, send_from_directory, render_template, abort

# Create the web server
app = Flask(__name__, template_folder='docs')

# Send resource files (e.g. images, CSS, JS)
@app.route('/resource/<path:path>')
def send_resource(path):
    """Send a resource file from the 'resource' directory."""
    return send_from_directory('resource', path)

# Send the default page
@app.route("/")
@app.route("/login")
def default_page():
    """Send the default page."""
    return render_template("index.html")

# Send the help page
@app.route("/help")
def help_page():
    """Send the help page."""
    return render_template('main.html')

# Send the test page
@app.route("/test")
def test_page():
    """Send the test page."""
    return render_template('test.html')

# Send the about page
@app.route("/about")
def about_page():
    """Send the about page."""
    return render_template('main.html')

# Catch all other URLs and return a 404 error
@app.errorhandler(404)
def page_not_found(error):
    """Handle 404 errors."""
    return 'Page Not Found', 404


# # Catch all other URLs and return a 404 error
# @app.route('/<path:subpath>')
# def catch_all(subpath):
#     """Catch all other URLs and return a 404 error."""
#     if not any(char in subpath for char in '?#'):
#         abort(404)
#     return abort(404)

# Run the web server
if __name__ == "__main__":
    app.run(debug=True)