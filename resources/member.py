from flask_restful import Resource

from models.member import MemberModel


class Member(Resource):

    def get(self, uuid):
        member = MemberModel.find_by_uuid(uuid)

        if member:
            print(member.json())
        else:
            print({'message': 'Member not found'}, 404)

    def post(self, uuid):

        if MemberModel.find_by_uuid(uuid):
            print({
                'error': 'Member with that uuid `{}` already exists'.format(uuid)
            }, 400)

        member = MemberModel(uuid)

        member.save_to_db()

        print(member.json(), 201)

    def delete(self, uuid):
        member = MemberModel.find_by_uuid(uuid)

        if member:
            member.delete_from_db()

        print({'message': '{} Member Deleted'.format(uuid)})
