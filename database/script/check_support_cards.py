import json
from pathlib import Path


def find_support_cards_with_missing_chara(
    support_cards_path: Path, umamusume_path: Path
):
    with support_cards_path.open("r", encoding="utf-8") as f:
        support_cards = json.load(f)

    with umamusume_path.open("r", encoding="utf-8") as f:
        umamusume = json.load(f)

    existing_chara_ids = {item.get("game_id") for item in umamusume if item.get("game_id") is not None}

    missing = []
    for card in support_cards:
        chara_id = card.get("chara_id")
        if chara_id is None:
            continue

        if chara_id not in existing_chara_ids:
            missing.append(
                {
                    "support_card_id": card.get("id"),
                    "chara_id": chara_id,
                    "gametora": card.get("gametora"),
                    "title_en": card.get("title_en"),
                }
            )

    return missing


if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parents[1]
    support_cards_path = base_dir / "support-card.json"
    umamusume_path = base_dir / "umamusume.json"

    missing_cards = find_support_cards_with_missing_chara(
        support_cards_path=support_cards_path,
        umamusume_path=umamusume_path,
    )

    print(f"Missing links: {len(missing_cards)}")
    for card in missing_cards:
        print(
            f"- support_card_id={card['support_card_id']}, "
            f"chara_id={card['chara_id']}, "
            f"gametora={card['gametora']}, "
            f"title_en={card['title_en']}"
        )
