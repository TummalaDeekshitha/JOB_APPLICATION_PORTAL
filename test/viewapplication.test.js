const { expect } = require('chai');
const sinon = require('sinon');

const { viewapplications } = require('../controllers/indexcontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('viewapplications', () => {

    let req, res;

    beforeEach(() => {
        req = {
            myemail: 'test@example.com',
            myusername: 'Test User'
        };

        res = {
            render: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render myapplications page with applications for logged in user', async () => {
        const findStub = sinon.stub(Applicationcollection, 'find').resolves([{
            email: 'test@example.com'
        }]);

        await viewapplications(req, res);

        expect(findStub.calledWith({ email: 'test@example.com' })).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args[0]).to.equal('../views/myapplications.ejs');
        expect(res.render.firstCall.args[1]).to.deep.equal({
            applications: [{ email: 'test@example.com' }],
            user: 'Test User'
        });
    });

    it('should handle errors', async () => {
        const findStub = sinon.stub(Applicationcollection, 'find').rejects();

        try {
            await viewapplications(req, res);
        } catch (error) {
            expect(error.message).to.equal('Error');
        }

        expect(findStub.called).to.be.true;
        expect(res.render.called).to.be.false;
    });

});
