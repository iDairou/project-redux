README - "Zła Wersja" Projektu
🎯 Cel tego projektu
To jest celowo źle napisana aplikacja Task Manager, stworzona do pokazania problemów które rozwiązuje RTK Query i nowoczesna architektura frontend.

📂 Struktura projektu
src/
├── components/
│ ├── TaskList.tsx ❌ Problemy: fetch w useEffect, duplikacja
│ ├── TaskCounter.tsx ❌ Problemy: fetch w useEffect, duplikacja  
│ ├── AddTaskForm.tsx ❌ Problemy: fetch w handlerze, brak sync
│ └── TaskToggle.tsx ❌ Problemy: fetch w useEffect, duplikacja
├── App.tsx ✅ Główny komponent (na razie OK)
└── main.tsx ✅ Entry point z StrictMode

❌ PROBLEMY w obecnej wersji

1. Nadmiarowe requesty HTTP
   Problem:
   Każdy komponent robi własny fetch() do tego samego endpointu.
   Gdzie:

TaskList.tsx → GET /tasks
TaskCounter.tsx → GET /tasks
TaskToggle.tsx → GET /tasks

Rezultat:
6 requestów przy starcie (2 x 3 komponenty przez React Strict Mode)
Co powiedzieć:

"Otwórzcie DevTools Network. Widzicie 6 requestów do /tasks? To 3 komponenty razy 2 (Strict Mode). To ten sam endpoint, te same dane, ale każdy komponent robi swój request. Marnujemy bandwidth i obciążamy serwer."

2. Brak cache'owania
   Problem:
   Za każdym re-mountem komponentu → nowy request, zero cache.
   Gdzie:
   Wszystkie komponenty z useEffect(() => fetch(...), [])
   Test:
   Przejdź do innej zakładki w przeglądarce i wróć → kolejne requesty.
   Co powiedzieć:

"Nie mamy cache. Gdybyśmy odmontowali i zamontowali komponent ponownie, znowu poleciałby request. Użytkownik może być w aplikacji 10 minut, ale za każdym razem gdy wraca do widoku tasków - nowy request."

3. Brak synchronizacji między komponentami
   Problem:
   Każdy komponent ma swoją lokalną kopię danych w useState. Zmiana w jednym nie aktualizuje innych.
   Gdzie:

TaskToggle.tsx - zaznaczasz checkbox
TaskList.tsx - nie wie że task się zmienił
TaskCounter.tsx - pokazuje błędne statystyki

Test:

Zaznacz checkbox w TaskToggle (np. Task 1)
TaskToggle odświeży swoje dane (task przekreślony)
TaskList NIE pokaże zmiany (task nie przekreślony)
TaskCounter NIE zaktualizuje licznika
Dopiero F5 (odświeżenie strony) pokaże poprawne dane

Co powiedzieć:

"Patrzcie - zaznaczam checkbox. TaskToggle się aktualizuje, ale TaskList i TaskCounter mają stare dane! Każdy komponent ma własny useState, własną kopię danych. Nie ma między nimi komunikacji. Użytkownik musi odświeżyć stronę żeby zobaczyć zmiany."

4. Duplikacja kodu
   Problem:
   Ten sam kod pojawia się w wielu miejscach.
   Gdzie:
   a) Typ Task zdefiniowany 4 razy:

TaskList.tsx:5
TaskCounter.tsx:5
AddTaskForm.tsx (nie ma typu ale używa)
TaskToggle.tsx:5

b) Fetch logic 3 razy:
typescriptuseEffect(() => {
setIsLoading(true);
fetch('http://localhost:3001/tasks')
.then(response => response.json())
.then(setTasks)
.finally(() => setIsLoading(false));
}, []);
c) Loading states 3 razy:
typescriptconst [isLoading, setIsLoading] = useState(false);
if (isLoading) return <div>Ładowanie...</div>;

