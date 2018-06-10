"use strict";

// #############
// Basic example
// - example reading and writing data on from/to card
// - should work well with any compatible PC/SC card reader
// - tested with Mifare Ultralight cards but should work with many others
// - example authentication for Mifare Classic cards
// #############

const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B, CONNECT_MODE_DIRECT } = require('nfc-pcsc');
const { memberRequest } = require('./member-request');
const gpio = require('rpi-gpio');

const baseLED = [
    0xFF, // Class
    0x00,    // INS
    0x40, // P1
];

const notFoundDataIn = [
    0x01, // T1 Duration
    0x01, // T2 Duration
    0x03, // Data In: Repetition
    0x01  // Data In: Link to buzzer
];

const successDataIn = [
    0x02, // T1 Duration
    0x02, // T2 Duration
    0x01, // Data In: Repetition
    0x01  // Data In: Link to buzzer
];

const expiredDataIn = [
    0x01, // T1 Duration
    0x02, // T2 Duration
    0x02, // Data In: Repetition
    0x02  // Data In: Link to buzzer
];

const notFoundLEDBlink = new Buffer([
    ...baseLED,
    0x50, // P2: LED State Control
    0x04, // Lc
    ...notFoundDataIn
]);

const successLEDBlink = new Buffer([
    ...baseLED,
    0x28, // P2: LED State Control
    0x04, // Lc
    ...successDataIn
]);

const expiredLEDBlink = new Buffer([
    ...baseLED,
    0x28, // P2: LED State Control
    0x04, // Lc
    ...expiredDataIn
]);

const nfc = new NFC(); // const nfc = new NFC(minilogger); // optionally you can pass logger to see internal debug logs

let readers = [];
let buttonIdle = true;

gpio.on('change', (channel, value) => {
    if (!value) {
        // if prev and current states are different
        if (buttonIdle !== value) {
            console.log('Button Active: ' + !value);
        }
    }
    buttonIdle = value; // value is false if the circuit is closed
});

gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

nfc.on('reader', async reader => {

	console.log(`device attached`, { reader: reader.name });

	readers.push(reader);

	// needed for reading tags emulated with Android HCE AID
	// see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
	reader.aid = 'F222222222';

	reader.on('card', async card => {


		// standard nfc tags like Mifare
		if (card.type === TAG_ISO_14443_3) {
			// const uid = card.uid;
            console.log(`card detected`, { reader: reader.name, uid: card.uid });

            memberRequest(card.uid, {
                onSuccess: async() => {
                    console.log(buttonIdle ? 'Checking' : 'Creating');
                    await reader.transmit(successLEDBlink, 40);
                },
                onNotFound: async () => {
                    await reader.transmit(notFoundLEDBlink, 40);
                },
                onExpired: async() => {
                    await reader.transmit(expiredLEDBlink, 40);
                }
            });
		}
		// Android HCE
		else if (card.type === TAG_ISO_14443_4) {
			// process raw Buffer data
			const data = card.data.toString('utf8');
            console.log(`card detected`, { reader: reader.name, card: { ...card, data } });
		}
		// not possible, just to be sure
		else {
			console.log(`card detected`, { reader: reader.name, card });
		}

    });

    reader.on('card.off', async card => {
        console.log(`${reader.reader.name}  card removed`, card.uid);
	});

	reader.on('error', err => {

		console.error(`an error occurred`, { reader: reader.name, err });

	});

	reader.on('end', () => {

		console.log(`device removed`, { reader: reader.name });

		delete readers[readers.indexOf(reader)];

		console.log(readers);

	});


});

nfc.on('error', err => {

	pretty.error(`an error occurred`, err);

});