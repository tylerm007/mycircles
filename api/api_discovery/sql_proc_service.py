from flask import request, jsonify
import safrs
import logging
import pyodbc

db = safrs.DB 
session = db.session 
app_logger = logging.getLogger("api_logic_server_app")

def add_service(app, api, project_dir, swagger_host: str, PORT: str, method_decorators ):
    pass

    @app.route('/hello_sql_service')
    def hello_sql_service():
        """
        Illustrates:
        * Use standard Flask, here for non-database endpoints.

        Test it with:
        
                http://localhost:5656/hello_sql_service?user=ApiLogicServer
        """
        user = request.args.get('user')
        app_logger.info(f'{user}')
        return jsonify({"result": f'hello from sql_service! from {user}'})

    @app.route('/call_procedure', methods=['GET'])
    def call_procedure(proc_name=None):
        """
        Illustrates:
        * Calling a SQL procedure from Flask.

        Test it with:
            curl -X POST http://localhost:5656/call_procedure
        """
        app_logger.info('Calling SQL procedure')
        # Call your SQL procedure here

        conn_str = (
            "DRIVER={ODBC Driver 18 for SQL Server};"
            "SERVER=localhost,1433;"
            "DATABASE=NORTHWND;"
            "UID=sa;"
            "PWD=YourStrong@Passw0rd;"
            "Encrypt=no;"
            "TrustServerCertificate=yes;"
            "Connection Timeout=30;"
        )
        try:
            with pyodbc.connect(conn_str) as conn:
                cursor = conn.cursor()
                # Replace 'your_procedure' and parameters as needed
                cursor.execute("{CALL SalesByCategory (?)}", ('Beverages'))
                columns = [column[0] for column in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                cursor.close()
        except Exception as e:
            app_logger.error(f"Error calling procedure: {e}")
            return jsonify({"error": str(e)}), 500
        return jsonify({"result": results})

    @app.route('/get_all_procedures', methods=['GET'])
    def get_all_procedures():
        """
        Illustrates:        
        Get a list of all SQL procedures in the database.
        """
        app_logger.info('Getting all SQL procedures')
        conn_str = (
            "DRIVER={ODBC Driver 18 for SQL Server};"
            "SERVER=localhost,1433;"
            "DATABASE=NORTHWND;"
            "UID=sa;"
            "PWD=Passw0rd1;"
            "Encrypt=no;"
            "TrustServerCertificate=yes;"
            "Connection Timeout=30;"
        )
        try:
            with pyodbc.connect(conn_str) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sys.procedures")
                procedures = [row[0] for row in cursor.fetchall()]
                cursor.close()
                for proc in procedures:
                    app_logger.info(f"Procedure: {proc}")   
                    "get procedure details here if needed "
                    cursor = conn.cursor()
                    cursor.execute(f"SELECT * FROM sys.sql_modules WHERE object_id = OBJECT_ID('{proc}')")
                    details = cursor.fetchall()
                    cursor.close()
                    app_logger.info(f"Details for {proc}: {details}")
        except Exception as e:
            app_logger.error(f"Error getting procedures: {e}")
            return jsonify({"error": str(e)}), 500
        return jsonify({"procedures": procedures})