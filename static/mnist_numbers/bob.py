import numpy as np
#from matplotlib import pyplot as plt
import pandas as pd

from pathlib import Path

base_path = Path(__file__).parent  # Ordner, in dem main.py liegt

# Daten laden
# data_train = np.array(pd.read_csv(base_path / 'data' / 'train.csv'))
# data_test = np.array(pd.read_csv(base_path / 'data' / 'test.csv'))

# Form der Daten
# m_train, n_train = data_train.shape
# m_test, n_test = data_test.shape

# Labels sind erste Spalte
# Y_train = data_train[:, 0]  # alle Zeilen, erste Spalte
# X_train = data_train[:, 1:].T  # alle Zeilen, alle Spalten ab 1
# 
# Y_test = data_test[:, 0]
# X_test = data_test[:, 1:].T
# print(X_train.shape)
# for i in X_train:
#     for j in i:
#         if j > 0:
#             j = 255
# Normalisieren der Pixelwerte AHHHH
# X_train = X_train / 255.
# X_test = X_test / 255.

# Intitialisiertung zufälliger Startwerte für W und b
def init_params2():
    W1 = np.random.rand(10, 784) - 0.5
    b1 = np.random.rand(10, 1) -0.5
    W2 = np.random.rand(10, 10) - 0.5
    b2 = np.random.rand(10, 1) -0.5
    return W1, b1, W2, b2
def init_params():
    W1 = np.random.randn(10, 784) * np.sqrt(2.0/784) # Kleinere Gewichte, proportional zu gesammtzahl
    b1 = np.zeros((10, 1))               # Biases auf 0
    W2 = np.random.randn(10, 10) * 0.1
    b2 = np.zeros((10, 1))
    return W1, b1, W2, b2

def ReLU(Z):
    return np.maximum(0, Z) # Wow das ist cool. Das Maxium von 0 und Z.

# Softmax nimmt Aktivierungen des vorherigen Layers und wandelt sie in wahrscheinichkeiten um.
def softmax(Z):
    # Finde den größten Wert in jeder Spalte von Z
    # Das verhindert numerischen Überlauf
    shiftZ = Z - np.max(Z, axis=0, keepdims=True)
    expZ = np.exp(shiftZ)
    return expZ / np.sum(expZ, axis=0, keepdims=True)

def foreward_prop(W1, b1, W2, b2, X):
    # Die gewichtete Summe des ersten hidden layers mit Bias
    Z1 = W1.dot(X) + b1 # W1.dot(X) multipliziert die Gewichtsmatrix der ersten Schicht (10x784) mit den Eingaben (784xm) → Ergebnis ist (10 x m)

    # A1 ist ist die gewichtete Summe des ersten hidden layers mit ReLU
    A1 = ReLU(Z1)
    
    # Die gewichtete Summe des ersten hidden layers mit Bias
    Z2 = W2.dot(A1) + b2

    A2 = softmax(Z2)
    return Z1, A1, Z2, A2

# ein Array aus 0 außer eine 1 an der stelle wo es richtig ist
def one_hot(Y):
    one_hot_Y = np.zeros((Y.size, Y.max() + 1))
    one_hot_Y[np.arange(Y.size), Y] = 1
    one_hot_Y = one_hot_Y.T
    return one_hot_Y

def derive_ReLU(Z):
    return Z > 0

def back_prop(Z1, A1, Z2, A2, W2, X, Y):
    # Wobei Y die richtigen Lösungen sind
    m = Y.size # Wie viele Zahlen
    one_hot_Y = one_hot(Y) # Die Lösungen in One-Hot Kodiert

    # Differez zwischen des Ergebnisses des Netzes und dem erwarteten Ergebnis
    dZ2 = A2 - one_hot_Y

    # Berechnet den Gradienten derivative im Bezug auf W2. Also die Unterschiede werden mit den ReLU Zahlen A1 multit. 
    # Das zeigt wo der stärkst Einfluss auf welche Zahlen war.
    dW2 = 1 / m * dZ2.dot(A1.T)

    # summiert die Fehler dZ2 über die Trainingsbeispiele, um den durchschnittlichen Gradienten für jeden Bias zu erhalten
    db2 = 1 / m * np.sum(dZ2, axis=1, keepdims=True)

    dZ1 = W2.T.dot(dZ2) * derive_ReLU(Z1)

    dW1 = 1 / m * dZ1.dot(X.T)

    db1 = 1 / m * np.sum(dZ1, axis=1, keepdims=True)

    return dW1, db1, dW2, db2

