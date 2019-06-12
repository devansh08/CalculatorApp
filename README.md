# CalculatorApp

A calculator application which logs calculations as they happen and shares those calculations with everyone connected to the application.
This web app is made using ReactJS, Flask for Python and MySQL database.

## Requirements
 - npm (>=6.9)
 - node (>=11.15)
 - Python (>=3.7)
 - MySQL (>=15)

## Execution

### Database Setup
Run ```mysql -u user -p < mysql-db/sql-scripts/create.sql``` to setup the database with the table for ```user```.

### Flask Server Setup
Edit the ```flask-server/db_config.py``` file and change the ```MYSQL_DATABASE_USER``` and ```MYSQL_DATABASE_PASSWORD``` with details for the database user profile (same as previous step).
Also change ```MYSQL_DATABASE_HOST``` variable, in the same file, to the IP address or hostname of the machine holding the database.

Run ```cd flask-server && pip install -r requirements.txt``` to install all required Python packages.
Run ```python3 app.py``` from ```flask-server``` directory to start the Flask server at port 5001 by default.

### React Server Setup
Edit the ```react-ui/calculator/.env``` file and change the ```REACT_APP_SERVER_IP``` and ```REACT_APP_SERVER_PORT``` variables to the IP address or hostname and port respectively of the machine hosting the Flask server from the previous step.

Run ```cd react-ui/calculator && npm start``` to start the React server at port 3000 by default. The web app will then be accessible on ```http://localhost:3000``` or with the IP address/hostname of the machine hosting React server.

## Usage
 - Enter the two operands in the input boxes ('Operand 1' and 'Operand 2').
 - Then click one of the operator buttons ('+', '-', '*' or '/').
 - Result of the calculation will be shown in the 'Result' box and appended to the 'Calculations' area. Calculations by other users will show up in this area as well with their IP addresses.

## Screenshots

Screenshot 1: Layout of the web application
Screenshot 2: Sample output data from 4 devices on the same network
