# Postgresql connection python script
import config
import psycopg2

def query(Query, tunnel=False):
    """
    Query the PostgreSQL database

    Usage: 
    
    Inputs:
    Query  (str)            The query to be sent to the database. 
    tunnel (bool, Optional) Specify whether to use the ssh tunnel params. 

    Output:
    result (str, json)      The result of your query. 
    """
               
    if not tunnel:
        # On Eduroam
        host_=config.host,
        port_=config.port
        
    else:
        # Tunneled connection
        host_=config.TunnelHost, # Weirdly this is being imported as a tuple. not sure why.
        host_=host_[0]
        port_=config.TunnelPort 
        
    try:

        conn = psycopg2.connect(
            
            database=config.Database,
            user=config.DBuser,
            password=config.DBpswd,
            host=host_,
            port=port_
        )
        
        cursor = conn.cursor()
        
        
        cursor.execute(Query)
        conn.commit()
        result = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return result

    except Exception as e:
        print("Connection failed with error:")
        print(repr(e))

query("select * from combined limit 1;")