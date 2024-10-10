# Feedback App: Unit Tests

Hier sind die **Jest-Unit-Tests** für die gesamte Anwendung, die auf der strukturierten Neugestaltung der Applikation basieren. Diese Tests decken sowohl die Geschäftslogik, die Middleware als auch die Routen-Handler ab.

### Projektstruktur für Tests:

```
/app
  ├── __tests__
  │   ├── feedbackController.test.js   // Tests für feedbackController
  │   ├── feedbackRoutes.test.js       // Tests für feedbackRoutes
  │   ├── validation.test.js           // Tests für Validierungsmiddleware
  │   ├── errorHandler.test.js         // Tests für Fehlerbehandlungsmiddleware
  │   ├── responseHelper.test.js
  ├── controllers
  │   └── feedbackController.js
  ├── middlewares
  │   ├── validation.js
  │   └── errorHandler.js
  ├── routes
  │   └── feedbackRoutes.js
  ├── utils
  │   └── responseHelper.js
  ├── db.js
  ├── server.js

```

---

## 1. **Unit-Tests für `feedbackController.js`**

```jsx
// __tests__/feedbackController.test.js
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';
import { pool } from '../db';

jest.mock('../db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Feedback Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add feedback successfully', async () => {
        const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
        pool.query.mockResolvedValue({ rows: [mockFeedback] });

        const result = await addFeedback('Test Feedback', 'Test text');

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *',
            ['Test Feedback', 'Test text']
        );
    });

    it('should get all feedback successfully', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        pool.query.mockResolvedValue({ rows: mockFeedback });

        const result = await getAllFeedback();

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feedback');
    });

    it('should delete feedback by ID', async () => {
        const mockResponse = { rowCount: 1 };
        pool.query.mockResolvedValue(mockResponse);

        const result = await deleteFeedbackById(1);

        expect(result).toEqual(mockResponse);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [1]);
    });

    it('should handle delete feedback not found', async () => {
        const mockResponse = { rowCount: 0 };
        pool.query.mockResolvedValue(mockResponse);

        const result = await deleteFeedbackById(999);

        expect(result.rowCount).toBe(0);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [999]);
    });
});

```

---

Dieser Code beschreibt Unit-Tests für die Funktionen des **Feedback-Controllers** in einer Node.js-Anwendung, die mit dem Testframework **Jest** durchgeführt werden. Unit-Tests überprüfen einzelne Funktionen (in diesem Fall: Hinzufügen, Abrufen und Löschen von Feedback) isoliert, um sicherzustellen, dass sie wie erwartet funktionieren.

1. **Import der zu testenden Funktionen:**
    
    ```jsx
    import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';
    import { pool } from '../db';
    
    ```
    
    Hier werden drei Funktionen aus dem Feedback-Controller importiert: `addFeedback` (zum Hinzufügen von Feedback), `getAllFeedback` (zum Abrufen aller Feedbacks) und `deleteFeedbackById` (zum Löschen eines Feedbacks). Außerdem wird der `pool` aus der `db.js`-Datei importiert. Der `pool` repräsentiert die Verbindung zur Datenbank.
    
2. **Mocking der Datenbank (`jest.mock`):**
    
    ```jsx
    jest.mock('../db', () => ({
        pool: {
            query: jest.fn(),
        },
    }));
    
    ```
    
    In diesem Abschnitt wird die Datenbankverbindung (`pool`) mit Jest gemockt. **Mocking** bedeutet, dass wir die tatsächliche Datenbankverbindung simulieren, damit der Test nicht auf eine echte Datenbank zugreifen muss. Stattdessen werden die Abfragen (`query`) durch Jest simuliert, sodass wir steuern können, welche Daten zurückgegeben werden.
    
3. **Test-Block (`describe`):**
    
    ```jsx
    describe('Feedback Controller', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
    });
    
    ```
    
    Der `describe`-Block gruppiert mehrere Tests, die sich auf den **Feedback Controller** beziehen. Im `afterEach`-Block wird nach jedem Test `jest.clearAllMocks()` aufgerufen, um sicherzustellen, dass alle Mock-Funktionen zurückgesetzt werden, sodass jeder Test isoliert bleibt.
    
4. **Erster Test: Hinzufügen von Feedback**
    
    ```jsx
    it('should add feedback successfully', async () => {
        const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
        pool.query.mockResolvedValue({ rows: [mockFeedback] });
    
        const result = await addFeedback('Test Feedback', 'Test text');
    
        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *',
            ['Test Feedback', 'Test text']
        );
    });
    
    ```
    
    Dieser Test überprüft die Funktion `addFeedback`:
    
    - Zuerst wird ein **Mock-Datenobjekt** erstellt (`mockFeedback`), das simuliert, wie ein Feedback-Eintrag aussehen könnte.
    - Mit `pool.query.mockResolvedValue` wird festgelegt, dass, wenn die `query`Funktion aufgerufen wird, das Mock-Feedback zurückgegeben wird.
    - Die `addFeedback`Funktion wird dann mit einem Titel und einem Text aufgerufen.
    - Mit `expect(result).toEqual(mockFeedback)` wird überprüft, ob das Ergebnis der Funktion dem simulierten Feedback entspricht.
    - `expect(pool.query).toHaveBeenCalledWith(...)` stellt sicher, dass die SQL-Abfrage korrekt ausgeführt wurde.
5. **Zweiter Test: Abrufen aller Feedbacks**
    
    ```jsx
    it('should get all feedback successfully', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        pool.query.mockResolvedValue({ rows: mockFeedback });
    
        const result = await getAllFeedback();
    
        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feedback');
    });
    
    ```
    
    Hier wird die Funktion `getAllFeedback` getestet:
    
    - Ein Mock-Array (`mockFeedback`) simuliert eine Liste von Feedback-Einträgen.
    - Die Funktion `getAllFeedback` wird aufgerufen, und es wird überprüft, ob das Ergebnis der Funktion der simulierten Liste entspricht.
    - Außerdem wird sichergestellt, dass die richtige SQL-Abfrage (`SELECT * FROM feedback`) ausgeführt wurde.
