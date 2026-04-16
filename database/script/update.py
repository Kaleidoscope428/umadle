import json
import codecs
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

data = json.load(codecs.open('e:/A.CDE/Uma/umadle/database/umamusume.json', 'r', 'utf-8'))

updates = {
    # Sakura Chitose O: stallion (male), Turf A, Pace A, Late A, Medium A, Long A (Tenno Sho Autumn winner)
    101: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Sakura Chiyono O: mare (female), Turf A, Pace A, Mile A, Medium A
    102: {'style': 'Pace', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Sakura Laurel: stallion (male), Turf A, Late A, Medium A, Long A
    103: {'style': 'Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Satono Crown: stallion (male), Turf A, Pace A, Medium A
    105: {'style': 'Pace', 'track': 'Turf', 'distance': 'Medium', 'ears': 'Right'},
    # Satono Diamond: stallion (male), Turf A, Late A, Medium A, Long A
    106: {'style': 'Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Seeking the Pearl: stallion (male), Turf A, Pace A, Sprint A, Mile A
    107: {'style': 'Pace', 'track': 'Turf', 'distance': 'Sprint Mile', 'ears': 'Right'},
    # Seiun Sky: stallion (male), Turf A, Front A, Medium A, Long A
    108: {'style': 'Front', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Shinko Windy: mare (female), Dirt A, Front A, Pace A, Mile A, Medium A
    109: {'style': 'Front Pace', 'track': 'Dirt', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Silence Suzuka: stallion (male), Turf A, Front A, Mile A, Medium A
    110: {'style': 'Front', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Sirius Symboli: stallion (male), Turf A, Pace A, Late A, Medium A
    111: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium', 'ears': 'Right'},
    # Smart Falcon: mare (female), Dirt A, Front A, Mile A, Medium A
    112: {'style': 'Front', 'track': 'Dirt', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Sounds of Earth: stallion (male), Turf A, Late A, Medium A, Long A
    113: {'style': 'Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Special Week: mare (female), Turf A, Pace A, Late A, Medium A, Long A
    114: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Left'},
    # Stay Gold: stallion (male), Turf A, Pace A, Medium A, Long A
    115: {'style': 'Pace', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Still in Love: mare (female), Turf A, Pace A, Mile A, Medium A
    116: {'style': 'Pace', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Super Creek: mare (female), Turf A, Pace A, Medium A, Long A
    117: {'style': 'Pace', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Left'},
    # Sweep Tosho: mare (female), Turf A, Late A, End A, Mile A, Medium A
    118: {'style': 'Late End', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Symboli Kris S: stallion (male), Turf A, Pace A, Late A, Medium A, Long A
    119: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Symboli Rudolf: stallion (male), Turf A, Pace A, Late A, Medium A, Long A
    120: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # T.M. Opera O: stallion (male), Turf A, Pace A, Late A, Medium A, Long A
    121: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Taiki Shuttle: stallion (male), Turf A, Pace A, Sprint A, Mile A
    122: {'style': 'Pace', 'track': 'Turf', 'distance': 'Sprint Mile', 'ears': 'Right'},
    # Tamamo Cross: stallion (male), Turf A, Late A, Pace A, Medium A, Long A
    123: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Tanino Gimlet: stallion (male), Turf A, Late A, Mile A, Medium A
    124: {'style': 'Late', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Tap Dance City: stallion (male), Turf A, Front A, Medium A, Long A
    125: {'style': 'Front', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Tokai Teio: stallion (male), Turf A, Pace A, Medium A
    126: {'style': 'Pace', 'track': 'Turf', 'distance': 'Medium', 'ears': 'Right'},
    # Tosen Jordan: stallion (male), Turf A, Pace A, Late A, Medium A, Long A
    127: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Transcend: stallion (male), Dirt A, Front A, Mile A, Medium A
    128: {'style': 'Front', 'track': 'Dirt', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Tsurumaru Tsuyoshi: stallion (male), Turf A, Pace A, Medium A
    129: {'style': 'Pace', 'track': 'Turf', 'distance': 'Medium', 'ears': 'Right'},
    # Twin Turbo: stallion (male), Turf A, Front A, Mile A, Medium A
    130: {'style': 'Front', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Verxina: mare (female), Turf A, Front A, Pace A, Mile A, Medium A
    131: {'style': 'Front Pace', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Victoire Pisa: stallion (male), Turf A, Pace A, Late A, Medium A
    132: {'style': 'Pace Late', 'track': 'Turf', 'distance': 'Medium', 'ears': 'Right'},
    # Vivlos: mare (female), Turf A, Late A, Mile A, Medium A
    133: {'style': 'Late', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Vodka: mare (female), Turf A, Late A, Mile A, Medium A
    134: {'style': 'Late', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Win Variation: stallion (male), Turf A, Late A, Medium A, Long A
    135: {'style': 'Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Winning Ticket: stallion (male), Turf A, Late A, Medium A, Long A
    136: {'style': 'Late', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Wonder Acute: mare (female), Dirt A, Pace A, Mile A, Medium A
    137: {'style': 'Pace', 'track': 'Dirt', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Yaeno Muteki: stallion (male), Turf A, Late A, End A, Mile A, Medium A
    138: {'style': 'Late End', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Yamanin Zephyr: stallion (male), Turf A, Pace A, Mile A, Medium A
    139: {'style': 'Pace', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Right'},
    # Yukino Bijin: mare (female), Turf A, End A, Mile A, Medium A
    140: {'style': 'End', 'track': 'Turf', 'distance': 'Mile Medium', 'ears': 'Left'},
    # Zenno Rob Roy: stallion (male), Turf A, End A, Medium A, Long A
    141: {'style': 'End', 'track': 'Turf', 'distance': 'Medium Long', 'ears': 'Right'},
    # Tazuna Hayakawa: female human character (support/trainer), Ears = Left
    165: {'style': 'Front', 'track': 'Turf', 'distance': 'Sprint Mile Medium', 'ears': 'Right'},
}

made_changes = 0
for item in data:
    rn = item.get('row_number')
    if rn in updates:
        for k, v in updates[rn].items():
            item[k] = v
        made_changes += 1
        print(f"Row {rn} ({item.get('name_en')}): updated")

with codecs.open('e:/A.CDE/Uma/umadle/database/umamusume.json', 'w', 'utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f'Total updated: {made_changes} records.')
