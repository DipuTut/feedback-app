import { feedbackValidation } from "../src/middleware/validation";
import { validationResult } from 'express-validator';
import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/feedback', feedbackValidation, (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    res.status(201).json({ message: "Validierung erfolgreich." });
});

describe('Validation Middleware', () => {
    it('Validierung fehlerhaft wenn title fehlt', async () => {
        const response = await request(app)
            .post('/feedback')
            .send({text: "Test text"});

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Titel ist erforderlich.');

    });

});