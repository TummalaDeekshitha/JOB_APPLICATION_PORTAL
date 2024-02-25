const { userdata } = require('../controllers/indexcontroller');
const Signupcoll = require('../model/signupcoll');
const sinon = require('sinon');
const { expect } = require('chai');

describe('userdata function', () => {
    let req, res, findStub;

    beforeEach(() => {
        req = {};
        findStub = sinon.stub(Signupcoll, 'find');
        res = {
            json: sinon.spy()
        };
    });

    afterEach(() => {
        findStub.restore();
    });

    it('should return user data if found', async () => {
        const userData = [{ name: 'User1', email: 'user1@example.com' }];
        findStub.resolves(userData);

        await userdata(req, res);

        expect(findStub.calledOnce).to.be.true;
        expect(res.json.calledOnceWith(userData)).to.be.true;
    });

    it('should handle errors if data retrieval fails', async () => {
        const errorMessage = 'Failed to retrieve user data';
        findStub.rejects(new Error(errorMessage));

        await userdata(req, res);

        expect(findStub.calledOnce).to.be.true;
        expect(res.json.called).to.be.false;
        
    });
});
