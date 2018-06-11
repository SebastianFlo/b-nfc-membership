
class LED {
    constructor() {
        this.baseLED = [
            0xFF, // Class
            0x00,    // INS
            0x40, // P1
        ];
    }

    generatePattern(t1duration, t2duration, repetition, buzzer) {
        return [
            parseInt(`0x0${t1duration}`, 16),
            parseInt(`0x0${t2duration}`, 16),
            parseInt(`0x0${repetition}`, 16),
            parseInt(`0x0${buzzer}`, 16),
        ];
    }

    generateLEDBUZZ(t1duration, t2duration, repetition, buzzer) {
        return new Buffer([
            ...this.baseLED,
            0x50, // P2: LED State Control
            0x04, // Lc ,
            ...this.generatePattern(t1duration, t2duration, repetition, buzzer)
        ]);
    }
};

// const baseLED = [
//     0xFF, // Class
//     0x00,    // INS
//     0x40, // P1
// ];

// const notFoundDataIn = [
//     0x01, // T1 Duration
//     0x01, // T2 Duration
//     0x03, // Data In: Repetition
//     0x01  // Data In: Link to buzzer
// ];

// const successDataIn = [
//     0x02, // T1 Duration
//     0x02, // T2 Duration
//     0x01, // Data In: Repetition
//     0x01  // Data In: Link to buzzer
// ];

// const createdDataIn = [
//     0x03, // T1 Duration
//     0x01, // T2 Duration
//     0x01, // Data In: Repetition
//     0x01  // Data In: Link to buzzer
// ];

// const expiredDataIn = [
//     0x01, // T1 Duration
//     0x02, // T2 Duration
//     0x02, // Data In: Repetition
//     0x02  // Data In: Link to buzzer
// ];

// const notFoundLEDBlink = new Buffer([
//     ...baseLED,
//     0x50, // P2: LED State Control
//     0x04, // Lc
//     ...notFoundDataIn
// ]);

// const createdLEDBlink = new Buffer([
//     ...baseLED,
//     0x28, // P2: LED State Control
//     0x04, // Lc
//     ...createdDataIn
// ]);

// const successLEDBlink = new Buffer([
//     ...baseLED,
//     0x28, // P2: LED State Control
//     0x04, // Lc
//     ...successDataIn
// ]);

// const expiredLEDBlink = new Buffer([
//     ...baseLED,
//     0x28, // P2: LED State Control
//     0x04, // Lc
//     ...expiredDataIn
// ]);


module.exports.LED = LED;