```

**Co powiedzieć:**
> "Widzicie ile duplikacji? Interface Task powtórzony 4 razy. Fetch logic 3 razy. Loading states 3 razy. Co jeśli API się zmieni? Muszę edytować 3 pliki. Co jeśli chcę dodać error handling? 3 pliki. To koszmar maintenance."

---

### **5. "Mignięcie" loadera przy refetch**

**Problem:**
Przy `setIsLoading(true)` cały komponent znika i pokazuje "Ładowanie...", potem wraca.

**Gdzie:**
`TaskToggle.tsx` - zaznacz checkbox → lista znika na moment → wraca

**Test:**
1. Zaznacz checkbox w `TaskToggle`
2. Zobacz jak lista **znika całkowicie** (pokazuje "Ładowanie...")
3. Po ~100-300ms lista **wraca**

**Co powiedzieć:**
> "Zobacz to mignięcie? Przy aktualizacji cała lista znika. To irytujące dla użytkownika. RTK Query ma `isFetching` - dane zostają na ekranie, tylko mały spinner się pokazuje."

---

### **6. ESLint warnings**

**Problem:**
`setState` bezpośrednio w `useEffect` wywołuje warning.

**Gdzie:**
- `TaskCounter.tsx:17` - `setIsLoading(true)` w useEffect
- `TaskList.tsx` - analogicznie
- `TaskToggle.tsx` - analogicznie

**Warning:**
```

Calling setState synchronously within an effect can trigger cascading renders

```

**Co powiedzieć:**
> "ESLint krzyczy na nas - i słusznie! `setState` bezpośrednio w `useEffect` może powodować cascading renders. To anty-pattern. RTK Query nie ma takich problemów - wszystko jest zarządzane automatycznie."

---

### **7. Brak automatycznego odświeżania po mutacji**

**Problem:**
Dodanie nowego taska nie odświeża listy automatycznie.

**Gdzie:**
`AddTaskForm.tsx` - kliknij "Dodaj Task"

**Test:**
1. Wpisz nazwę taska i kliknij "Dodaj Task"
2. Alert: "Task dodany! Odśwież stronę żeby zobaczyć."
3. Lista **NIE** pokazuje nowego taska
4. Musisz ręcznie F5

**Co powiedzieć:**
> "Dodaję task. Backend przyjął dane, wszystko OK. Ale lista się nie odświeża! Muszę powiedzieć użytkownikowi: 'odśwież stronę'. To wstyd. RTK Query z invalidatesTags robi to automatycznie."

---

### **8. Brak struktury projektu**

**Problem:**
Wszystkie komponenty w jednym folderze, brak organizacji.

**Gdzie:**
```

components/
├── TaskList.tsx
├── TaskCounter.tsx
├── AddTaskForm.tsx
└── TaskToggle.tsx
Co powiedzieć:

"Wszystko w jednym worku. Gdzie API? Gdzie typy? Gdzie logika biznesowa? W realnym projekcie to by było nieczytelne. Potem pokażę strukturę feature-first."

🎯 Co pokażemy podczas refactoru?
Etap 1: RTK Query Cache

✅ Jeden request zamiast 6
✅ Automatyczne cache'owanie
✅ Synchronizacja między komponentami
✅ Tagi + automatyczna invalidacja

Etap 2: Normalizacja danych

✅ Płaska struktura zamiast zagnieżdżonej
✅ Brak duplikacji danych

Etap 3: Redux + modułowość

✅ Typy w osobnym pliku
✅ Barrel exports
✅ Clean architecture

Etap 4: Presenter/Container

✅ Separacja logiki od UI
✅ Testowalność

Etap 5: Feature-First struktura

✅ Organizacja według features
✅ Skalowalność

🚀 Jak uruchomić projekt?
bash# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Mock API (JSON Server)

npm run api
Otwórz: http://localhost:5173
DevTools Network → zobacz problemy na żywo!

📊 Metryki "złej wersji"

HTTP Requests przy starcie: 6 (powinno być 1)
Duplikacja typu Task: 4x (powinno być 1x)
Duplikacja fetch logic: 3x (powinno być 0x)
Ręczne odświeżanie: TAK (powinno być NIE)
ESLint warnings: 3 (powinno być 0)
