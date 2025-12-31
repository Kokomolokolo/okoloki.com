from flask import Flask, render_template, request, jsonify
from  import load_params, make_prediction
import numpy as np

app = Flask(__name__)

W1, b1, W2, b2 = load_params()


@app.route('/')
def home():
    return render_template("mnist.html")

@app.route('/c')
def cheat_cheat():
    return render_template('canvas_cheatsheat.html')

@app.route('/bobwasistdas', methods = ['POST'])
def predict():
    W1, b1, W2, b2 = load_params()
    try:
        data = request.get_json()
        imgDataArray = np.array(data["image"])
        imgDataArray = imgDataArray.reshape(784, 1) / 255.

        prediction, A2 = make_prediction(imgDataArray, W1, b1, W2, b2)

        confidences = A2.flatten().tolist()
        return jsonify({
            "predicted": int(prediction),
            "confidences": confidences
        })    
    except Exception as e:
        import traceback
        traceback.print_exc()  # Ausgabe im Server-Terminal
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
