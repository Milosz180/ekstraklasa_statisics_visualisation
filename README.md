# ekstraklasa_statisics_visualisation
 Web app that allows users to visualize and compare football statistics from the Polish Ekstraklasa league. This app pulls data from ekstrastats.pl and enables users to compare teams’ performances across various seasons using interactive charts and graphs.

# instalacja potrzebnych bibliotek z poziomu folderu EKSTRAKLASA_STATISTICS_VISUALISATION
Git clone https://github.com/Milosz180/ekstraklasa_statisics_visualisation.git
pip install -r requirements.txt
npm install --prefix ./esv_app
# Odpalenie frontendu aplikacji
1. Zainstaluj zależności: npm install
2. Odpal projekt: npm start 
# testowanie
W folderze ./esv_app/src odpalamy komendę test do uruchomienia testów frontendowych
W folderze ./backend_fastapi odpalamy komendę pytest do uruchomienia testów backendowych 

pip install fastapi uvicorn psycopg[binary] asyncpg sqlalchemy passlib[bcrypt] python-jose or pip install "psycopg[binary]" "passlib[bcrypt]" fastapi uvicorn asyncpg sqlalchemy python-jose
 npm install express cors