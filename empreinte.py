#!/usr/bin/env python3
"""
Estampille les liens vers style.css et main.js avec une empreinte du contenu
(?v=xxxxxxxx). Tant que le fichier ne change pas, l'empreinte ne change pas et
le navigateur garde sa version en cache. Dès qu'il change, l'URL change et le
navigateur recharge — plus besoin de vider le cache à la main.

À relancer après chaque modification du CSS ou du JS :

    python3 empreinte.py
"""
import hashlib
import pathlib
import re

RACINE = pathlib.Path(__file__).parent
CIBLES = {
    "assets/css/style.css": re.compile(r'(href="(?:\.\./)?assets/css/style\.css)(\?v=[0-9a-f]+)?(")'),
    "assets/js/main.js": re.compile(r'(src="(?:\.\./)?assets/js/main\.js)(\?v=[0-9a-f]+)?(")'),
}


def empreinte(chemin: pathlib.Path) -> str:
    return hashlib.sha256(chemin.read_bytes()).hexdigest()[:8]


def main() -> None:
    versions = {f: empreinte(RACINE / f) for f in CIBLES}
    for f, v in versions.items():
        print(f"  {f:<22} {v}")

    pages = [RACINE / "index.html", RACINE / "mentions-legales.html"]
    pages += sorted((RACINE / "prestations").glob("*.html"))

    modifiees = 0
    for page in pages:
        texte = origine = page.read_text(encoding="utf-8")
        for fichier, motif in CIBLES.items():
            texte = motif.sub(rf"\1?v={versions[fichier]}\3", texte)
        if texte != origine:
            page.write_text(texte, encoding="utf-8")
            modifiees += 1

    print(f"\n  {modifiees} page(s) estampillée(s) sur {len(pages)}")


if __name__ == "__main__":
    main()