# Updatet die Parameter mit einer Lernrate
def update_params(W1, b1, W2, b2, dW1, db1, dW2, db2, alpha):
    W1 = W1 - alpha * dW1
    b1 = b1 - alpha * db1
    W2 = W2 - alpha * dW2
    b2 = b2 - alpha * db2
    return W1, b1, W2, b2


def gradient_descent(X, Y, iterations, alpha):
    W1, b1, W2, b2 = init_params()
    for i in range(iterations):
        Z1, A1, Z2, A2 = foreward_prop(W1, b1, W2, b2, X)
        dW1, db1, dW2, db2 = back_prop(Z1, A1, Z2, A2, W2, X, Y)
        W1, b1, W2, b2 = update_params(W1, b1, W2, b2, dW1, db1, dW2, db2, alpha)
        if (i % 10 == 0):
            print("Interation: ", i)
            print("Accuracy: ", get_accuracy(get_predictions(A2), Y))
        # Füg das in gradient_descent ein:
        if (i % 100 == 0):
            loss = -np.mean(np.log(A2[Y, np.arange(Y.size)] + 1e-15))
            print(f"Iteration {i}, Loss: {loss:.4f}, Accuracy: {get_accuracy(get_predictions(A2), Y):.4f}")
    return W1, b1, W2, b2

def get_predictions(A2):
    return np.argmax(A2, 0)

def get_accuracy(predictions, Y):
    return np.sum(predictions == Y) / Y.size # das ist cool

def save_params(W1, b1, W2, b2):
    np.savez("trained_params.npz", W1=W1, b1=b1, W2=W2, b2=b2)



def train_model(iterations):
    W1, b1, W2, b2 = gradient_descent(X_train, Y_train, iterations, 0.1)
    save_params(W1, b1, W2, b2)
    print("Modell wurde trainiert und in 'trained_params.npz' gespeichert.")

def load_params(file_path="trained_params.npz"):
    """
    Lädt die gespeicherten Gewichte und Biases aus einer .npz-Datei.
    """
    try:
        data = np.load(base_path / file_path)
        W1 = data['W1']
        b1 = data['b1']
        W2 = data['W2']
        b2 = data['b2']
        print(f"Parameter erfolgreich aus '{file_path}' geladen.")
        return W1, b1, W2, b2
    except FileNotFoundError:
        print(f"Die Datei '{file_path}' wurde nicht gefunden.")
        return None, None, None, None


def make_prediction(X, W1, b1, W2, b2):
    # Macht eine vorhersage für einen gegebenen Input
    _, _, _, A2 = foreward_prop(W1, b1, W2, b2, X)

    prediction = get_predictions(A2)
    return prediction, A2

def show_prediction(image_data, true_label, predicted_label):
    """
    Zeigt ein einzelnes Bild mit seinem wahren Label und der Vorhersage an.
    
    Args:
        image_data (np.array): Das Bild als 1D-Array mit 784 Werten.
        true_label (int): Das korrekte Label.
        predicted_label (int): Das vom Modell vorhergesagte Label.
    """
    # 1. Forme das Bild in 28x28 um und skaliere die Werte zurück auf 0-255
    image_reshaped = image_data.reshape((28, 28)) * 255
    
    # 2. Zeige das Bild an
    plt.gray()
    plt.imshow(image_reshaped, interpolation='nearest')
    plt.title(f"Label: {true_label} | Prediction: {predicted_label}")
    plt.show()

if __name__ == '__main__':
    #W1, b1, W2, b2 = gradient_descent(X_train, Y_train, 500, 0.05)
    #save_params(W1, b1, W2, b2)
    W1, b1, W2, b2 = load_params()
    # if W1 is not None:
    #     wrong_predictions = []
    #     for i in range(0, Y_test.size):
    #         test_image = X_test[:, i].reshape(-1, 1)
    #         true_label = Y_test[i]
            
            
    #         # mache eine Prediction
    #         prediction = make_prediction(test_image, W1, b1, W2, b2)
    #         #print(prediction)
    #         if prediction[0] != true_label:
    #             wrong_predictions.append([prediction[0], true_label, i])


    #     if wrong_predictions:
    #         print(f"Das Modell hat {len(wrong_predictions)} von {Y_test.size} Fehler gemacht, mit einer {len(wrong_predictions) / Y_test.size} % Quote")
    #         print("-----------------------------------------------------------------")
    #         print("Zeige erstes Flasches Beispiel")

    #         predicted_label_of_wrong, true_label_of_wrong, wrong_index = wrong_predictions[2]
            
    #         # 2. Hole dir das dazugehörige Bild aus dem Datensatz
    #         image_to_show = X_test[:, wrong_index]
            
    #         # 3. Rufe show_prediction mit den korrekten Daten auf
    #         show_prediction(image_to_show, true_label_of_wrong, predicted_label_of_wrong)