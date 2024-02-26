from flask import Flask, jsonify

app = Flask(__name__)
isPcOn = False

@app.route('/api/isPcOn', methods=['GET'])
def get_items():
    return jsonify({"isPcOn": isPcOn})

if __name__ == '__main__':
    app.run(host='192.168.0.50', port=5000, debug=True)