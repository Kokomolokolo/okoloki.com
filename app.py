from flask import Flask, jsonify, request, render_template, session, make_response, redirect, url_for, abort, send_from_directory
import psycopg2
from flask_cors import CORS, cross_origin
from flask_session import Session

# to hide specific keys in a .env file
from dotenv import load_dotenv
import os

# loads the .env file
load_dotenv("keys.env")

app = Flask(__name__, template_folder='templates')

user = None

app.secret_key = os.getenv("APP_SECRET_KEY")

app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config["SESSION_COOKIE_DOMAIN"] = ".okoloki.com"

# Enable CORS with credentials support
CORS(app,
     supports_credentials=True,
     origins=["https://okoloki.com", "https://www.okoloki.com", "http://localhost:8000", "http://127.0.0.1:8000"],
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"])

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response, 200
def cookie_check(redirected_site):
    user_data = session.get('user')
    if user_data:
       username = user_data.get('username')  # Retrieves the username from the session data.
       return render_template(redirected_site, username=username)
    return redirect(url_for('loginPage'))

def render_with_name(rendered_site): # nimmt username mit für homepage hello screen
    user_data = session.get('user')
    username = user_data.get('username') if user_data else None  # Retrieves the username from the session data.
    return render_template(rendered_site, username=username)

def admin_check():
    user_data = session.get('user')
    print("DEBUG - session user:", user_data)
    if user_data and user_data.get('username') in ['admin']:
        return True
    return False

@app.context_processor
def inject_user():
    session_user = session.get("user")
    return dict(
        user=session_user,
        username=session_user["username"] if session_user else None
    )

# intieren der db, ist kann jemand löschen wenn jemand das sieht wenn es funktioniert.
def init_db():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scores_eoto (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                survival_time DECIMAL(10, 3) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        print("Table 'scores_eoto' created successfully!, 200")
    except Exception as e:
        print(f"Errors{e}")
    finally:
        print("aldjfalsdfj")
        cursor.close()
        conn.close()

def get_connection():
    try:
        connection = psycopg2.connect(
            dbname="data",   # Replace with your database name
            user="okoloki",
	        password=os.getenv("DATABASE_PASSWORD"),         # Replace with your username
            host="localhost",             # Replace with your host
            port="5432"                   # Replace with your port
        )
        connection.autocommit = True
        return connection
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None

# default route
@app.route('/')
def index():
    return render_with_name('Homepage.html')

@app.route('/login_site')
def loginPage():
    return render_with_name('login.html')

@app.route('/account')
def account():
    return render_with_name('account.html')

@app.route('/Blackjack')
def Blackjack():
    return render_with_name('bjr.html')

@app.route('/Encrypter')
def Encrypter():
    return render_with_name('encrypt_web.html')

@app.route('/Pong')
def Pong():
    return render_with_name('pong.html')

@app.route('/Game')
def Game():
    return render_with_name('game.html')

@app.route('/Imposter')
def Imposter():
    return render_with_name('guessGame.html') # Weiß nicht wieso das so heißt aber ist das imposter game wenn ich du wäre würde ich jetzt den namen ändern

@app.route('/Catmemory')
def Catmemory():
    return render_with_name('cat_memory.html')

@app.route('/Register')
def Register():
    return render_with_name('register.html')

@app.route('/Second')
def Second():
    return render_with_name('second_page.html')

@app.route('/Account')
def AccountPage():
    return render_with_name('account.html')

@app.route('/particalsim') # so schreibt man nicht particle 
def partical_sim():
    return render_with_name('partical_sim.html')

@app.route('/particalsim_3d')
def particle_sim_3d():
    return render_with_name('particle_sim_3d.html')

@app.route('/test_feature')
def testSite():
    if admin_check():
        return render_template('index.html')

@app.route('/office')
def office():
    return render_with_name('errorsoftheoffice.html')

@app.route('/mnist')
def mnist():
    return render_with_name('mnist.html')

@app.route('/falling_sand')
def falling_sand():
    return render_with_name('falling_sand.html')

@app.route('/login-warn')
def login_splash():
    return render_with_name('login_splash_screen.html')

@app.route('/planet_sim')
def planet_sim():
    return render_with_name('planet_sim.html')

@app.route('/game_of_life')
def game_of_life():
    return render_with_name('game_of_life.html')

@app.route('/boid_sim')
def boid_sim():
    return render_with_name('boid_swarm_sim.html')

@app.route('/voxxel_engine')
def voxxel_engine():
    return render_with_name('voxxel_engine.html')

@app.route('/winter_game')
def bevy_winter():
    return render_with_name('bevy_winter.html')

@app.route('/soccer_surfer')
def soccer_surfer():
    return render_with_name('soccer_surfer.html')

@app.route('/session_info')
def session_info():
    session_cookie = request.cookies.get('session')
    return session_cookie

# Route für Assets
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

# Route für WASM/JS (die müssen im static/ Ordner liegen)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# create table
@app.route('/create_table', methods=['GET'])
def create_table():
    connection = get_connection()
    if connection is None:
        return "Database connection failed", 500
    try:
        cursor = connection.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
        """
        cursor.execute(create_table_query)
        connection.commit()
        return "Table 'users' created successfully!", 200
    except Exception as e:
        return f"Error: {e}", 500
    finally:
        cursor.close()
        connection.close()

# post
@app.route('/post_data', methods=['POST'])
def insert_data():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    connection = get_connection()
    if connection is None:
        return "Database connection failed", 500
    try:
        cursor = connection.cursor()
        # Write your INSERT query here as a multi-line string.
        insert_query = """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        ON CONFLICT (username) DO NOTHING;
        """
        cursor.execute(insert_query, (username, password))
        connection.commit()

        if cursor.rowcount > 0:
            return f"Data inserted: {username}", 201
        #else:
        #    return "Error: Username already exists", 400
    except Exception as e:
        connection.rollback()
        return f"Error: {e}", 500
    finally:
        cursor.close()
        connection.close()

# Route to fetch all data
@app.route('/data', methods=['GET'])
def get_data():
    if admin_check():
        connection = get_connection()
        if connection is None:
            return "Database connection failed", 500
        try:
            cursor = connection.cursor()
            select_query = "SELECT * FROM users;"
            cursor.execute(select_query)
            rows = cursor.fetchall()
            # Format the data as JSON
            result = [
                {"id": row[0], "username": row[1], "password": row[2]}
                for row in rows
            ]
            return jsonify(result), 200
        except Exception as e:
            return f"Error: {e}", 500
        finally:
            cursor.close()
            connection.close()
    else:
        return 'You tried but we knew', 404

@app.route('/delete_data', methods=['DELETE'])
def delete_data():
    data = request.json
    username = data.get("username")
    password = data.get ("password")

    connection = get_connection()

    if connection is None:
        return "Database connection failed", 500
    try:
        cursor = connection.cursor()

        delete_query = """
        DELETE FROM users
        WHERE username = %s AND password = %s;
        """
        cursor.execute(delete_query, (username, password))
        connection.commit()
        # return f"Data deleted: {username}, {password}", 201
        return jsonify({"message": "Data deleted"}), 201
    except Exception as e:
        return f"Error: {e}", 500
    finally:
        cursor.close()
        connection.close()

@app.route('/login', methods=['POST'])
def login_with_data():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    connection = get_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        select_query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(select_query, (username, password))
        user_record = cursor.fetchone()

        print("DEBUG: User record found:", user_record)

        if user_record:
            username = data.get("username")  # Provide a default if not sent
            
            session['user'] = {'username': username}
            # Return JSON rather than a plain string
            return jsonify({"message": "User logged in!"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/logout')
def logout():
    # Remove the user data from the session
    session.pop('user', None)
    
    # Optionally clear all session data
    # session.clear()

    # Prepare a response confirming logout
    resp = make_response(redirect(url_for('loginPage')))
    
    # Delete the session cookie (default cookie name is "session")
    resp.delete_cookie('session')
    
    return resp

# Saving Scores für das beste Game ever haben wir den jam gewonnen?
@app.route('/save_scores', methods=["POST"])
def save_score():
    conn = None
    cursor = None
    try:
        data = request.get_json(force=True)
        raw = data.get("result")  # could be "02:39" or "67"
        
        if ":" in raw:
            mins, secs = raw.split(":")
            total_seconds = int(mins) * 60 + int(secs)
        else:
            total_seconds = int(raw)

        # Session
        session_data = session.get("user")
        if session_data:
            username = session_data.get("username")
        else:
            username = "anonymous"
        #username = return_user_username()

        # Save to DB
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO scores_eoto (username, survival_time) VALUES (%s, %s)",
            (username, total_seconds)
        )
        conn.commit()
        return jsonify({"message": "Score has been saved"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/get_scores')
@cross_origin(origins="*")
def get_scores():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, survival_time, created_at
            FROM scores_eoto
            ORDER BY survival_time DESC
            LIMIT 200
        """)
        rows = cursor.fetchall()
        results = [
            {
                "username": r[0],
                "survival_time": float(r[1]) if r[1] is not None else None,
                "created_at": r[2].isoformat() if r[2] else None
            }
            for r in rows
        ]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# check if user is logged in
@app.route('/check_login')
def check_login():
    user_data = session.get("user")
    if user_data:
        return jsonify({
            "logged_in": True,
            "username": user_data.get("username")
        })
    else:
        return jsonify({
            "logged_in": False,
            "username": None
        })

def return_user_username():
    user_data = session.get("user")
    if user_data:
        return user_data.get("username")
    else:
        return None

@app.route("/test_save_score")
def lolsdeleteis():
    if admin_check():
        try:
            conn = get_connection()
            cursor = conn.cursor()
            user_data = session.get("user")
            cursor.execute(
                "INSERT INTO scores_eoto (username, survival_time) VALUES (%s, %s)",
                (user_data.get("username"), "67")
            )
            conn.commit()
            return jsonify({"message": "Score has been saved"}), 200
        except Exception as e:
            return jsonify({"message": "Score NOT has been saved"}), 500

### FÜR SOCCER GAME 

### FÜR SOCCER GAME 

# GET Leaderboard
@app.route('/api/game/leaderboard', methods=['GET', 'OPTIONS'])
def get_game_leaderboard():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response, 200
    
    conn = None
    cursor = None
    try:
        limit = request.args.get('limit', 100, type=int)
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT name, score, created_at
            FROM game_leaderboard
            ORDER BY score DESC
            LIMIT %s
        """, (limit,))
        
        rows = cursor.fetchall()
        results = [
            {
                "name": r[0],
                "score": int(r[1]),
                "created_at": r[2].isoformat() if r[2] else None
            }
            for r in rows
        ]
        
        response = make_response(jsonify(results), 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# POST Score
@app.route('/api/game/leaderboard', methods=['POST', 'OPTIONS'])
def post_game_score():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response, 200
    
    conn = None
    cursor = None
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'score' not in data:
            return jsonify({'error': 'name and score required'}), 400
        
        name = str(data['name'])[:50]
        score = int(data['score'])
        
        if score < 0 or score > 999999:
            return jsonify({'error': 'invalid score'}), 400
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO game_leaderboard (name, score, created_at)
            VALUES (%s, %s, NOW())
        """, (name, score))
        
        conn.commit()
        
        response = make_response(jsonify({'success': True}), 201)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

        
# Nummer erkennen Route
from static.mnist_numbers.bob import load_params, make_prediction
import numpy as np
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

if __name__ == "__main__":
    app.run(port=(8000))
