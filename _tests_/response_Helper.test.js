import { sendSuccess, sendError } from "../src/utils/responseHelper"; 

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

const mockData = { 
    id: 1, 
    title: 'Test Title', 
    text: 'Test text' 
};

describe('Response Helper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Sendet eine Erfolg-Antwort mit dem Standard Status Code', () => {
        sendSuccess(mockRes, mockData)

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Anfrage erfolgreich.',
            data: mockData
        });

    });
});