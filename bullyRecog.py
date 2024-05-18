import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify, render_template
from sklearn.linear_model import LogisticRegression
import pickle
filepath = "C:/Users/hp/Programming/MontyHacks/cyberbullyingData.csv"
df = pd.read_csv(filepath)
for index, row in df.iterrows():
  if (row['Label']!=row['Label']):
    row['Label'] = "Not-Bullying"
  notIncluded = (row['Label']).find("Not")
  df.at[index,'Label']=1
  if (row['Label']=="Not-Bullying" or notIncluded !=-1):
    df.at[index, 'Label']=0

sentences = df['Text'].values
y = df['Label'].values
sentences_train, sentences_test, y_train, y_test = train_test_split(sentences, y, test_size=0.25, random_state=1000)
vectorizer = CountVectorizer()
vectorizer.fit(sentences_train)
y_train = y_train.astype('int')
y_test = y_test.astype('int')
X_train = vectorizer.transform(sentences_train)
X_test = vectorizer.transform(sentences_test)
document = ["bro it's not that hard, are you dumb?",
            " ",
            "i hate it when the test is hard",
            "bros actually stupid"]
doc_y = [0, 0, 0, 1]
vector = vectorizer.transform(document)
classifier = LogisticRegression(max_iter=100000)
classifier.fit(X_train, y_train)
score = classifier.score(X_test, y_test)
print('Accuracy for data:', score)
attempt = classifier.predict(vector)
print('attempt', attempt)
pkl_filename = "pickle_model.pkl"
with open(pkl_filename, 'wb') as file:
    pickle.dump(classifier, file)

# Load from file
with open(pkl_filename, 'rb') as file:
    pickle_model = pickle.load(file)

# Calculate the accuracy score and predict target values
score = pickle_model.score(X_test, y_test)
print("Test score: {0:.2f} %".format(100 * score))
Ypredict = pickle_model.predict(X_test)
app = Flask(__name__) # Initialize the flask App
model = pickle.load(open('pickle_model.pkl', 'rb')) # Load the trained model

@app.route('/') # Homepage
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # UI rendering the results
    # Retrieve values from a form
    data = request.get_json()
    print('data', data)
    stringAlt = ["bro it's not that hard, are you dumb?", data["text"]]
    final_features = vectorizer.transform(stringAlt)
    prediction = model.predict(final_features) # Make a prediction
    print('predcition', prediction, type(prediction))
    return str(prediction[1]) # Render the predicted result


if __name__ == "__main__":
    app.run(debug=True)