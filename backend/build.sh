#!/usr/bin/env bash

# Exit on error
set -o errexit

# Install any missing dependencies
pip install -r requirements.txt

# Apply any outstanding database migrations
python manage.py migrate