6. **Dritter Test: Löschen eines Feedbacks nach ID**
    
    ```jsx
    it('should delete feedback by ID', async () => {
        const mockResponse = { rowCount: 1 };
        pool.query.mockResolvedValue(mockResponse);
    
        const result = await deleteFeedbackById(1);
    
        expect(result).toEqual(mockResponse);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [1]);
    });
    
    ```
    
    Dieser Test überprüft die Funktion `deleteFeedbackById`:
    
    - Ein Mock-Objekt (`mockResponse`) mit `rowCount: 1` simuliert eine erfolgreiche Löschung.
    - Die Funktion `deleteFeedbackById` wird mit der ID `1` aufgerufen.
    - Es wird überprüft, ob das Ergebnis der Funktion mit dem Mock-Objekt übereinstimmt und ob die richtige SQL-Abfrage ausgeführt wurde.
7. **Vierter Test: Löschen eines nicht existierenden Feedbacks**
    
    ```jsx
    it('should handle delete feedback not found', async () => {
        const mockResponse = { rowCount: 0 };
        pool.query.mockResolvedValue(mockResponse);
    
        const result = await deleteFeedbackById(999);
    
        expect(result.rowCount).toBe(0);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [999]);
    });
    
    ```
    
    Hier wird getestet, was passiert, wenn versucht wird, ein nicht existierendes Feedback zu löschen:
    
    - Ein Mock-Objekt (`mockResponse`) mit `rowCount: 0` simuliert, dass kein Eintrag gelöscht wurde.
    - Die Funktion `deleteFeedbackById` wird mit der ID `999` aufgerufen.
    - Es wird überprüft, ob die `rowCount`Eigenschaft im Ergebnis `0` ist, was bedeutet, dass nichts gelöscht wurde, und ob die korrekte SQL-Abfrage ausgeführt wurde.

Dieser Testcode verwendet **Jest**, um Funktionen des **Feedback-Controllers** zu testen. Statt auf eine echte Datenbank zuzugreifen, werden die SQL-Abfragen durch **Mocks** simuliert. Die Tests überprüfen, ob die richtigen Abfragen ausgeführt werden und ob die Rückgaben der Funktionen den erwarteten Ergebnissen entsprechen. Durch das Testen einzelner Funktionen wird sichergestellt, dass diese korrekt arbeiten und die Anwendung stabil bleibt.

## 2. **Unit-Tests für `feedbackRoutes.js`**

```jsx
// __tests__/feedbackRoutes.test.js
import request from 'supertest';
import express from 'express';
import feedbackRoutes from '../routes/feedbackRoutes';
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';

jest.mock('../controllers/feedbackController', () => ({
    addFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    deleteFeedbackById: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', feedbackRoutes);

describe('Feedback Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /feedback - should add feedback and return 201', async () => {
        const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
        addFeedback.mockResolvedValue(mockFeedback);

        const response = await request(app)
            .post('/feedback')
            .send({ title: 'Test Feedback', text: 'Test text' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Feedback added successfully');
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('GET /feedback - should return all feedback', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        getAllFeedback.mockResolvedValue(mockFeedback);

        const response = await request(app).get('/feedback');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('DELETE /feedback/:id - should delete feedback and return 200', async () => {
        deleteFeedbackById.mockResolvedValue({ rowCount: 1 });

        const response = await request(app).delete('/feedback/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Feedback deleted successfully');
    });

    it('DELETE /feedback/:id - should return 404 if feedback not found', async () => {
        deleteFeedbackById.mockResolvedValue({ rowCount: 0 });

        const response = await request(app).delete('/feedback/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Feedback not found.');
    });
});

```

---

Dieser Code enthält Unit-Tests für die Routen deiner **Feedback-App**. Unit-Tests sind Tests, die einzelne Teile deines Codes isoliert prüfen, um sicherzustellen, dass sie wie erwartet funktionieren.

### Überblick

- **Jest**: Ein beliebtes Testframework für JavaScript, das von Facebook entwickelt wurde.
- **Supertest**: Eine Bibliothek, die das Testen von HTTP-Servern vereinfacht, indem sie HTTP-Anfragen simuliert.
- **Express**: Ein Web-Framework für Node.js, das zur Erstellung von APIs und Webanwendungen verwendet wird.
- **Mocking**: Eine Technik, bei der bestimmte Teile deines Codes durch Platzhalter ersetzt werden, um isolierte Tests zu ermöglichen.

1. **Importieren der notwendigen Module**

```jsx
import request from 'supertest';
import express from 'express';
import feedbackRoutes from '../routes/feedbackRoutes';
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';

```

- **`supertest`**: Wird verwendet, um HTTP-Anfragen an deinen Express-Server zu senden und die Antworten zu prüfen.
- **`express`**: Das Web-Framework, das deine API-Routen enthält.
- **`feedbackRoutes`**: Die Datei, die die Routen (Endpoints) deiner Feedback-App definiert.
- **`addFeedback`, `getAllFeedback`, `deleteFeedbackById`**: Funktionen aus deinem Feedback-Controller, die das Hinzufügen, Abrufen und Löschen von Feedback handhaben.

2. **Mocking der Controller-Funktionen**

```jsx
jest.mock('../controllers/feedbackController', () => ({
    addFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    deleteFeedbackById: jest.fn(),
}));

```

- **`jest.mock`**: Diese Funktion ersetzt die tatsächlichen Implementierungen der `addFeedback`, `getAllFeedback` und `deleteFeedbackById` Funktionen durch Mock-Funktionen. Das bedeutet, dass während der Tests keine echten Datenbankoperationen durchgeführt werden.
- **`jest.fn()`**: Erstellt eine Mock-Funktion, die später in den Tests konfiguriert werden kann, um bestimmte Werte zurückzugeben.

3. **Einrichten der Express-Anwendung für Tests**

```jsx
const app = express();
app.use(express.json());
app.use('/', feedbackRoutes);

```

- **`express()`**: Erstellt eine neue Express-Anwendung.
- **`app.use(express.json())`**: Fügt Middleware hinzu, die JSON-Anfragen automatisch verarbeitet.
- **`app.use('/', feedbackRoutes)`**: Bindet die Feedback-Routen an die Hauptanwendung. Alle Anfragen an den Root-Pfad (`/`) werden an `feedbackRoutes` weitergeleitet.

4. **Beschreiben der Test-Suite**

```jsx
describe('Feedback Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Einzelne Tests folgen hier...
});

```

