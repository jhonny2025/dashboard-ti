from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__, template_folder="templates")
CORS(app)

# -------------------------------------------------
# CONFIGURACIÓN BASE DE DATOS
# -------------------------------------------------
# Render requiere que SQLite esté dentro de /instance
if not os.path.exists('instance'):
    os.makedirs('instance')

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -------------------------------------------------
# MODELO (todos los campos son String)
# -------------------------------------------------
class Registro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(50))
    titulo = db.Column(db.String(200))
    descripcion = db.Column(db.String(500))
    carga = db.Column(db.String(50))
    tiempo_respuesta = db.Column(db.String(50))
    calificacion = db.Column(db.String(50))
    mttr = db.Column(db.String(50))
    ir = db.Column(db.String(50))
    ath = db.Column(db.String(50))
    recontactos = db.Column(db.String(50))
    csat = db.Column(db.String(50))
    sla = db.Column(db.String(50))

# Crear BD si no existe
with app.app_context():
    db.create_all()

# -------------------------------------------------
# SERVIR FRONTEND
# -------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

# -------------------------------------------------
# GUARDAR REGISTRO
# -------------------------------------------------
@app.route("/guardar", methods=["POST"])
def guardar():
    data = request.json
    nuevo = Registro(**data)
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({"msg": "Guardado"})

# -------------------------------------------------
# LISTAR REGISTROS
# -------------------------------------------------
@app.route("/listar", methods=["GET"])
def listar():
    registros = Registro.query.all()
    salida = []
    for r in registros:
        salida.append({
            "id": r.id,
            "fecha": r.fecha,
            "titulo": r.titulo,
            "descripcion": r.descripcion,
            "carga": r.carga,
            "tiempo_respuesta": r.tiempo_respuesta,
            "calificacion": r.calificacion,
            "mttr": r.mttr,
            "ir": r.ir,
            "ath": r.ath,
            "recontactos": r.recontactos,
            "csat": r.csat,
            "sla": r.sla
        })
    return jsonify(salida)

# -------------------------------------------------
# ELIMINAR REGISTRO
# -------------------------------------------------
@app.route("/eliminar/<int:id>", methods=["DELETE"])
def eliminar(id):
    r = Registro.query.get(id)
    if not r:
        return jsonify({"error": "No encontrado"}), 404
    db.session.delete(r)
    db.session.commit()
    return jsonify({"msg": "Eliminado"})

# -------------------------------------------------
# INICIAR SERVIDOR (LOCAL)
# -------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
