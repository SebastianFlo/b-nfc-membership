from datetime import datetime
from flask_restful import Resource

from models.member import MemberModel


class Member(Resource):
    def get(self, uuid):
        member = MemberModel.find_by_uuid(uuid)

        if member:
            now = datetime.now()

            # Check if valid
            days_since_created = (now - member.created).days

            if (days_since_created > 90):
                print({
                    'message': 'Created over 90 days ago',
                    'days': days_since_created
                })
                return {
                    'message': 'Created over 90 days ago',
                    'days': days_since_created
                }, 405

            member.last_update = now
            member.save_to_db()

            print(member.json())
            return member.json()
        else:
            print({'message': 'Member not found'}, 404)
            return {'message': 'Member not found'}, 404

    def post(self, uuid=None):

        # Notice: For V1, registering an existing member will reset the card
        if MemberModel.find_by_uuid(uuid):
            print({
                'error':
                'Member with that uuid `{}` already exists'.format(uuid)
            }, 400)

            return {
                'error':
                'Member with that uuid `{}` already exists'.format(uuid)
            }, 400

        created_date = datetime.now()
        member = MemberModel(uuid, created_date, created_date)

        member.save_to_db()

        print(member.json(), 201)
        return member.json(), 201

    # TODO: Update method
    def put(self, uuid=None):

        # data = Item.parser.parse_args()

        # item = ItemModel.find_by_name(name)

        # if item is None:
        #     item = ItemModel(name, **data)
        # else:
        #     item.price = data['price']
        #     item.store_id = data['store_id']

        # item.save_to_db()

        # return item.json(), 201

        currentMember = MemberModel.find_by_uuid(uuid)
        if currentMember is None:
            print({'message': 'Member not found'}, 404)
            return {'message': 'Member not found'}, 404

        created_date = datetime.now()
        currentMember.created = created_date
        currentMember.last_update = created_date

        currentMember.save_to_db()

        print(currentMember.json(), 201)
        return currentMember.json(), 201

    def delete(self, uuid):
        member = MemberModel.find_by_uuid(uuid)

        if member:
            member.delete_from_db()

        print({'message': '{} Member Deleted'.format(uuid)})
        return {'message': '{} Member Deleted'.format(uuid)}
