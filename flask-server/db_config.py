def db_conf(app):
	app.config['MYSQL_DATABASE_USER'] = 'root'
	app.config['MYSQL_DATABASE_PASSWORD'] = 'iamroot'
	app.config['MYSQL_DATABASE_DB'] = 'Calculator_DB'
	app.config['MYSQL_DATABASE_HOST'] = 'localhost'

	return app
