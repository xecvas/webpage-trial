import os

from flask import Flask, send_file

app = Flask(__name__)

@app.route("/test")
def index():
  print(path)
  return send_file('test.html')

def main():
    app.run(port=int(os.environ.get('PORT', 800)))

if __name__ == "__main__":
    main()
