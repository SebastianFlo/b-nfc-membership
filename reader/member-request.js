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
    });
}

const memberCreate = function(uid, { onSuccess, onExistsAlready }) {
    return request.post(`http://localhost:5000/member/${uid}`, (error, response, body) => {
        if (error) {
            return onExistsAlready();
        }

        console.log('Server Response: ', body);
        const member = JSON.parse(body);

        // if member is not found
        if (member.error) {
            return onExistsAlready();
        }

        return onSuccess();
    })
}
const memberUpdate = function(uid, { onSuccess, onNotFound }) {
    return request.put(`http://localhost:5000/member/${uid}`, (error, response, body) => {
        if (error) {
            return onNotFound();
        }

        console.log('Server Response: ', body);
        const member = JSON.parse(body);

        // if member is not found
        if (member.error) {
            return onNotFound();
        }

        return onSuccess();
    })
}

module.exports.memberRequest = memberRequest;
module.exports.memberCreate = memberCreate;
module.exports.memberUpdate = memberUpdate;