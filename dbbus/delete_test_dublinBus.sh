export PGPASSWORD=boldToads
if [[ `psql  -h 127.0.0.1 -d postgres -U boldToads -p 5000 -tAc "SELECT 1 FROM pg_database WHERE datname='test_dublinbus'"` == "1" ]]
then
    psql -h 127.0.0.1 -d postgres -U boldToads -p 5432 -a -w -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.boldToads = 'test_dublinbus' AND pid <> pg_backend_pid();"
    psql -h 127.0.0.1 -d postgres -U username -p 5432 -a -w -c "DROP DATABASE test_dublinbus;"
fi
