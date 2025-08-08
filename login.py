from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)
USER_FILE = "users.txt"

# ------------------ Main Pages ------------------ #
@app.route("/")
def main_page():
    return render_template("loginscreen.html")

@app.route("/register")
def register():
    return render_template("registerscreen.html")

@app.route("/home")
def home():
    return render_template("home.html")


# ------------------ Account Handling ------------------ #
@app.route("/createaccount", methods=['POST'])
def create_db():
    username = request.form.get("username")
    password = request.form.get("password")
    mailid = request.form.get("mailid")

    with open(USER_FILE, "a") as f:
        f.write(f"{username},{password},{mailid}\n")

    return redirect(url_for("home"))

@app.route("/login", methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    flag = False

    try:
        with open(USER_FILE, "r") as f:
            for line in f:
                u, p, _ = line.strip().split(",")
                if u == username and p == password:
                    flag = True
                    break
    except FileNotFoundError:
        return "No users registered yet!"

    if flag:
        return redirect(url_for("home"))
    else:
        return "Login failed."


# ------------------ Feature Pages ------------------ #
@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/exam")
def exam():
    return render_template("exam.html")

@app.route("/mentor")
def mentor():
    return render_template("mentor.html")

@app.route("/kit")
def kit():
    return render_template("kit.html")

@app.route("/attendance")
def attendance():
    return render_template("attendence.html")

@app.route("/classnotes")
def classnotes():
    return render_template("classnotes.html")

@app.route("/index")
def index():
    return render_template("index.html")

# ===================================================
# =========== NEWLY ADDED ROUTE FOR THE GAME ========
# ===================================================
@app.route("/game")
def game():
    return render_template("game.html")
# ===================================================


# ------------------ Logout ------------------ #
@app.route("/logout")
def logout():
    return render_template("logout_splash.html")


if __name__ == "__main__":
    app.run(debug=True)
