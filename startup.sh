python3 -m virtualenv venv
source venv/bin/activate
pip install -r PF/TFCbackend/requirements.txt
python3 PF/TFCbackend/manage.py makemigrations
python3 PF/TFCbackend/manage.py migrate --run-syncdb
npm install --prefix ./PF/TFCfrontend/tfc-frontend