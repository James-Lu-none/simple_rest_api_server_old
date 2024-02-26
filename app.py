from flask import Flask, jsonify

app = Flask(__name__)
isPcOn = False

@app.route('/api/isPcOn', methods=['GET'])
def get_isPcOn():
    return jsonify({"isPcOn": isPcOn})

@app.route('/api/isPcOn/setTrue', methods=['POST'])
def set_isPcOn():
    global isPcOn
    try:
        # Assuming the value is sent as JSON in the request body
        data = request.json
        value = data.get('value')  # 'increment' or 'decrement'
        
        if value == 'true' or value == '1':
            isPcOn = True
        if value == 'true' or value == '0':
            isPcOn = False
        else:
            return jsonify({"error": "Invalid operation"}), 400

        return jsonify({"isPcOn": isPcOn, "message": f"isPcOn was set to {value}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='192.168.0.50', port=5000, debug=True)