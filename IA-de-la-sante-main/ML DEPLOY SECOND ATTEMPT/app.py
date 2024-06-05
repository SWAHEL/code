import numpy as np
from flask import Flask, request, render_template, redirect, url_for, flash
import pickle
from flask_sqlalchemy import SQLAlchemy
import os

# Create Flask app
flask_app = Flask(__name__)
flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///analyses.db'
flask_app.config['UPLOAD_FOLDER'] = 'uploads'
flask_app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with your secret key
db = SQLAlchemy(flask_app)

# Load the trained model
model = pickle.load(open("breast_cancer_model.pkl", "rb"))

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    radius_mean = db.Column(db.Float, nullable=False)
    texture_mean = db.Column(db.Float, nullable=False)
    # Add other fields as necessary

@flask_app.route("/")
def home():
    return render_template("analyse.html")

@flask_app.route("/predict", methods=["POST"])
def predict():
    float_features = [float(x) for x in request.form.values()]
    features = np.array(float_features).reshape(1, -1)
    prediction = model.predict(features)
    diagnosis = "Malignant" if prediction[0] == 1 else "Benign"
    return render_template("analyse.html", prediction_text="The predicted diagnosis is {}".format(diagnosis))

@flask_app.route('/add_analysis')
def add_analysis():
    return render_template('add_analysis.html')

@flask_app.route('/add_analysis', methods=['POST'])
def add_analysis_post():
    radius_mean = request.form['radius_mean']
    texture_mean = request.form['texture_mean']
    # Get other fields as necessary
    new_analysis = Analysis(radius_mean=radius_mean, texture_mean=texture_mean)
    db.session.add(new_analysis)
    db.session.commit()
    flash("Analysis added successfully!")
    return redirect(url_for('add_analysis'))

@flask_app.route('/upload_analysis', methods=['POST'])
def upload_analysis():
    if 'analysis_file' not in request.files:
        flash("No file part")
        return redirect(url_for('add_analysis'))
    
    file = request.files['analysis_file']
    if file.filename == '':
        flash("No selected file")
        return redirect(url_for('add_analysis'))
    
    if file:
        filepath = os.path.join(flask_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        with open(filepath, 'r') as f:
            for line in f:
                data = line.strip().split(',')
                if len(data) < 2:
                    continue
                try:
                    radius_mean = float(data[0])
                    texture_mean = float(data[1])
                    # Parse other fields as necessary
                except ValueError:
                    continue
                new_analysis = Analysis(radius_mean=radius_mean, texture_mean=texture_mean)
                db.session.add(new_analysis)
        
        db.session.commit()
        os.remove(filepath)
        flash("File uploaded and analyses added successfully!")
    return redirect(url_for('add_analysis'))

if __name__ == "__main__":
    db.create_all()
    flask_app.run(debug=True)
