def on_microbit_id_button_a_evt_up():
    morse.key_up()
    music.stop_all_sounds()
    basic.pause(1)
    if PTTon == 1:
        radio.raise_event(EventBusSource.MICROBIT_ID_BUTTON_A,
            EventBusValue.MICROBIT_BUTTON_EVT_UP)
        radio.send_number(0)
    else:
        pins.digital_write_pin(DigitalPin.P13, 0)
control.on_event(EventBusSource.MICROBIT_ID_BUTTON_A,
    EventBusValue.MICROBIT_BUTTON_EVT_UP,
    on_microbit_id_button_a_evt_up)

def on_received_number(receivedNumber):
    global PTTon
    if PTTon == 1:
        music.stop_all_sounds()
        PTTon = 0
        pins.digital_write_pin(DigitalPin.P14, 0)
radio.on_received_number(on_received_number)

# Show a string "now" without a delay / scrolling
def showStringNow(theString: str):
    if PTTon == 0 and mode == 0:
        basic.show_string(theString, 0)
    else:
        if PTTon == 1 and mode < 2:
            basic.show_string(theString, 0)

def on_code_selected(code, sequence):
    # Make silences visible.
    if code == " ":
        code = "_"
    serial.write_line("Code: " + code)
    showStringNow(code)
morse.on_code_selected(on_code_selected)

def on_microbit_id_button_a_evt_down():
    morse.key_down()
    music.ring_tone(494)
    basic.pause(1)
    if PTTon == 1:
        radio.raise_event(EventBusSource.MICROBIT_ID_BUTTON_A,
            EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        radio.send_number(0)
    else:
        pins.digital_write_pin(DigitalPin.P13, 1)
control.on_event(EventBusSource.MICROBIT_ID_BUTTON_A,
    EventBusValue.MICROBIT_BUTTON_EVT_DOWN,
    on_microbit_id_button_a_evt_down)

# Show dot/dash

def on_new_symbol(newSymbol):
    serial.write_line(newSymbol)
    showStringNow(newSymbol)
morse.on_new_symbol(on_new_symbol)

def on_button_pressed_ab():
    global mode
    music.stop_all_sounds()
    if mode == 2:
        mode = 0
    else:
        mode = mode + 1
    if mode == 0:
        basic.show_string("Easy")
        basic.show_leds("""
            # # # # #
            # . # . #
            . . . . .
            # # . . .
            # # . . .
            """)
    if mode == 1:
        basic.show_string("TX Easy")
        basic.show_leds("""
            # # # # #
            # . # . #
            . # . . .
            . # . . .
            . # . . .
            """)
    if mode == 2:
        basic.show_string("Expert")
        basic.show_leds("""
            # # # # #
            # . # . #
            . # . # .
            . # . # .
            . # . # .
            """)
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global PTTon
    if PTTon == 1:
        PTTon = 0
        basic.show_leds("""
            # # # . .
            # . . . .
            # . # . #
            # . . # .
            # . # . #
            """)
        pins.digital_write_pin(DigitalPin.P13, 0)
        pins.digital_write_pin(DigitalPin.P14, 0)
    else:
        PTTon = 1
        basic.show_leds("""
            # # # . .
            . # . . .
            . # # . #
            . # . # .
            . . # . #
            """)
        pins.digital_write_pin(DigitalPin.P13, 0)
        pins.digital_write_pin(DigitalPin.P14, 1)
    morse.reset_timing()
    morse.reset_decoding()
    music.stop_all_sounds()
input.on_button_pressed(Button.B, on_button_pressed_b)

mode = 0
PTTon = 0
basic.show_leds("""
    . . . . .
    . . . . #
    . . . # .
    # . # . .
    . # . . .
    """)
morse.set_max_duration_dot_dash(200, 1000)
morse.set_max_silence_between_symbols_letters(500, 2000)
radio.set_group(9)
PTTon = 0
mode = 0