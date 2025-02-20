from flask import Flask, request, jsonify
from classifier import DisasterClassifier
import re

app = Flask(__name__)
classifier = DisasterClassifier()

@app.route('/classify', methods=['POST'])
def classify_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        result = classifier.classify(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)