from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the absolute path to the model files
diabetes_model_path = os.path.join(os.path.dirname(__file__), 'diabetes_model.sav')
parkinsons_model_path = os.path.join(os.path.dirname(__file__), 'parkinsons_model.sav')

# Load the trained models
try:
    diabetes_model = joblib.load(diabetes_model_path)
    print("Diabetes model loaded successfully from:", diabetes_model_path)
except Exception as e:
    print(f"Error loading diabetes model: {e}")
    diabetes_model = None

try:
    parkinsons_model = joblib.load(parkinsons_model_path)
    print("Parkinson's model loaded successfully from:", parkinsons_model_path)
except Exception as e:
    print(f"Error loading Parkinson's model: {e}")
    parkinsons_model = None

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    try:
        if diabetes_model is None:
            return jsonify({'error': 'Model not loaded. Please check if diabetes_model.sav exists.'}), 500

        # Get data from request
        data = request.get_json()
        
        # Create a DataFrame with the correct feature names
        features_df = pd.DataFrame([{
            'Pregnancies': float(data['pregnancies']),
            'Glucose': float(data['glucose']),
            'BloodPressure': float(data['blood_pressure']),
            'SkinThickness': float(data['skin_thickness']),
            'Insulin': float(data['insulin']),
            'BMI': float(data['bmi']),
            'DiabetesPedigreeFunction': float(data['diabetes_pedigree']),
            'Age': float(data['age'])
        }])
        
        # Make prediction
        prediction = diabetes_model.predict(features_df)[0]
        
        # Prepare response
        result = {
            'prediction': int(prediction),
            'message': 'Positive for diabetes' if prediction == 1 else 'Negative for diabetes'
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/predict/parkinsons', methods=['POST'])
def predict_parkinsons():
    try:
        if parkinsons_model is None:
            return jsonify({'error': 'Model not loaded. Please check if parkinsons_model.sav exists.'}), 500

        # Get data from request
        data = request.get_json()
        
        # Create a DataFrame with the correct feature names
        features_df = pd.DataFrame([{
            'MDVP:Fo(Hz)': float(data['mdvp_fo']),
            'MDVP:Fhi(Hz)': float(data['mdvp_fhi']),
            'MDVP:Flo(Hz)': float(data['mdvp_flo']),
            'MDVP:Jitter(%)': float(data['mdvp_jitter']),
            'MDVP:Jitter(Abs)': float(data['mdvp_jitter_abs']),
            'MDVP:RAP': float(data['mdvp_rap']),
            'MDVP:PPQ': float(data['mdvp_ppq']),
            'Jitter:DDP': float(data['jitter_ddp']),
            'MDVP:Shimmer': float(data['mdvp_shimmer']),
            'MDVP:Shimmer(dB)': float(data['mdvp_shimmer_db']),
            'Shimmer:APQ3': float(data['shimmer_apq3']),
            'Shimmer:APQ5': float(data['shimmer_apq5']),
            'MDVP:APQ': float(data['mdvp_apq']),
            'Shimmer:DDA': float(data['shimmer_dda']),
            'NHR': float(data['nhr']),
            'HNR': float(data['hnr']),
            'RPDE': float(data['rpde']),
            'DFA': float(data['dfa']),
            'spread1': float(data['spread1']),
            'spread2': float(data['spread2']),
            'D2': float(data['d2']),
            'PPE': float(data['ppe'])
        }])
        
        # Make prediction
        prediction = parkinsons_model.predict(features_df)[0]
        
        # Prepare response
        result = {
            'prediction': int(prediction),
            'message': 'Positive for Parkinson\'s disease' if prediction == 1 else 'Negative for Parkinson\'s disease'
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'diabetes_model_loaded': diabetes_model is not None,
        'parkinsons_model_loaded': parkinsons_model is not None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 