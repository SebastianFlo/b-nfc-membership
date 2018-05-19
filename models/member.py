from db import db


class MemberModel(db.Model):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(80))

    def __init__(self, uuid):
        self.uuid = uuid

    def json(self):
        return {
            'uuid': self.uuid,
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
