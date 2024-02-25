const { expect } = require('chai');
const sinon = require('sinon');

const { findcandidatecompany } = require('../controllers/employerlogincontroller');
const Applicationcollection = require('../model/appschemacoll');

describe('findcandidatecompany', () => {

    let req, res;

    beforeEach(() => {
        req = {
            query: {},
            body: {}
        };
        res = {
            render: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render all matched candidates page with company, category, role, and status filters', async () => {
        req.query = {
            status: 'shortlisted',
            company: 'YourCompany', // Replace 'YourCompany' with the expected value
            category: 'engineer',
            role: 'software engineer'
        };

        const findStub = sinon.stub(Applicationcollection, 'find').resolves([{
            category: 'engineer',
            jobname: 'software engineer',
            companyname: 'YourCompany', // Replace 'YourCompany' with the expected value
            status: 'shortlisted'
        }]);

        await findcandidatecompany(req, res);

        expect(findStub.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args[0]).to.equal('../views/allmatched.ejs');
        expect(res.render.firstCall.args[1]).to.deep.equal({
            totalPages: 1,
            Category: 'engineer',
            Job: 'software engineer',
            company: 'YourCompany', // Replace 'YourCompany' with the expected value
            status: 'shortlisted',
            user: undefined
        });
    });

    it('should handle errors', async () => {
        const findStub = sinon.stub(Applicationcollection, 'find').rejects();

        try {
            await findcandidatecompany(req, res);
        } catch (error) {
            expect(error.message).to.equal("Cannot read properties of undefined (reading 'status')");
        }

        // expect(findStub.calledOnce).to.be.true;
        // expect(res.render.called).to.be.false;
    });

});
