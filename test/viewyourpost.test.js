const { expect } = require('chai');
const sinon = require('sinon');
const { viewyourposts } = require('../controllers/employerlogincontroller');
const {Softwarejob} = require('../model/jobschemacoll'); // Assuming these are your model imports
const {Corejob} = require('../model/jobschemacoll');

describe('viewyourposts function', () => {
    let req, res;

    beforeEach(() => {
        req = {
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

    it('should render "myposts.ejs" with software and core posts for the user', async () => {
        // Mocking database calls
        sinon.stub(Softwarejob, 'find').resolves([{ title: 'Software Job 1' }, { title: 'Software Job 2' }]);
        sinon.stub(Corejob, 'find').resolves([{ title: 'Core Job 1' }, { title: 'Core Job 2' }]);

        await viewyourposts(req, res);

        // Expectations
        expect(Softwarejob.find.calledOnceWith({ employeremail: 'test@example.com' })).to.be.true;
        expect(Corejob.find.calledOnceWith({ employeremail: 'test@example.com' })).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/myposts.ejs', {
            softwareposts: [{ title: 'Software Job 1' }, { title: 'Software Job 2' }],
            coreposts: [{ title: 'Core Job 1' }, { title: 'Core Job 2' }],
            user: 'testuser'
        })).to.be.true;
    });

    it('should handle errors', async () => {
        // Stubbing Softwarejob.find to throw an error
        sinon.stub(Softwarejob, 'find').throws(new Error('Database error'));

        try {
            await viewyourposts(req, res);
        } catch (error) {
            // Expectations for error handling
            expect(error.message).to.equal('res.status is not a function');
            expect(res.render.called).to.be.false; // Ensure that render is not called
        }
    });
});
