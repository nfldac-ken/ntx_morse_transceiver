/**
 * Radio frequency band 5 is 2.405 Ghz.
 * 
 * MicroBit has 32 1 Mhz steps from 2.400 Ghz
 */
// Reads pin 2 and drives the Button A events once for each up and down of the pin state. Used in croc clip minimal version.
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    morse.keyUp()
    music.stopAllSounds()
    basic.pause(1)
    if (PTTon == 1) {
        radio.raiseEvent(
        EventBusSource.MICROBIT_ID_BUTTON_A,
        EventBusValue.MICROBIT_BUTTON_EVT_UP
        )
        radio.sendNumber(0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    } else {
        pins.digitalWritePin(DigitalPin.P13, 0)
    }
})
radio.onReceivedNumber(function (receivedNumber) {
    if (PTTon == 1) {
        music.stopAllSounds()
        PTTon = 0
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
})
// Show a string "now" without a delay / scrolling
function showStringNow (theString: string) {
    if (PTTon == 0 && mode == 0) {
        basic.showString(theString, 0)
    } else if (PTTon == 1 && mode < 2) {
        basic.showString(theString, 0)
    }
}
morse.onCodeSelected(function (code, sequence) {
    // Make silences visible.
    if (code == " ") {
        code = "_"
    }
    serial.writeLine("Code: " + code)
    showStringNow(code)
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    morse.keyDown()
    basic.pause(1)
    if (PTTon == 1) {
        music.ringTone(494)
        radio.raiseEvent(
        EventBusSource.MICROBIT_ID_BUTTON_A,
        EventBusValue.MICROBIT_BUTTON_EVT_DOWN
        )
        radio.sendNumber(0)
        pins.digitalWritePin(DigitalPin.P14, 1)
    } else {
        music.ringTone(494)
        PTTon = 0
        pins.digitalWritePin(DigitalPin.P13, 1)
    }
})
// Show dot/dash
morse.onNewSymbol(function (newSymbol) {
    serial.writeLine(newSymbol)
    showStringNow(newSymbol)
})
input.onButtonPressed(Button.AB, function () {
    music.stopAllSounds()
    basic.clearScreen()
    if (mode == 2) {
        mode = 0
    } else {
        mode = mode + 1
    }
    if (mode == 0) {
        basic.showLeds(`
            # # . . .
            # . # . #
            # # . # .
            # . . # .
            # # . # .
            `)
    }
    if (mode == 1) {
        basic.showLeds(`
            # # # # #
            . # . # .
            . # . # #
            . # . # .
            . . . # #
            `)
    }
    if (mode == 2) {
        basic.showLeds(`
            # # . . .
            # . # . #
            # # . # .
            # . # . #
            # # . . .
            `)
    }
})
input.onButtonPressed(Button.B, function () {
    morse.resetTiming()
    morse.resetDecoding()
    music.stopAllSounds()
    if (PTTon == 1) {
        PTTon = 0
        basic.showLeds(`
            # # # . .
            # . . . .
            # . # . #
            # . . # .
            . . # . #
            `)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    } else {
        basic.showLeds(`
            # # # . .
            . # . . .
            . # # . #
            . # . # .
            . . # . #
            `)
        PTTon = 1
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
})
let keystate = 0
let switchNumber = 0
let mode = 0
let PTTon = 0
basic.showLeds(`
    . . . . .
    . . . . #
    . . . # .
    # . # . .
    . # . . .
    `)
morse.setMaxDurationDotDash(
200,
1000
)
morse.setMaxSilenceBetweenSymbolsLetters(
500,
2000
)
PTTon = 0
mode = 0
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
radio.setFrequencyBand(5)
music.setVolume(44)
loops.everyInterval(1000, function () {
    if (pins.digitalReadPin(DigitalPin.P8) == 1) {
        switchNumber += 1
    }
    if (pins.digitalReadPin(DigitalPin.P12) == 1) {
        switchNumber += 2
    }
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        switchNumber += 4
    }
    if (pins.digitalReadPin(DigitalPin.P16) == 1) {
        switchNumber += 8
    }
    radio.setGroup(switchNumber)
    switchNumber = 0
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
        if (keystate == 1) {
            control.raiseEvent(
            EventBusSource.MICROBIT_ID_BUTTON_A,
            EventBusValue.MICROBIT_BUTTON_EVT_DOWN
            )
            keystate = 0
        }
    }
    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        if (keystate == 0) {
            control.raiseEvent(
            EventBusSource.MICROBIT_ID_BUTTON_A,
            EventBusValue.MICROBIT_BUTTON_EVT_UP
            )
            keystate = 1
        }
    }
})
