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
            "POS": "posiadanie_pilki",
            "STRZ": "strzaly",
            "STRZ C": "strzaly_celne",
            "STRZ NC": "strzaly_niecelne",
            "STRZ Z": "strzaly_zablokowane",
            "% STRZ C *": "procent_strzaly_celne",
            "% BR/STRZ *": "procent_bramki_strzaly",
            "RZR": "rzuty_rozne",
            "SP": "spalone",
            "OBR BR *": "interwencje_bramkarza",
            "FAULE": "faulowane",
            "Ż": "zolte_karteczki",
            "CZ": "czerwone_karteczki"
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
            if output:
                with open(output_filename, "w", encoding="utf-8") as f:
                    json.dump(output, f, ensure_ascii=False, indent=2)
                print(f"✅ Zapisano plik {output_filename}")
            else:
                print(f"⚠️ Brak danych do zapisania dla sezonu {season_folder}.")

            all_seasons_data.extend(output)

if __name__ == "__main__":
    main()
