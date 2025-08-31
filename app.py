from flask import Flask, request, jsonify
from flask_cors import CORS  # Allow frontend requests

app = Flask(__name__)
CORS(app)  # Enable CORS (Cross-Origin Resource Sharing)

# Predefined responses
responses = {
    "1": {"text": "Here's our official website: <a href='https://example.com' target='_blank'>Visit Here</a>"},
    "2": {"text": "Contact us at: support@example.com"},
    "3": {"text": "Check our FAQ section: <a href='https://example.com/faq' target='_blank'>FAQ Page</a>"},
    "4": {"text": "Follow us on Twitter: <a href='https://twitter.com/example' target='_blank'>Twitter</a>"},
}

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json  # Get user input
    user_choice = data.get("choice")

    if user_choice in responses:
        return jsonify({"response": responses[user_choice]})
    else:
        return jsonify({"response": {"text": "Invalid choice. Please select a valid option."}})

if __name__ == '__main__':
    app.run(debug=True)
