const { expect } = require('chai');
const sinon = require('sinon');
const { applicationtrendsdocuments } = require('../controllers/admincontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('applicationtrendsdocuments function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {}
        };

        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis() // For chaining
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return JSON data with labels and documentCounts', async () => {
        req.query.timeRange = 'today';
        req.query.category = 'sampleCategory';

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        const mockDocuments = [
            { _id: '2024-02-19', count: 5 },
            { _id: '2024-02-20', count: 10 }
        ];

        sinon.stub(Applicationcollection, 'aggregate').resolves(mockDocuments);

        await applicationtrendsdocuments(req, res);

        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({
            labels: ['2024-02-19', '2024-02-20'],
            documentCounts: [5, 10]
        });
    });

    it('should return 500 status and error message if an error occurs', async () => {
        req.query.timeRange = 'today';
        req.query.category = 'sampleCategory';

        sinon.stub(Applicationcollection, 'aggregate').throws(new Error('Database error'));

        await applicationtrendsdocuments(req, res);

        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.json.calledOnceWithExactly({ error: 'Internal Server Error' })).to.be.true;
    });
});