- **`describe`**: Gruppiert zusammengehörige Tests. In diesem Fall gruppieren wir alle Tests, die sich auf die Feedback-Routen beziehen.
- **`afterEach`**: Eine Funktion, die nach jedem einzelnen Test ausgeführt wird. Hier wird `jest.clearAllMocks()` aufgerufen, um sicherzustellen, dass alle Mock-Funktionen nach jedem Test zurückgesetzt werden. Dies verhindert, dass Mock-Aufrufe von einem Test den nächsten beeinflussen.

5. **Erster Test: Hinzufügen von Feedback**

```jsx
it('POST /feedback - should add feedback and return 201', async () => {
    const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
    addFeedback.mockResolvedValue(mockFeedback);

    const response = await request(app)
        .post('/feedback')
        .send({ title: 'Test Feedback', text: 'Test text' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Feedback added successfully');
    expect(response.body.data).toEqual(mockFeedback);
});

```

- **`it`**: Definiert einen einzelnen Testfall. Der erste Parameter ist eine Beschreibung des Tests, der zweite Parameter ist eine asynchrone Funktion, die den Test enthält.
- **`mockFeedback`**: Ein Objekt, das das erwartete Feedback repräsentiert, das zurückgegeben werden soll.
- **`addFeedback.mockResolvedValue(mockFeedback)`**: Konfiguriert die Mock-Funktion `addFeedback` so, dass sie das `mockFeedback`Objekt zurückgibt, wenn sie aufgerufen wird.
- **`request(app).post('/feedback').send({...})`**: Sendet eine POST-Anfrage an den `/feedback`Endpunkt mit den angegebenen Daten.
- **`expect(response.status).toBe(201)`**: Prüft, ob der HTTP-Statuscode der Antwort `201` (Created) ist.
- **`expect(response.body.message).toBe('Feedback added successfully')`**: Prüft, ob die Nachricht in der Antwort korrekt ist.
- **`expect(response.body.data).toEqual(mockFeedback)`**: Prüft, ob die zurückgegebenen Daten dem erwarteten Mock-Feedback entsprechen.

6. **Zweiter Test: Abrufen aller Feedbacks**

```jsx
it('GET /feedback - should return all feedback', async () => {
    const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
    getAllFeedback.mockResolvedValue(mockFeedback);

    const response = await request(app).get('/feedback');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockFeedback);
});

```

- **`mockFeedback`**: Ein Array von Feedback-Objekten, das die erwarteten Feedbacks repräsentiert.
- **`getAllFeedback.mockResolvedValue(mockFeedback)`**: Konfiguriert die Mock-Funktion `getAllFeedback` so, dass sie das `mockFeedback`Array zurückgibt.
- **`request(app).get('/feedback')`**: Sendet eine GET-Anfrage an den `/feedback`Endpunkt.
- **`expect(response.status).toBe(200)`**: Prüft, ob der HTTP-Statuscode der Antwort `200` (OK) ist.
- **`expect(response.body.data).toEqual(mockFeedback)`**: Prüft, ob die zurückgegebenen Daten dem erwarteten Mock-Feedback entsprechen.

7. **Dritter Test: Löschen eines Feedbacks nach ID**

```jsx
it('DELETE /feedback/:id - should delete feedback and return 200', async () => {
    deleteFeedbackById.mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete('/feedback/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Feedback deleted successfully');
});

```

- **`deleteFeedbackById.mockResolvedValue({ rowCount: 1 })`**: Konfiguriert die Mock-Funktion `deleteFeedbackById` so, dass sie ein Objekt mit `rowCount: 1` zurückgibt, was bedeutet, dass ein Eintrag erfolgreich gelöscht wurde.
- **`request(app).delete('/feedback/1')`**: Sendet eine DELETE-Anfrage an den `/feedback/1`Endpunkt, um das Feedback mit der ID `1` zu löschen.
- **`expect(response.status).toBe(200)`**: Prüft, ob der HTTP-Statuscode der Antwort `200` (OK) ist.
- **`expect(response.body.message).toBe('Feedback deleted successfully')`**: Prüft, ob die Nachricht in der Antwort korrekt ist.

8. **Vierter Test: Löschen eines nicht existierenden Feedbacks**

```jsx
it('DELETE /feedback/:id - should return 404 if feedback not found', async () => {
    deleteFeedbackById.mockResolvedValue({ rowCount: 0 });

    const response = await request(app).delete('/feedback/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Feedback not found.');
});

```

- **`deleteFeedbackById.mockResolvedValue({ rowCount: 0 })`**: Konfiguriert die Mock-Funktion `deleteFeedbackById` so, dass sie ein Objekt mit `rowCount: 0` zurückgibt, was bedeutet, dass kein Eintrag zum Löschen gefunden wurde.
- **`request(app).delete('/feedback/999')`**: Sendet eine DELETE-Anfrage an den `/feedback/999`Endpunkt, um das Feedback mit der ID `999` zu löschen, das vermutlich nicht existiert.
- **`expect(response.status).toBe(404)`**: Prüft, ob der HTTP-Statuscode der Antwort `404` (Not Found) ist.
- **`expect(response.body.error).toBe('Feedback not found.')`**: Prüft, ob die Fehlermeldung in der Antwort korrekt ist.

Dieser Testcode überprüft, ob die Feedback-Routen deiner Anwendung korrekt funktionieren. Hier sind die Hauptpunkte:

1. **Importe**: Importiert die notwendigen Module und Funktionen, die getestet werden sollen.
2. **Mocking**: Ersetzt die echten Controller-Funktionen durch Mock-Funktionen, um isolierte Tests zu ermöglichen, ohne eine echte Datenbank zu benötigen.
3. **Express-App für Tests**: Erstellt eine Express-Anwendung und bindet die Feedback-Routen ein, um die Routen in den Tests zu testen.
4. **Test-Suite (`describe`)**: Gruppiert die Tests, die sich auf die Feedback-Routen beziehen.
5. **Einzelne Tests (`it`)**: Definiert einzelne Testfälle für verschiedene Szenarien:
    - Hinzufügen von Feedback
    - Abrufen aller Feedbacks
    - Löschen eines Feedbacks nach ID
    - Versuch, ein nicht existierendes Feedback zu löschen
