import flask
from flask import request, jsonify
import base64
import numpy as np
from PIL import Image
import io
import keras


app = flask.Flask(__name__)
#app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Home Page</h1>
<p>Collection of APIs.</p>'''


@app.route('/digit',methods=['POST'])
def find_digit():
    request_data = request.get_json()
    string = request_data['image_url']
    print(string)
    header, b64_string = string.split(",", 1)
    data = base64.b64decode(b64_string)
    im = Image.open(io.BytesIO(data)).convert("L").resize((28, 28))
    arr = np.array(im)
    arr = arr / 255.0
    im2arr = arr.reshape(1, 28, 28, 1)

    model = keras.models.load_model("conv_digit.h5")
    predict = np.argmax(model.predict(im2arr),axis=1)[0]
    print(predict)
    return jsonify(number=str(predict))

app.run()