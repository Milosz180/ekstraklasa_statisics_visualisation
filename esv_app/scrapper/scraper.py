import requests
from bs4 import BeautifulSoup
import csv
import os
import re

def save_table_to_csv(table, folder, table_name):
    # poberanie nagłówków kolumn
    headers = [th.text.strip() for th in table.find_all("th")]

    # pobieranie wierszy z tabeli
    rows = []
    for row in table.find("tbody").find_all("tr"):
        cells = [td.text.strip() for td in row.find_all("td")]
        rows.append(cells)

    # zapis do .csv
    filename = f"{folder}/{table_name}.csv"
    with open(filename, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Tabela '{table_name}' zapisana do {filename}")

# pobieranie i przetwarzanie tabel
def get_all_tables(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Błąd: nie można pobrać strony (status {response.status_code})")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # pobieranie nazwy folderu
    folder_name = url.rstrip("/").split("/")[-1]
    
    # tworzenie folderu
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    # pobieranie tabel ze strony
    tables = soup.find_all("table", class_="tablepress")
    if not tables:
        print(f"Nie znaleziono żadnych tabel na stronie {url}.")
        return

    # zapis tabel do pliku
    for idx, table in enumerate(tables, start=1):
        # nazwa tabeli domyślna
        table_name = f"table_{idx}"

        # nazwa tabeli szukana w opisie
        title_tag = table.find_previous("span", style="font-size: 14pt;")
        
        if title_tag:
            strong_tag = title_tag.find("strong")
            if strong_tag:
                table_name = strong_tag.text.strip().replace(" ", "_").lower()

        if not title_tag or not strong_tag:
            strong_tag = table.find_previous("strong")
            if strong_tag:
                table_name = strong_tag.text.strip().replace(" ", "_").lower()

        # usuwanie niepożądanych znaków
        table_name = re.sub(r'[^\w\s-]', '', table_name)

        # zapis tabeli do pliku
        save_table_to_csv(table, folder_name, table_name)

# funkcja do obsługi wielu URL
def process_multiple_urls(urls):
    for url in urls:
        print(f"Przetwarzanie strony: {url}")
        get_all_tables(url)

# lista url
urls = [
    "https://ekstrastats.pl/sezon-2023-24",
    "https://ekstrastats.pl/sezon-2022-23",
    "https://ekstrastats.pl/sezon-2021-22",
    "https://ekstrastats.pl/sezon-2020-21",
    "https://ekstrastats.pl/sezon-2019-20",
    "https://ekstrastats.pl/sezon-2018-19",
    "https://ekstrastats.pl/sezon-2017-18"
]

# przetwarzanie url
process_multiple_urls(urls)
