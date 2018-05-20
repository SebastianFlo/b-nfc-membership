import requests
import sys


def testUser():
    if (not sys.argv[2:]):
        print('No uuid given')
        return

    if (sys.argv[1] == 'post'):
        r = requests.post('http://127.0.0.1:5000/member/{}'.format(sys.argv[2]))
    if (sys.argv[1] == 'get'):
        r = requests.get('http://127.0.0.1:5000/member/{}'.format(sys.argv[2]))

    print(r.json())


testUser()
