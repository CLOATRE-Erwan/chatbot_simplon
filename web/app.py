from flask import Flask, render_template, request, url_for, flash, redirect,jsonify
import pandas as pd 
from flask import make_response
import tensorflow as tf
import string
import numpy as np
import json
import requests
from tensorflow.keras.preprocessing.text import Tokenizer,tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcdefgh'
with open('data/tokenizer.json') as f:
    data=json.load(f)
    tokenizer=tokenizer_from_json(data)
@app.route('/')
def index():

    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
   message = None
   if request.method == 'POST':
        datafromjs = request.form['mydata']
        texts_p = []
        prediction_input = datafromjs

        prediction_input = [letters.lower() for letters in prediction_input if letters not in string.punctuation]
        prediction_input = ''.join(prediction_input)
        texts_p.append(prediction_input)

        prediction_input = tokenizer.texts_to_sequences(texts_p)
        prediction_input = np.array(prediction_input).reshape(-1)
        prediction_input = pad_sequences([prediction_input],10)
        print(prediction_input)
        resp = make_response(json.dumps(prediction_input.tolist()[0]))
        resp.headers['Content-Type'] = "application/json"
        return resp
        return render_template('index.html', message='')



@app.route('/api', methods=['GET', 'POST'])
def api():
   message = None
   if request.method == 'POST':
        url = request.form['mydata']
        response = requests.get(url)
        return response.json()

if __name__ == "__main__":
    app.run()
