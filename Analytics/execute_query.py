# Initial query execution script. will need to be smarter than this. 

import config
import psycopg2

try:
    # use our connection values to establish a connection
    conn = psycopg2.connect(
        database=config.Database,
        user=config.DBuser,
        host=config.host,
        password=config.DBpswd,
        port=config.port
    )
    print('Connection Established...')

    # create a psycopg2 cursor that can execute queries
    cursor = conn.cursor()
    print('Created Cursor...\nExecuting Query...')
    
    # run a SELECT statement - no data in there, but we can try it
    cursor.execute(f"""
        SELECT * FROM leavetimes LIMIT 2;
    """)
    print("Query complete...")

    # makes sure the change is shown in the database
    conn.commit()
    print('Commiting Query?...')
    
    # what does this do?
    rows = cursor.fetchall()
    print('fetching rows...')

    print(rows)
    
    # close cursor
    cursor.close()
    print('Cursor closed...')

    # close connection    
    conn.close()
    print('Connection Closed')

except Exception as e:
    print("Uh oh, can't connect. Invalid dbname, user or password?")
    print(repr(e))