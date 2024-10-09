import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController';
import { pool } from '../src/db';

jest.mock('../src/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('Feedback Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('das Feedback soll erfolgreich gespecihert werden', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        pool.query.mockResolvedValue( { rows: [mockFeedback] } );

        const result = await addFeedback('Test Feedback', 'Test text');

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;', ['Test Feedback', 'Test text']
        );

    });
 
});