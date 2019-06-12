import pymysql

from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS
from flask_socketio import SocketIO

from db_config import db_conf

app = db_conf(Flask(__name__))
app.config['SECRET_KEY'] = "secret"

api = Api(app)

CORS(app)

socketio = SocketIO(app)

mysql = MySQL()
mysql.init_app(app)

@app.route('/calcs', methods=[ 'GET', 'POST' ])
def calcs():
	orig_addr = request.environ['REMOTE_ADDR']
	
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)
		
		if request.method == 'GET':
			cursor.execute("SELECT expr, res, user FROM calcs ORDER BY id DESC LIMIT 10;")
			rows = cursor.fetchall()
			resp = jsonify(rows)
			resp.status_code = 200

			return resp
		elif request.method == 'POST':
			res = eval(request.get_json()['operands'][0] + request.get_json()['operator'] + request.get_json()['operands'][1])

			cursor.execute("INSERT INTO calcs (expr, res, user) VALUES ('" + request.get_json()['operands'][0] + " " + request.get_json()['operator'] + " " + request.get_json()['operands'][1] + "', " + str(res) + ", '" + orig_addr + "');")
			conn.commit()
			
			socketio.emit('calc_performed', { 'calc': request.get_json(), 'res': res, 'addr': orig_addr })
			
			return jsonify(res)
		else:
			pass
	except Exception as e:
		print(e)
	finally:
		cursor.close()
		conn.close()

@app.route('/cleardb', methods=[ 'GET' ])
def clear_db():
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)

		if request.method == 'GET':
			cursor.execute("DELETE FROM calcs;")
			cursor.execute("ALTER TABLE calcs AUTO_INCREMENT = 1;")
			conn.commit()
			
			socketio.emit('clear_db')
			
			return jsonify(None)
		else:
			pass
	except Exception as e:
		print(e)
	finally:
		cursor.close()
		conn.close()

if __name__ == '__main__':
	socketio.run(app, host='0.0.0.0', port=5001, debug=True)

