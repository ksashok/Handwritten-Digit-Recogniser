import flask
from flask import request, jsonify, render_template
from flask_cors import CORS
import base64
import numpy as np
from PIL import Image
import io
import keras


app = flask.Flask(__name__)
CORS(app)
#app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


@app.route('/digit',methods=['POST'])
def find_digit():
    request_data = request.get_json()
    string = request_data['image_url']
    header, b64_string = string.split(",", 1)
    data = base64.b64decode(b64_string)
    im = Image.open(io.BytesIO(data)).convert("L").resize((28, 28))
    arr = np.array(im)
    arr = arr / 255.0
    im2arr = arr.reshape(1, 28, 28, 1)

    model = keras.models.load_model("conv_digit.h5")
    predict = np.argmax(model.predict(im2arr),axis=1)[0]
    print(predict)
    keras.backend.clear_session()
    number = {'0':'Zero', '1': 'One', '2':'Two', '3':'Three', '4':'Four', '5':'Five', '6':'Six', '7':'Seven', '8':"Eight", '9':'Nine'}
    response = jsonify(number=number[str(predict)])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run()