6. **Assertions (`expect`)**: Überprüft, ob die tatsächlichen Ergebnisse den erwarteten Ergebnissen entsprechen, z.B. richtige Statuscodes und Nachrichten.

Durch das Schreiben und Ausführen solcher Tests stellst du sicher, dass deine Routen wie erwartet funktionieren und potenzielle Fehler frühzeitig erkannt werden. Dies erhöht die Zuverlässigkeit und Qualität deiner Anwendung erheblich.

## 3. **Unit-Tests für `validation.js`**

```jsx
// __tests__/validation.test.js
import { feedbackValidation } from '../middlewares/validation';
import { validationResult } from 'express-validator';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

app.post('/feedback', feedbackValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: 'Validation passed' });
});

describe('Validation Middleware', () => {
    it('should fail validation when title is missing', async () => {
        const response = await request(app).post('/feedback').send({ text: 'Some text' });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
    });

    it('should pass validation when both title and text are provided', async () => {
        const response = await request(app).post('/feedback').send({ title: 'Test', text: 'Test text' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Validation passed');
    });
});

```

---

Dieser Code ist ein **Unit-Test** für die **Validierungsmiddleware** in einer Express-Anwendung. Unit-Tests werden verwendet, um einzelne Teile einer Anwendung zu überprüfen und sicherzustellen, dass sie wie erwartet funktionieren. In diesem Fall wird getestet, ob die Middleware, die für die Validierung der Eingabedaten zuständig ist, korrekt funktioniert.

1. **Importieren der benötigten Module**

```jsx
import { feedbackValidation } from '../middlewares/validation';
import { validationResult } from 'express-validator';
import express from 'express';
import request from 'supertest';

```

- **`feedbackValidation`**: Diese Funktion kommt aus deiner Middleware und enthält die Logik zur Überprüfung, ob die erforderlichen Felder in der Anfrage vorhanden sind. In diesem Fall prüft sie, ob `title` und `text` gesendet wurden.
- **`validationResult`**: Kommt aus der Bibliothek `express-validator` und hilft, die Validierungsergebnisse zu extrahieren.
- **`express`**: Express ist ein beliebtes Web-Framework, das hier verwendet wird, um eine Testanwendung zu erstellen.
- **`request`**: Kommt aus der Bibliothek `supertest`, die HTTP-Anfragen simuliert, um Endpunkte zu testen.

2. **Erstellen einer Testanwendung**

```jsx
const app = express();
app.use(express.json());

```

- **`app`**: Hier wird eine neue Express-Anwendung erstellt.
- **`app.use(express.json())`**: Fügt Middleware hinzu, um JSON-Daten in Anfragen zu verarbeiten. Dies ist notwendig, da die zu testenden Routen JSON-Daten verarbeiten.

3. **Definieren der Feedback-Route**

```jsx
app.post('/feedback', feedbackValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: 'Validation passed' });
});

```

- **`app.post('/feedback', feedbackValidation)`**: Dies definiert eine POST-Route `/feedback`. Bevor die Anfrage verarbeitet wird, führt die Middleware `feedbackValidation` eine Validierung durch.
- **`validationResult(req)`**: Diese Funktion prüft, ob es bei der Validierung Fehler gab.
- **`if (!errors.isEmpty())`**: Wenn die Validierung Fehler ergeben hat (z.B. wenn ein erforderliches Feld fehlt), wird der HTTP-Statuscode 400 (Bad Request) zurückgegeben und die Fehler werden im JSON-Format ausgegeben.
- **`res.status(200).json({ message: 'Validation passed' })`**: Wenn es keine Validierungsfehler gibt, wird eine Erfolgsnachricht mit dem Statuscode 200 zurückgegeben.

4. **Beschreiben der Test-Suite**

```jsx
describe('Validation Middleware', () => {
    it('should fail validation when title is missing', async () => {
        const response = await request(app).post('/feedback').send({ text: 'Some text' });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
    });

    it('should pass validation when both title and text are provided', async () => {
        const response = await request(app).post('/feedback').send({ title: 'Test', text: 'Test text' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Validation passed');
    });
});

```

- **`describe('Validation Middleware', () => {...})`**: Dieser Block gruppiert mehrere Tests, die die Validierungsmiddleware betreffen.
- **`it('should fail validation when title is missing', async () => {...})`**: Definiert den ersten Test, der sicherstellt, dass die Validierung fehlschlägt, wenn das `title`Feld fehlt.
    - **`request(app).post('/feedback').send({ text: 'Some text' })`**: Simuliert eine POST-Anfrage an die `/feedback`Route, ohne das `title`Feld zu senden.
    - **`expect(response.status).toBe(400)`**: Überprüft, ob der Statuscode 400 zurückgegeben wird, was bedeutet, dass die Validierung fehlgeschlagen ist.
    - **`expect(response.body.errors[0].msg).toBe('Title is required')`**: Überprüft, ob die Fehlermeldung `"Title is required"` in der Antwort enthalten ist.
- **`it('should pass validation when both title and text are provided', async () => {...})`**: Der zweite Test stellt sicher, dass die Validierung erfolgreich ist, wenn beide Felder (`title` und `text`) vorhanden sind.
    - **`request(app).post('/feedback').send({ title: 'Test', text: 'Test text' })`**: Simuliert eine POST-Anfrage an die `/feedback`Route mit den erforderlichen Feldern `title` und `text`.
    - **`expect(response.status).toBe(200)`**: Überprüft, ob der Statuscode 200 zurückgegeben wird, was bedeutet, dass die Validierung erfolgreich war.
    - **`expect(response.body.message).toBe('Validation passed')`**: Überprüft, ob die Erfolgsnachricht `"Validation passed"` in der Antwort enthalten ist.

Dieser Testcode stellt sicher, dass die Validierungsmiddleware für das Hinzufügen von Feedback ordnungsgemäß funktioniert:

1. Wenn das **`title`**Feld fehlt, schlägt die Validierung fehl und es wird ein Statuscode 400 zurückgegeben, zusammen mit einer Fehlermeldung.
2. Wenn sowohl **`title`** als auch **`text`** vorhanden sind, wird die Validierung bestanden und es wird eine Erfolgsnachricht mit Statuscode 200 zurückgegeben.

