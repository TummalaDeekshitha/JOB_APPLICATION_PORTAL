const { expect } = require('chai');
const sinon = require('sinon');
const { getCompanySuggestions } = require('../controllers/employerlogincontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('getCompanySuggestions', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                status: 'applied',
                query: 'test',
                category: 'engineer',
                job: 'software developer'
            }
        };

        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return company suggestions based on query, category, job, and status', async () => {
        const mockDocs = [{ _id: 'Test Company 1' }, { _id: 'Test Company 2' }];
        sinon.stub(Applicationcollection, 'aggregate').resolves(mockDocs);

        await getCompanySuggestions(req, res);

        expect(Applicationcollection.aggregate.calledOnce).to.be.true;
        expect(res.json.calledOnceWith(['Test Company 1', 'Test Company 2'])).to.be.true;
    });

    it('should return empty array if query is empty', async () => {
        req.query.query = '';

        await getCompanySuggestions(req, res);

        expect(res.json.calledOnceWith([])).to.be.true;
    });

    it('should handle errors', async () => {
        sinon.stub(Applicationcollection, 'aggregate').rejects(new Error('Database error'));

        await getCompanySuggestions(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWith({ error: 'Internal Server Error' })).to.be.true;
    });
});
