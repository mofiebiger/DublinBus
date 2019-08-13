#!/bin/bash

# ===== Navigate to Project Directory

cd DublinBus

# ===== Avoid Merge conflicts by stashing changes

git add .
git stash 
git checkout master 
git pull origin master

# ===== Activate and Update the virtual Environment
source activate dublinbus
pip install -r requirements.txt

# ===== Restart gunicorn daemon

systemctl restart gunicorn 

# ===== Changes to make to this script:
# Set up secondary django application running in sites-available and boot that.
# Add a link to sites-enabled to this project under a specific ip and port.
# Access that site and check the functionality of the project. 
# Switch the address of the sites and remopve the old version. 

