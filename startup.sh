python3 -m virtualenv venv
source venv/bin/activate
pip install -r PF/TFCbackend/requirements.txt
python3 PF/TFCbackend/manage.py makemigrations
python3 PF/TFCbackend/manage.py migrate --run-syncdb
(cd PF/TFCFrontend/tfc-frontend && npm install)
