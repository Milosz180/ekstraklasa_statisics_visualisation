import csv
import json
import os
from collections import defaultdict

BASE_FOLDER = "."  # link do folderu z folderami z danymi
# wybrane kolumny z plików, które zapisujemy
CSV_SOURCES = [
    {
        "filename": "tabela_ligowa.csv",
        "columns": {
            "KLUB": "klub",
            "POZ": "pozycja",
            "M": "mecze",
            "PKT": "punkty",
            "Z": "zwyciestwa",
            "R": "remisy",
            "P": "porazki",
            "BZ": "bramki_zdobyte",
            "BS": "bramki_stracone",
            "BILANS": "bilans_bramkowy",
            "śr. Pkt": "srednia_pkt",
            "śr. BZ": "srednia_bramki_zdobyte",
            "śr. BS": "srednia_bramki_stracone"
        }
    },
    {
        "filename": "łączne_średnie_drużynowe_na_kolejkę__wybrane_zdarzenia_dla.csv",
        "columns": {
            "KLUB": "klub",
            "SKRÓT": "skrot",
            "POS": "srednie_posiadanie_pilki",
            "STRZ": "srednia_strzaly",
            "STRZ C": "srednia_strzaly_celne",
            "STRZ NC": "srednia_strzaly_niecelne",
            "STRZ Z": "srednia_strzaly_zablokowane",
            "% STRZ C *": "procent_strzaly_celne",
            "% BR/STRZ *": "procent_bramki_strzaly",
            "RZR": "srednia_rzuty_rozne",
            "SP": "srednia_spalone",
            "OBR BR *": "srednia_interwencje_bramkarza",
            "FAULE": "srednia_fauli",
            "Ż": "srednia_zolte_kartki",
            "CZ": "srednia_czerwone_kartki"
        }
    },
    {
        "filename": "żółte_i_czerwone_kartki_pokazane_dla_zawodników_danej_drużyny.csv",
        "columns": {
            "KLUB": "klub",
            "ŻK": "zolte_kartki",
            "CZK": "czerwone_kartki",
            "CZK BEZP": "czerwone_kartki_bezposrednie"
        }
    },
    {
        "filename": "tabela_ekstraklasy_uwzględniająca_słupki_i_poprzeczki.csv",
        "columns": {
            "KLUB": "klub",
            "S/P": "slupki_i_poprzeczki",
            "S/P PRZECIW": "slupki_i_poprzeczki_przeciw"
        }
    },
        {
        "filename": "tabela_uwzględniająca_gole_strzelone_tylko_przez_polaków.csv",
        "columns": {
            "KLUB": "klub",
            "% GOLI PL": "procent_goli_polakow"
        }
    },
    {
        "filename": "statystyki_fauli__drużynowo.csv",
        "columns": {
            "KLUB": "klub",
            "FAULE": "faule",
            "FAULOWANI": "faulowani"
        }
    },
        {
        "filename": "statystyki_spalonych__drużynowo.csv",
        "columns": {
            "KLUB": "klub",
            "SPALONE": "spalone",
            "ŁAPALI NA SPAL": "spalone_przeciw"
        }
    },
    {
        "filename": "czas_gry__statystyki_indywidualne_młodzieżowców.csv",
        "columns": {
            "KLUB": "klub",
            "MIN MŁ PL": "liczba_minut_mlodziezowcy",
            "% MŁ PL": "procent_liczby_minut_mlodziezowcy",
            "ZAW": "zawodnicy",
            "MŁ PL": "zawodnicy_mlodziezowcy",
            "G MŁ PL": "liczba_goli_mlodziezowcy",
            "% G MŁ PL": "procent_liczby_goli_mlodziezowcy"
        }
    },
    {
        "filename": "czas_gry__statystyki__statystyki_dotyczące_obcokrajowców.csv",
        "columns": {
            "KLUB": "klub",
            "MIN ZAGR": "liczba_minut_obcokrajowcy",
            "% ZAGR": "procent_liczby_minut_obcokrajowcy",
            "ZAGR": "zawodnicy_obcokrajowcy",
            "G ZAGR": "liczba_goli_obcokrajowcy",
            "% G ZAGR": "procent_liczby_goli_obcokrajowcy"
        }
    },
    {
        "filename": "liczba_bramek_w_meczach_z_udziałem_drużyny.csv",
        "columns": {
            "KLUB": "klub",
            "Średnia goli w meczach z udziałem": "srednia_goli_w_meczach_z_udzialem_druzyny"
        }
    },
    {
        "filename": "średnia_frekwencja_w_meczach_klubów.csv",
        "columns": {
            "KLUB": "klub",
            "D-Z": "laczna_frekwencja_mecze_domowe",
            "ŚRD-Z": "srednia_frekwencja_mecze_domowe",
            "W-Z": "laczna_frekwencja_mecze_wyjazdowe",
            "ŚRW-Z": "srednia_frekwencja_mecze_wyjazdowe"
        }
    },
        {
        "filename": "wyniki_metody_expected_goals_zbiorczo_dla_każdej_drużyny",
        "columns": {
            "KLUB": "klub",
            "DLA xG": "dla_xG",
            "PRZECIW xG": "przeciw_xG",
            "BILANS xG": "bilans_przewidywanych_goli_xG",
            "xPKT": "przewidywane_punkty_xG",
            "BILANS xPKT": "bilans_przewidywanych_punktow_xG"
        }
    },
    {
        "filename": "gole_strzelone_po_stałych_fragmentach_gry.csv",
        "columns": {
            "KLUB": "klub",
            "KARNY": "gole_karny",
            "ROŻNY": "gole_rozny",
            "WOLNY": "gole_wolny",
            "WOLNY BEZP": "gole_wolny",
            "PO SFG": "gole_po_sfg",
            "% PO SFG": "procent_goli_po_sfg",
            "Z GRY": "gole_z_gry",
            "% Z GRY": "procent_goli_z_gry"
        }
    },
    {
        "filename": " podział_goli_na_części_ciała_drużynowo.csv",
        "columns": {
            "KLUB": "klub",
            "LN": "gole_lewa_noga",
            "PN": "gole_prawa_noga",
            "G": "gole_glowka",
            "INNE": "gole_inna_czesc_ciala"
        }
    },
    {
        "filename": "statystyka_stworzonych_okazji_przez_drużyny_bez_rzutów_karnych.csv",
        "columns": {
            "KLUB": "klub",
            "DLA": "liczba_stworzonych_okazji",
            "PRZECIW": "liczba_stworzonych_okazji_przeciw",
            "% WYK.": "procent_wykorzystanych_stworzonych_okazji",
            "% WYK.przeciw": "procent_wykorzystanych_stworzonych_okazji_przeciw"
        }
    },
    {
        "filename": "średnia_wieku_wyjściowych_jedenastek.csv",
        "columns": {
            "KLUB": "klub",
            "Średnia": "srednia_wieku_wyjsciowych_jedenastek"
        }
    },
    {
        "filename": "średnia_wzrostu_wyjściowych_jedenastek.csv",
        "columns": {
            "KLUB": "klub",
            "Średnia": "srednia_wzrostu_wyjsciowych_jedenastek"
        }
    },
]