Die Unit-Tests helfen sicherzustellen, dass die Validierung in verschiedenen Szenarien korrekt funktioniert, ohne dass dafür eine echte Datenbank oder externe Abhängigkeiten erforderlich sind.

## 4. **Unit-Tests für `errorHandler.js`**

```jsx
// __tests__/errorHandler.test.js
import { errorHandler } from '../middlewares/errorHandler';
import express from 'express';
import request from 'supertest';

const app = express();

app.get('/error', (req, res) => {
    throw new Error('Test Error');
});

app.use(errorHandler);

describe('Error Handler Middleware', () => {
    it('should handle errors and return 500', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});

```

---

Dieser Code beschreibt einen **Unit-Test** für eine **Error-Handler-Middleware** in einer Express-Anwendung. Unit-Tests prüfen, ob ein bestimmter Teil des Codes, in diesem Fall die Fehlerbehandlungsmiddleware, korrekt funktioniert.

1. **Importieren der notwendigen Module**

```jsx
import { errorHandler } from '../middlewares/errorHandler';
import express from 'express';
import request from 'supertest';

```

- **`errorHandler`**: Die Middleware, die Fehler in der Anwendung abfängt und behandelt. Sie stammt aus einer separaten Datei und wird im Test überprüft.
- **`express`**: Express ist ein Web-Framework für Node.js, das hier verwendet wird, um eine einfache Testanwendung zu erstellen.
- **`request`**: Kommt aus der Bibliothek `supertest`, die verwendet wird, um HTTP-Anfragen zu simulieren und zu testen, wie die Anwendung darauf reagiert.

2. **Erstellen einer Testanwendung**

```jsx
const app = express();

```

- **`app`**: Erstellt eine neue Express-Anwendung, in der wir Routen definieren und die Middleware anwenden.

3. **Definieren einer Route, die absichtlich einen Fehler auslöst**

```jsx
app.get('/error', (req, res) => {
    throw new Error('Test Error');
});

```

- Hier wird eine GET-Route `/error` definiert. Jedes Mal, wenn diese Route aufgerufen wird, wird absichtlich ein Fehler ausgelöst: `throw new Error('Test Error')`.
- Dieser Fehler wird dann von der `errorHandler`Middleware abgefangen und verarbeitet.

4. **Anwenden der Error-Handler-Middleware**

```jsx
app.use(errorHandler);

```

- Mit dieser Zeile wird die `errorHandler`Middleware auf die Anwendung angewendet. Das bedeutet, dass alle Fehler, die im Code auftreten, von dieser Middleware behandelt werden. Die Aufgabe dieser Middleware besteht darin, die Fehler zu fangen und eine entsprechende Antwort an den Client zurückzugeben, anstatt den Server abstürzen zu lassen.

5. **Beschreiben der Test-Suite**

```jsx
describe('Error Handler Middleware', () => {
    it('should handle errors and return 500', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});

```

- **`describe('Error Handler Middleware', () => {...})`**: Gruppiert alle Tests, die die Error-Handler-Middleware betreffen. Hier wird nur ein Test definiert.
- **`it('should handle errors and return 500', async () => {...})`**: Definiert den Testfall. Es wird getestet, ob die Fehlerbehandlung korrekt funktioniert und einen Statuscode 500 zurückgibt, wenn ein Fehler auftritt.
    - **`request(app).get('/error')`**: Sendet eine GET-Anfrage an die Route `/error`, die absichtlich einen Fehler auslöst.
    - **`expect(response.status).toBe(500)`**: Überprüft, ob der HTTP-Statuscode der Antwort `500` ist, was bedeutet, dass ein interner Serverfehler aufgetreten ist.
    - **`expect(response.body.error).toBe('Internal Server Error')`**: Überprüft, ob die Fehlermeldung in der Antwort `"Internal Server Error"` lautet. Dies ist die Standardmeldung, die von der `errorHandler`Middleware zurückgegeben wird.

Was passiert hier:

1. **Testanwendung erstellen**: Eine einfache Express-Anwendung wird erstellt.
2. **Fehler absichtlich auslösen**: Eine Route `/error` wird definiert, die immer einen Fehler auslöst.
3. **Fehler abfangen**: Die `errorHandler`Middleware fängt diesen Fehler ab und gibt eine standardisierte Fehlermeldung an den Client zurück.
4. **Testen der Fehlerbehandlung**: Der Test überprüft, ob die Fehlerbehandlungsmiddleware korrekt funktioniert, indem sie den Statuscode 500 und die Nachricht `"Internal Server Error"` zurückgibt.

Dieser Test überprüft, ob die **Error-Handler-Middleware** korrekt funktioniert. Wenn ein Fehler auftritt (z.B. in der Route `/error`), stellt die Middleware sicher, dass:

- Ein **HTTP-Statuscode 500** (Interner Serverfehler) zurückgegeben wird.
- Eine **Fehlermeldung** an den Client gesendet wird, damit dieser weiß, dass ein Problem auf dem Server aufgetreten ist.

Das Ziel dieses Tests ist es sicherzustellen, dass die Anwendung bei Fehlern stabil bleibt und diese korrekt behandelt werden, anstatt den Server abstürzen zu lassen.

## 5. **Unit-Tests für `responseHelper.js`**

```jsx
// __tests__/responseHelper.test.js
import { sendSuccess, sendError } from '../utils/responseHelper';

describe('Response Helper', () => {
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send success response with default message', () => {
        sendSuccess(mockRes, { id: 1, title: 'Test' });

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Operation successful',
            data: { id: 1, title: 'Test' },
        });
    });

    it('should send error response with custom status code', () => {
        sendError(mockRes, 'An error occurred', 400);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'An error occurred' });
    });
});

```

---

Dieser Code testet zwei Hilfsfunktionen, die API-Antworten standardisieren: **`sendSuccess`** und **`sendError`**. Diese Funktionen werden in deiner Anwendung verwendet, um einheitliche Antworten an den Client zu senden, z. B. bei erfolgreichen Operationen oder Fehlern.

1. **Import der zu testenden Funktionen**

```jsx
import { sendSuccess, sendError } from '../utils/responseHelper';

```

