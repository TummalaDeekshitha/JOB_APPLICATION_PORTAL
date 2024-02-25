const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { viewResumelink } = require('../controllers/employerlogincontroller');

describe('viewResumelink', () => {

    let req, res;

    beforeEach(() => {

        req = {
            query: {
                id: '123abc'
            }
        };

        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
            render: sinon.spy()
        };

    });

    it('should render the resume page if document is found', async () => {

        const findOneStub = sinon.stub(mongoose.Model, 'findOne').resolves({
            _id: '123abc',
            name: 'John Doe',
            email: 'john@doe.com'
        });

        await viewResumelink(req, res);

        expect(findOneStub.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.args[0][0]).to.equal('displayresume.ejs');
        expect(res.render.args[0][1].doc._id).to.equal('123abc');

        findOneStub.restore();

    });

    it('should return 404 if document is not found', async () => {

        const findOneStub = sinon.stub(mongoose.Model, 'findOne').resolves(null);

        await viewResumelink(req, res);

        expect(findOneStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWithExactly(404)).to.be.true;
        expect(res.send.calledOnceWithExactly('Document not found')).to.be.true;

        findOneStub.restore();

    });

    it('should handle errors', async () => {

        const findOneStub = sinon.stub(mongoose.Model, 'findOne').throws();

        await viewResumelink(req, res);

        expect(findOneStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.send.calledOnceWithExactly('Internal Server Error')).to.be.true;

        findOneStub.restore();

    });

});

