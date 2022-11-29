python3 -m virtualenv venv
source venv/bin/activate
pip install -r TFCbackend/requirements.txt
python3 TFCbackend/manage.py makemigrations
python3 TFCbackend/manage.py migrate --run-syncdb
python3 TFCbackend/manage.py createsuperuser