# wczytanie i mapowanie danych z pliku CSV
def load_and_map_csv(source, season_folder):
    data = {}
    file_path = os.path.join(season_folder, source["filename"])

    if not os.path.exists(file_path):
        print(f"Plik {file_path} nie istnieje.")
        return data

    print(f"Ładowanie danych z pliku: {file_path}")
    with open(file_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"Nagłówki w pliku {file_path}: {headers}")
        
        missing_columns = [col for col in source["columns"].keys() if col not in headers]
        if missing_columns:
            print(f"⚠️ Brakujące kolumny w pliku {source['filename']}: {', '.join(missing_columns)}")

        for row in reader:
            klub = row.get("KLUB")
            if not klub:
                continue
            
            klub = klub.strip()
            key = klub

            # mapowanie danych
            mapped = {}
            for in_key, out_key in source["columns"].items():
                if in_key in row:
                    mapped[out_key] = try_cast(row[in_key])

            if not mapped:
                print(f"⚠️ Brak danych do zapisania dla klubu {klub} w pliku {source['filename']}.")
                continue

            if key not in data:
                data[key] = {}
            data[key].update(mapped)
    
    return data

# konwersja wartości
def try_cast(value):
    if value is None or value.strip() == '':
        return None

    value = value.replace(",", ".")
    try:
        if "." in value:
            return float(value)
        return int(value)
    except:
        return value.strip()

# scalanie źródeł
def merge_all_sources(season_folder):
    merged = defaultdict(dict)
    for source in CSV_SOURCES:
        source_data = load_and_map_csv(source, season_folder)
        for key, values in source_data.items():
            merged[key].update(values)
    return merged

# główna funkcja
def main():
    all_seasons_data = []
    output_dir = os.path.join(BASE_FOLDER, "../esv_app/public/stats/")  # Ścieżka do folderu, w którym będą zapisywane pliki JSON

    # tworzenie folderu
    if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"✅ Utworzono folder: {output_dir}")

    # iterowanie po wszystkich katalogach
    for season_folder in os.listdir(BASE_FOLDER):
        season_folder_path = os.path.join(BASE_FOLDER, season_folder)
        
        if os.path.isdir(season_folder_path):
            print(f"Ładowanie danych dla sezonu: {season_folder}")
            merged_data = merge_all_sources(season_folder_path)

            output = []
            for klub, data in merged_data.items():
                data["klub"] = klub
                data["sezon"] = season_folder
                output.append(data)

            output_filename = f"{season_folder}.json"
            output_filepath = os.path.join(output_dir, output_filename)

            if output:
                with open(output_filepath, "w", encoding="utf-8") as f:
                    json.dump(output, f, ensure_ascii=False, indent=2)
                print(f"✅ Zapisano plik {output_filename} do {output_dir}")
            else:
                print(f"⚠️ Brak danych do zapisania dla sezonu {season_folder}.")

            all_seasons_data.extend(output)

if __name__ == "__main__":
    main()