- **`sendSuccess`**: Diese Funktion wird verwendet, um eine erfolgreiche Antwort an den Client zu senden, z. B. wenn eine Operation wie das Speichern von Daten erfolgreich war.
- **`sendError`**: Diese Funktion wird verwendet, um eine Fehlermeldung an den Client zu senden, wenn etwas schiefgegangen ist.

2. **Erstellen eines Mock-Objekts für die Antwort (`mockRes`)**

```jsx
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

```

- **`mockRes`**: Hier wird ein simuliertes (Mock-)Objekt erstellt, das eine HTTP-Antwort repräsentiert. Dieses Objekt hat zwei Methoden, die typischerweise in Express verwendet werden:
    - **`status`**: Diese Methode setzt den HTTP-Statuscode (z.B. 200 für Erfolg oder 400 für Fehler). Das `jest.fn().mockReturnThis()` bedeutet, dass die Methode selbst ein Mock ist und das aktuelle Objekt (`mockRes`) zurückgibt, sodass Methoden verkettet werden können (wie es in Express üblich ist).
    - **`json`**: Diese Methode sendet die eigentliche JSON-Antwort an den Client.

3. **Nach jedem Test Mocks zurücksetzen**

```jsx
afterEach(() => {
    jest.clearAllMocks();
});

```

- **`afterEach`**: Diese Funktion sorgt dafür, dass nach jedem Test die Mocks (`status` und `json`) zurückgesetzt werden, damit sie bei jedem Test "frisch" sind und die Ergebnisse von vorherigen Tests nicht beeinflussen.

4. **Erster Test: Erfolgreiche Antwort senden**

```jsx
it('should send success response with default message', () => {
    sendSuccess(mockRes, { id: 1, title: 'Test' });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Operation successful',
        data: { id: 1, title: 'Test' },
    });
});

```

- **`sendSuccess(mockRes, { id: 1, title: 'Test' })`**: Hier wird die Funktion `sendSuccess` aufgerufen. Sie erwartet zwei Parameter:
    - **`mockRes`**: Das simulierte Antwort-Objekt.
    - **`{ id: 1, title: 'Test' }`**: Die Daten, die in der erfolgreichen Antwort zurückgegeben werden.
- **`expect(mockRes.status).toHaveBeenCalledWith(200)`**: Dieser Test stellt sicher, dass die Methode `status` mit dem Wert `200` aufgerufen wurde, was den HTTP-Status für eine erfolgreiche Anfrage darstellt.
- **`expect(mockRes.json).toHaveBeenCalledWith(...)`**: Dieser Test stellt sicher, dass die `json`Methode mit dem erwarteten JSON-Objekt aufgerufen wurde. Hier wird geprüft, dass die Nachricht `"Operation successful"` und die Daten korrekt zurückgegeben wurden.

5. **Zweiter Test: Fehlerhafte Antwort senden**

```jsx
it('should send error response with custom status code', () => {
    sendError(mockRes, 'An error occurred', 400);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'An error occurred' });
});

```

- **`sendError(mockRes, 'An error occurred', 400)`**: Hier wird die Funktion `sendError` aufgerufen. Sie erwartet drei Parameter:
    - **`mockRes`**: Das simulierte Antwort-Objekt.
    - **`'An error occurred'`**: Die Fehlermeldung, die an den Client zurückgesendet werden soll.
    - **`400`**: Der HTTP-Statuscode für die Antwort, der in diesem Fall auf `400` gesetzt ist, was für "Bad Request" (ungültige Anfrage) steht.
- **`expect(mockRes.status).toHaveBeenCalledWith(400)`**: Dieser Test stellt sicher, dass die Methode `status` mit dem Wert `400` aufgerufen wurde.
- **`expect(mockRes.json).toHaveBeenCalledWith({ error: 'An error occurred' })`**: Dieser Test stellt sicher, dass die `json`Methode mit dem erwarteten Fehlerobjekt aufgerufen wurde.
- **`sendSuccess`** und **`sendError`** sind Hilfsfunktionen, die standardisierte Antworten zurücksenden:
    - **`sendSuccess`** gibt bei Erfolg einen HTTP-Status von `200` und die Daten mit einer Erfolgsnachricht zurück.
    - **`sendError`** gibt bei einem Fehler den entsprechenden HTTP-Statuscode und eine Fehlermeldung zurück.
- Der Test verwendet **Mock-Objekte** für die HTTP-Antwort (`mockRes`), um sicherzustellen, dass die richtigen Statuscodes und JSON-Antworten gesendet werden.
- Nach jedem Test werden die Mocks zurückgesetzt, um sicherzustellen, dass die Tests unabhängig voneinander sind.

Die Unit-Tests helfen sicherzustellen, dass die Hilfsfunktionen korrekt funktionieren und in der Praxis die erwarteten Antworten liefern, unabhängig von der tatsächlichen Implementierung der Anwendung.

## Tests Ausführen

Um die Tests auszuführen, kannst du in deinem Projektordner folgendes in der Kommandozeile ausführen:

```bash
jest

```

Oder wenn du ein spezifisches Test-Skript in deiner `package.json` hast:

```bash
npm test

```

- Diese **Unit-Tests** decken alle Kernkomponenten der Applikation ab, darunter die **Geschäftslogik (feedbackController)**, die **Routen** und die **Middleware**.
- **Mocks** werden verwendet, um sicherzustellen, dass die Tests unabhängig von der realen Datenbank ausgeführt werden.
- **Validierung und Fehlerbehandlung** werden ebenfalls getestet, um sicherzustellen, dass die Anwendung robuste Eingaben und Fehlerfälle verarbeitet.

## Jest und Supertest Installation

Um Jest in deinem Projekt auszuführen und eine detaillierte Berichterstattung über die Testabdeckung (Coverage) und ausführliche Fehlermeldungen zu erhalten, kannst du den `test`-Befehl in deiner `package.json` hinzufügen oder anpassen.

### Schritte zur Anpassung der `package.json`:

1. **Installiere Jest und die notwendigen Abhängigkeiten**, falls noch nicht geschehen:
    
    ```bash
    npm install --save-dev jest supertest
    
    ```
    
