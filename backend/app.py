from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///registros.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# =====================================================
# MODELO DE REGISTRO
# =====================================================
class Registro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200))
    descripcion = db.Column(db.String(500))
    carga = db.Column(db.Integer)
    tiempo_respuesta = db.Column(db.Integer)
    calificacion = db.Column(db.Integer)
    fecha = db.Column(db.String(50))
    mttr = db.Column(db.Float)
    ir = db.Column(db.Float)
    ath = db.Column(db.Float)
    recontactos = db.Column(db.Integer)
    csat = db.Column(db.Float)
    sla = db.Column(db.Float)

# Crear tabla si no existe
with app.app_context():
    db.create_all()

# =====================================================
# RUTAS
# =====================================================
@app.route('/guardar', methods=['POST'])
def guardar():
    data = request.json
    nuevo = Registro(
        titulo=data.get("titulo"),
        descripcion=data.get("descripcion"),
        carga=data.get("carga"),
        tiempo_respuesta=data.get("tiempo_respuesta"),
        calificacion=data.get("calificacion"),
        fecha=data.get("fecha"),
        mttr=data.get("mttr"),
        ir=data.get("ir"),
        ath=data.get("ath"),
        recontactos=data.get("recontactos"),
        csat=data.get("csat"),
        sla=data.get("sla")
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({"mensaje": "Registro guardado correctamente"})

@app.route('/listar', methods=['GET'])
def listar():
    registros = Registro.query.all()
    lista = []
    for r in registros:
        lista.append({
            "id": r.id,
            "titulo": r.titulo,
            "descripcion": r.descripcion,
            "carga": r.carga,
            "tiempo_respuesta": r.tiempo_respuesta,
            "calificacion": r.calificacion,
            "fecha": r.fecha,
            "mttr": r.mttr,
            "ir": r.ir,
            "ath": r.ath,
            "recontactos": r.recontactos,
            "csat": r.csat,
            "sla": r.sla
        })
    return jsonify(lista)

@app.route('/eliminar/<int:id>', methods=['DELETE'])
def eliminar(id):
    reg = Registro.query.get(id)
    if not reg:
        return jsonify({"error": "Registro no encontrado"}), 404
    db.session.delete(reg)
    db.session.commit()
    return jsonify({"mensaje": "Registro eliminado"})

# =====================================================
# MAIN (para Railway)
# =====================================================
import os
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

