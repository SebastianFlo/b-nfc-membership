import requests
import sys


def testUser():
    if (not sys.argv[1:]):
        return print('No uuid given')

    r = requests.post('http://127.0.0.1:5000/member/{}'.format(sys.argv[1]))

    print(r.json())


testUser()
