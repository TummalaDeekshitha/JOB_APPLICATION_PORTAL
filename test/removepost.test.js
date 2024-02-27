const { expect } = require('chai');
const sinon = require('sinon');
const { removepost } = require('../controllers/employerlogincontroller');
const mongoose = require('mongoose');
const {Softwarejob} = require('../model/jobschemacoll');
const {Corejob} = require('../model/jobschemacoll');
const {jobschema}=require('../model/jobschemacoll');

describe('removepost function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                category: 'softwarejob',
                id: 'some_id'
            },
            myemail: 'test@example.com',
            myusername: 'testuser'
        };
        res = {
            render: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should remove a post and render myposts.ejs with updated data', async () => {
        // Stubbing mongoose.model to return a mock model
        const deleteOneStub = sinon.stub().resolves({ deletedCount: 1 });
        const modelStub = sinon.stub(mongoose, 'model').returns({
            deleteOne: deleteOneStub
        });

        // Mocking Softwarejob.find and Corejob.find calls
        sinon.stub(Softwarejob, 'find').resolves([{ title: 'Software Job 1' }]);
        sinon.stub(Corejob, 'find').resolves([{ title: 'Core Job 1' }]);

        await removepost(req, res);

        // Assertions
        expect(modelStub.calledWithExactly('softwarejobs', jobschema)).to.be.true;
        expect(deleteOneStub.calledWithExactly({ _id: 'some_id' })).to.be.true;
        expect(Softwarejob.find.calledOnceWithExactly({ employeremail: 'test@example.com' })).to.be.true;
        expect(Corejob.find.calledOnceWithExactly({ employeremail: 'test@example.com' })).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/myposts.ejs', {
            softwareposts: [{ title: 'Software Job 1' }],
            coreposts: [{ title: 'Core Job 1' }],
            user: 'testuser'
        })).to.be.true;
    });

    it('should handle errors', async () => {
        // Stubbing mongoose.model to throw an error
        sinon.stub(mongoose, 'model').throws(new Error('Database error'));

        try {
            await removepost(req, res);
        } catch (error) {
            // Assertions
            expect(error.message).to.equal('res.status is not a function');
            expect(res.render.called).to.be.false; // Ensure render is not called
        }
    });
});
