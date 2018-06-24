"use strict";

// #############
// Basic example
// - example reading and writing data on from/to card
// - should work well with any compatible PC/SC card reader
// - tested with Mifare Ultralight cards but should work with many others
// - example authentication for Mifare Classic cards
// #############

const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B, CONNECT_MODE_DIRECT } = require('nfc-pcsc');
const gpio = require('rpi-gpio');

const { memberRequest, memberCreate } = require('./member-request');
const { LED } = require('./modules/led');

const nfc = new NFC(); // const nfc = new NFC(minilogger); // optionally you can pass logger to see internal debug logs

let readers = [];
let buttonIdle = true;
let led = new LED();

const leds = {
    created: led.generateLEDBUZZ(3, 1, 1, 1),
    read: led.generateLEDBUZZ(2, 2, 1, 1),
    notFound: led.generateLEDBUZZ(1, 1, 3, 1),
    error: led.generateLEDBUZZ(1, 2, 2, 2),
}

// Get button Press
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

// Listen for Reader
nfc.on('reader', async reader => {

	console.log('device attached', { reader: reader.name });

	readers.push(reader);

	// needed for reading tags emulated with Android HCE AID
	// see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
	reader.aid = 'F222222222';

	reader.on('card', async card => {


		// standard nfc tags like Mifare
		if (card.type === TAG_ISO_14443_3) {
			// const uid = card.uid;
            console.log('card detected', { reader: reader.name, uid: card.uid });

            if (!buttonIdle) {
                memberCreate(card.uid, {
                    onSuccess: async() => {
                        console.log('Created: ', card.uid);
                        await reader.transmit(leds.created, 40);
                    },
                    onExistsAlready: async (error) => {
                        console.log('Exists already: ',card.uid);
                        await reader.transmit(leds.error, 40);
                    },
                });
            } else {
                memberRequest(card.uid, {
                    onSuccess: async() => {
                        await reader.transmit(leds.read, 40);
                    },
                    onNotFound: async () => {
                        await reader.transmit(leds.notFound, 40);
                    },
                    onExpired: async() => {
                        await reader.transmit(leds.error, 40);
                    }
                });
            }
		}
		// Android HCE
		else if (card.type === TAG_ISO_14443_4) {
			// process raw Buffer data
			const data = card.data.toString('utf8');
            console.log('NOT SUPPORTED: card detected');
            errorLED();
		}
		// not possible, just to be sure
		else {
            console.log('NOT SUPPORTED: card detected', { reader: reader.name, card });
            errorLED();
		}

    });

    reader.on('card.off', async card => {
        console.log(`${reader.reader.name}  card removed`, card.uid);
	});

	reader.on('error', err => {

		console.error('an error occurred', { reader: reader.name, err });

	});

	reader.on('end', () => {

		console.log('device removed', { reader: reader.name });

		delete readers[readers.indexOf(reader)];

		console.log(readers);

	});


});

nfc.on('error', err => {

	console.log('an error occurred', err);

});

async function errorLED () {
    await reader.transmit(leds.error, 40);
}
