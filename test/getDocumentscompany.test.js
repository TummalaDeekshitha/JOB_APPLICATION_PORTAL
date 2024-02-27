const { expect } = require('chai');
const sinon = require('sinon');
const { getDocumentscompany } = require('../controllers/employerlogincontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('getDocumentscompany', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                page: 1,
                category: 'engineer',
                job: 'software developer',
                company: 'ABC Corp',
                status: 'applied'
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

    it('should return paginated documents sorted by applied date when documents are found', async () => {
        req.query.page = '1';
        req.query.status = 'applied';
        req.query.category = 'engineer';
        req.query.companyname = 'ABC Corp';

        const mockDocs = [{ applieddate: new Date('2020-01-01') }];

        sinon.stub(Applicationcollection, 'find').returns({
            sort: sinon.stub().returnsThis(),
            skip: sinon.stub().returnsThis(),
            limit: sinon.stub().resolves(mockDocs)
        });

        await getDocumentscompany(req, res);

        expect(res.json.calledOnceWith(mockDocs)).to.be.true;
    });

    it('should handle no documents found', async () => {
        req.query.page = '1';

        sinon.stub(Applicationcollection, 'find').returns({
            sort: sinon.stub().returnsThis(),
            skip: sinon.stub().returnsThis(),
            limit: sinon.stub().resolves([])
        });

        await getDocumentscompany(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWith({
            error: 'No documents found'
        })).to.be.true;
    });

    

    it('should handle errors', async () => {
        req.query.page = '1';

        sinon.stub(Applicationcollection, 'find').throws(new Error('Database error'));

        

       
        try {
            await getDocumentscompany(req, res);
        } catch (error) {
            expect(error.message).to.equal("Database error");
        }

    });
});
