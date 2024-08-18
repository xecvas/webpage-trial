from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route("/")
def default_page():
    return send_from_directory('./', 'src/index.html')

@app.route("/about")
def about_page():
    return send_from_directory('./', 'src/index.html')

@app.route("/help")
def hhelp_page():
    return send_from_directory('./', 'src/main.html')

@app.route("/test")
def test_page():
    return send_from_directory('./', 'src/test.html')

@app.route('/resource/<path:path>')
def send_resource(path):
    return send_from_directory('resource', path)

if __name__ == "__main__":
    app.run()