2. **Füge oder aktualisiere das `test`Skript in der `package.json`**:
    
    Öffne deine `package.json` und füge das folgende Skript hinzu oder passe das bestehende `test`-Skript an:
    
    ```json
    {
      "scripts": {
        "test": "jest --coverage --verbose --detectOpenHandles"
      }
    }
    
    ```
    
    ### Erklärungen zu den Flags:
    
    - `-coverage`: Aktiviert die Testabdeckung (Coverage). Zeigt dir, wie viel Prozent des Codes von den Tests abgedeckt wird.
    - `-verbose`: Zeigt detaillierte Informationen über jeden Testfall an, z. B. welcher Test erfolgreich und welcher fehlgeschlagen ist.
    - `-detectOpenHandles`: Zeigt an, ob offene Handles nach den Tests vorhanden sind, was hilfreich ist, um unvollständig geschlossene Verbindungen oder Prozesse zu finden.
3. **Führe den Testbefehl aus**:
    
    Um die Tests mit diesen Optionen auszuführen, kannst du folgendes in der Kommandozeile eingeben:
    
    ```bash
    npm test
    
    ```
    
4. **Erweiterte Berichte und Fehlerbehandlung**:
    
    Wenn du noch detailliertere Berichte oder spezifische Informationen haben möchtest, kannst du zusätzliche Jest-Optionen verwenden:
    
    ```json
    {
      "scripts": {
        "test": "jest --coverage --verbose --detectOpenHandles --testLocationInResults"
      }
    }
    
    ```
    
    - `-testLocationInResults`: Fügt Informationen über die genaue Position (Zeile und Datei) hinzu, wo der Test definiert wurde, was bei der Fehlerbehebung hilfreich ist.

---

### Beispiel für eine vollständige `package.json`:

```json
{
  "name": "your-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage --verbose --detectOpenHandles --testLocationInResults"
  },
  "devDependencies": {
    "jest": "^27.0.0"
  }
}

```

### Coverage Report:

Wenn du die Tests ausführst, zeigt Jest eine Testabdeckungszusammenfassung an, die so aussieht:

```bash
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
All files       |    90.9 |       80 |      85 |    90.9 |
 controllers    |     100 |      100 |     100 |     100 |
 db.js          |      80 |       50 |      75 |      80 | 12,13
 middlewares    |     100 |      100 |     100 |     100 |
 routes         |      90 |       80 |     100 |      90 | 23
 utils          |     100 |      100 |     100 |     100 |
----------------|---------|----------|---------|---------|-------------------

```

Zusätzlich wird ein vollständiger HTML-Testabdeckungsbericht in einem Ordner namens `coverage/` generiert. Du kannst diesen Bericht im Browser anzeigen, indem du die Datei `index.html` in diesem Ordner öffnest.

### Ausführliche Fehlermeldungen:

Jest zeigt bei Fehlschlägen automatisch detaillierte Fehlermeldungen an, einschließlich der erwarteten und erhaltenen Ergebnisse sowie des genauen Speicherorts des Fehlers.

Mit diesen Einstellungen und der verbesserten Fehlerberichterstattung kannst du effektivere und detailliertere Tests für deine Anwendung erstellen.

---

### ESM Kompatibilität

Der Fehler `Cannot use import statement outside a module` tritt auf, weil Jest standardmäßig CommonJS verwendet und keine ES-Module (`import`-Syntax) unterstützt, es sei denn, es wird explizit so konfiguriert.

Um dies zu beheben, kannst du eine der folgenden Lösungen anwenden:

### Lösung: Verwende `babel-jest` für die Umwandlung von ES-Modulen in CommonJS

1. **Installiere `babel-jest` und die notwendigen Babel-Pakete**:
    
    ```bash
    npm install --save-dev babel-jest @babel/preset-env
    
    ```
    
2. **Erstelle eine `.babelrc`Datei** in deinem Projektverzeichnis (wenn du noch keine hast) und füge die folgende Konfiguration hinzu:
    
    ```json
    {
      "presets": ["@babel/preset-env"]
    }
    
    ```
    
    Diese Konfiguration sorgt dafür, dass der Code korrekt nach ES5 oder CommonJS umgewandelt wird, damit Jest damit arbeiten kann.
    
3. **Passe die `package.json`Skripte an**:
    
    Stelle sicher, dass Jest mit Babel arbeitet:
    
    ```json
    {
      "scripts": {
        "test": "jest --coverage --verbose --detectOpenHandles"
      },
      "jest": {
        "transform": {
          "^.+\\.jsx?$": "babel-jest"
        }
      }
    }
    
    ```
    
    Der Eintrag `"transform": {"^.+\\\\.jsx?$": "babel-jest"}` sagt Jest, dass alle JavaScript-Dateien (`.js` oder `.jsx`) mit `babel-jest` umgewandelt werden sollen, bevor sie getestet werden.
    
4. **Führe den Test erneut aus**:
    
    ```bash
    npm test
    
    ```
    

## Jenkins Pipeline

Um die Unit-Tests in deine Jenkins-Pipeline hinzuzufügen, fügen wir eine neue Stage namens "Run Unit Tests" **nach der Checkout-Stage** hinzu. Diese Stage wird die Unit-Tests mit `npm test` ausführen und sicherstellen, dass die Tests erfolgreich durchlaufen, bevor der Build fortgesetzt wird.

Hier ist die aktualisierte Pipeline mit der neuen Unit-Testing-Stage:

