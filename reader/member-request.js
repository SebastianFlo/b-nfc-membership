const request = require('request');

const memberRequest = function(uid, { onSuccess, onNotFound, onExpired }) {
    return request(`http://localhost:5000/member/${uid}`, (error, response, body) => {
        if (error) {
            return onNotFound();
        }

        console.log('Server Response: ', body);
        const member = JSON.parse(body);

        // if member is not found
        if (member.message === 'Member not found') {
            return onNotFound();
        } else if (member.message === 'Created over 90 days ago') {
            return onExpired();
        }

        return onSuccess();
    })
}

module.exports.memberRequest = memberRequest;