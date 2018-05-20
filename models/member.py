from db import db


class MemberModel(db.Model):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(80))
    created = db.Column(db.DateTime())
    last_update = db.Column(db.DateTime())

    def __init__(self, uuid, created, last_update):
        self.uuid = uuid
        self.created = created
        self.last_update = last_update

    def json(self):
        return {
            'uuid': self.uuid,
            'created': self.created.strftime("%Y-%m-%d %H:%M"),
            'last_update': self.last_update.strftime("%Y-%m-%d %H:%M"),
        }

    @classmethod
    def find_by_uuid(cls, uuid):
        return cls.query.filter_by(uuid=uuid).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
