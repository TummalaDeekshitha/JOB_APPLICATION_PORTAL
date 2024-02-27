const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { jobs } = require('../controllers/indexcontroller');

describe('jobs', () => {

    let req, res;

    beforeEach(() => {
        req = {
            query: {
                category: 'softwarejobs'
            },
            myusername: 'testuser'
        };

        res = {
            render: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render requestedjobs page with data', async () => {
        // Stub the find function of the model instance
        const findStub = sinon.stub().resolves([{ job: 'Software Engineer' }]);
        const modelStub = sinon.stub(mongoose, 'model').returns({ find: findStub });

        await jobs(req, res);

        expect(modelStub.calledWith('softwarejobs')).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(res.render.calledWith('../views/requestedjobs.ejs', {
            jobdata: [{ job: 'Software Engineer' }],
            category: 'softwarejobs',
            user: 'testuser'
        })).to.be.true;

        modelStub.restore();
    });

    it('should handle errors', async () => {
        // Stub the find function of the model instance to throw an error
        const findStub = sinon.stub().throws(new Error(`Schema hasn't been registered for model "softwarejobs".
        Use mongoose.model(name, schema)`));
        sinon.stub(mongoose, 'model').returns({ find: findStub });
    
        try {
            await jobs(req, res);
        } catch (error) {
            // Check if the error message contains the expected substring
            expect(error.message).to.include(`Schema hasn't been registered for model "softwarejobs"`);
        }
    });
    

});
