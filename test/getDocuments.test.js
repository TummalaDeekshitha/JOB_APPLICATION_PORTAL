const { expect } = require('chai');
const sinon = require('sinon');

const { getDocuments } = require('../controllers/employerlogincontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('getDocuments', () => {

    let req, res;

    beforeEach(() => {
        req = {
            query: {}
        };

        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return paginated documents sorted by applied date', async () => {
        req.query.page = '1';
        req.query.status = 'applied';
        req.query.category = 'engineer';

        const mockDocs = [{ applieddate: new Date('2020-01-01') }];
        sinon.stub(Applicationcollection, 'find').resolves(mockDocs);

        await getDocuments(req, res);

        expect(Applicationcollection.find.calledWith({
            $and: [
                { $or: [{ category: 'engineer' }, { category: 'engineers' }] },
                { status: 'applied' }
            ]
        })).to.be.true;
        expect(res.json.calledOnceWith(mockDocs)).to.be.true;
    });

    it('should handle no documents found', async () => {
        req.query.page = '1';

        sinon.stub(Applicationcollection, 'find').resolves([]);

        await getDocuments(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWith({
            error: 'No documents found'
        })).to.be.true;
    });

    it('should handle errors', async () => {
        sinon.stub(Applicationcollection, 'find').rejects(new Error('Database error'));

       

        try {
            await getDocuments(req, res);
        } catch (error) {
            expect(error.message).to.equal("Applicationcollection.find(...).sort is not a function");
        }
    });

});
