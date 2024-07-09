from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sqlite3
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

app = Flask(__name__)


# Initialize SQLite database
def init_db():
    with sqlite3.connect("users.db") as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """
        )
    print("Database initialized!")


# Call init_db when the script is first run
init_db()

# Configuration for SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///your_database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


# Example User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return "<User %r>" % self.username


with app.app_context():
    # Initialize database tables
    db.create_all()


# Routes
@app.route("/")
def index():
    # Read the content of index.html
    with open("templates/index.html", "r", encoding="utf-8-sig") as file:
        template_content = file.read()

    # Render index.html with the read content
    return render_template("index.html", content=template_content)


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    # Example login logic with SQLAlchemy
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["newUsername"]
    password = data["newPassword"]

    # Example signup logic with SQLAlchemy
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"success": False, "error": "Username already exists"})

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True})


@app.route("/scrape", methods=["POST"])
def scrape():
    data = request.json
    search_term = data["searchTerm"]
    results = scrape_marketplaces(search_term)
    return jsonify(results)


def scrape_marketplaces(search_term):
    # Example scraping logic with Selenium
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.get(f"https://www.example.com/search?q={search_term}")
    # Extract data (replace with actual scraping logic)
    results = {"example": "Scraped data"}

    driver.quit()
    return results


if __name__ == "__main__":
    app.run(debug=True)