```groovy
pipeline {
    agent {
        kubernetes {
            label 'jenkins-docker-agent'
            yamlFile 'kubernetes_jenkins/jenkins-pod-template.yaml'
        }
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        GITHUB_REPO = '<https://github.com/atamankina/feedback-app.git>'
        DOCKER_CREDENTIALS_ID = 'dockerhub-token'
        DOCKER_REPO = 'galaataman/feedback-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE = "${DOCKER_REPO}:${IMAGE_TAG}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                git url: "${GITHUB_REPO}", branch: 'refactoring'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                container('node') {
                    sh '''
                        npm install
                        npm test  -- --maxWorkers=50%
                    '''
                }
                echo 'Unit tests completed successfully.'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building the Docker image...'
                container('docker') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
                echo 'Docker build successful.'
            }
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the Docker image to Docker Hub...'
                container('docker') {
                    script {
                        docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                            sh 'docker push $DOCKER_IMAGE'
                        }
                    }
                }
                echo 'Docker image pushed successfully.'
            }
        }
        stage('Kubernetes Deploy App Dependencies') {
            steps {
                echo 'Deploying API dependencies to kubernetes cluster...'
                container('kubectl') {
                    sh 'kubectl apply -f kubernetes/secret.yaml'
                    sh 'kubectl apply -f kubernetes/configmap.yaml'
                    sh 'kubectl apply -f kubernetes/database-volume.yaml'
                    sh 'kubectl apply -f kubernetes/database-deployment.yaml'
                }
                echo 'Deployment successful.'
            }
        }
        stage('Kubernetes Deploy App') {
            steps {
                echo 'Deleting previous App deployment...'
                container('kubectl') {
                    sh '''
                        kubectl delete deployment feedback-app-api || true
                    '''
                }
                echo 'Previous App deployment deleted successfully.'
                echo 'Creating new App deployment...'
                container('kubectl') {
                    script {
                        sh '''
                            sed -i "s|image: galaataman/feedback-app:latest|image: $DOCKER_IMAGE|g" kubernetes/api-deployment.yaml
                        '''
                        sh '''
                            kubectl apply -f kubernetes/api-deployment.yaml
                            kubectl rollout status deployment feedback-app-api --timeout=300s
                        '''
                    }
                }
                echo 'New App deployment created successfully.'
            }
        }
        stage('Check App Status') {
            steps {
                echo 'Waiting for the App to become reachable...'
                container('kubectl') {
                    script {
                        def retries = 30
                        def delay = 10
                        def url = "<http://feedback-app-api-service:3000/feedback>"

                        for (int i = 0; i < retries; i++) {
                            def result = sh(script: "curl -s -o /dev/null -w '%{http_code}' $url", returnStatus: true)

                            if (result == 0) {
                                def http_code = sh(script: "curl -s -o /dev/null -w '%{http_code}' $url", returnStdout: true).trim()
                                echo "App health check attempt ${i + 1}: HTTP $http_code"
                                if (http_code == '200') {
                                    echo 'App is reachable!'
                                    break
                                }
                            } else {
                                echo "App is not reachable yet (attempt ${i + 1}). Retrying in ${delay} seconds..."
                            }

                            if (i == retries - 1) {
                                error 'App is still unreachable after multiple attempts.'
                            }
                            sleep delay
                        }
                    }
                }
            }
        }
        stage('Run Integration Tests') {
            steps {
                echo 'Running integration tests...'
                container('k6') {
                    sh 'k6 run --env BASE_URL=http://feedback-app-api-service:3000 --verbose ./tests/feedback-api.integration.js'
                }
                echo 'Integration tests completed successfully.'
            }
        }
    }
    post {
        always {
            echo 'Post: DockerHub URL...'
            script {
                def dockerHubUrl = "<https://hub.docker.com/r/${DOCKER_REPO}/tags?name=${IMAGE_TAG}>"
                echo "DockerHub URL for the image: ${dockerHubUrl}"
                writeFile file: 'dockerhub-url.txt', text: dockerHubUrl
                archiveArtifacts artifacts: 'dockerhub-url.txt'
            }
        }

        success {
            echo 'Integration tests succeeded, tagging the image with "latest"...'
            container('docker') {
                script {
                    docker.withRegistry('', "${DOCKER_CREDENTIALS_ID}") {
                        sh "docker tag ${DOCKER_IMAGE} ${DOCKER_REPO}:latest"
                        sh "docker push ${DOCKER_REPO}:latest"
                    }
                }
            }
            echo 'Docker image successfully pushed with "latest" tag.'
        }
    }
}

```

### Erklärung der Änderungen:

1. **Neue Stage `Run Unit Tests`**:
    - Diese Stage wird direkt nach dem `Checkout`Schritt ausgeführt.
    - Die Tests werden innerhalb des `node`Containers ausgeführt.
    - `npm install` wird aufgerufen, um sicherzustellen, dass alle Abhängigkeiten installiert sind, bevor `npm test` ausgeführt wird.
    - `npm test -- --coverage --verbose --detectOpenHandles` stellt sicher, dass die Tests mit detaillierten Berichten und Testabdeckung ausgeführt werden.
2. **Unit-Tests sind jetzt Bestandteil der Pipeline**:
    - Bevor der Docker-Build oder das Deployment durchgeführt wird, müssen die Unit-Tests erfolgreich abgeschlossen werden.
    - Dies stellt sicher, dass der Build- und Deployment-Prozess nur fortgesetzt wird, wenn die Tests erfolgreich sind.

Mit dieser Änderung wird deine Jenkins-Pipeline den Code nach dem Checkout auf Unit-Tests prüfen, bevor der Build- und Deployment-Prozess weitergeht.

### Jenkins Pod-Template Anpassung

Um den neuesten Node.js-Container in die Pod-Vorlage einzufügen und ihm ähnliche Ressourcenbeschränkungen wie den anderen Containern zuzuweisen, kannst du einfach einen weiteren Container-Eintrag für `node` hinzufügen. Hier ist die aktualisierte Pod-Vorlage, die den Node.js-Container enthält:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: slave
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: docker
    image: docker:latest
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "250m"
    command:
    - cat
    tty: true
    volumeMounts:
    - name: docker-socket
      mountPath: /var/run/docker.sock
  - name: kubectl
    image: galaataman/kubectl:latest
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "250m"
    command:
    - cat
    tty: true
  - name: k6
    image: galaataman/k6:latest
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "250m"
    command:
    - cat
    tty: true
  - name: node
    image: node:latest
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "250m"
    command:
    - cat
    tty: true
  volumes:
  - hostPath:
      path: /var/run/docker.sock
    name: docker-socket

```

### Erklärung der Änderungen:

1. **Neuer Container `node`**:
    - Der Container verwendet das Image `node:latest`.
    - Es hat dieselben Ressourcenanforderungen und -limits wie die anderen Container:
        - **Speicheranforderungen**: `128Mi`
        - **CPU-Anforderungen**: `250m`
        - **Speicherlimits**: `128Mi`
        - **CPU-Limits**: `250m`
    - Der Container startet mit dem `cat`Befehl, um sicherzustellen, dass er im Hintergrund läuft und für Jenkins-Jobs verfügbar ist, genauso wie die anderen Container.

Jetzt hast du den neuesten Node.js-Container mit denselben Ressourcengrenzen in deiner Pod-Vorlage integriert.