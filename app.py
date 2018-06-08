import os
from flask import Flask
from flask_restful import Api

# database is created based on this
from resources.member import Member

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db' # local
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////data/db/data.db'  # prod
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.environ['BBDBPASS']
api = Api(app)

port = 5000
host = '0.0.0.0'

api.add_resource(Member, '/member/<string:uuid>')

if __name__ == '__main__':
    from db import db

    db.init_app(app)
    with app.test_request_context():
        db.create_all()

    app.run(host=host, port=port, debug=True)
