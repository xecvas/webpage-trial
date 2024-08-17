from flask import Flask, redirect, url_for

app = Flask(__name__, static_folder='src', static_url_path='')

@app.route('/about')
def about():
  return redirect(url_for('index'))

@app.route('/')
def index():
  return redirect(url_for('static', filename='index.html'))

if __name__ == '__main__':
  app.run(debug=True)
