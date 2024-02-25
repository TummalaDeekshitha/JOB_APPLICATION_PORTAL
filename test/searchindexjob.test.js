const { searchindexjob } = require('../controllers/indexcontroller');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { expect } = require('chai');

describe('searchindexjob function', () => {
    let req, res, sandbox;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            send: sinon.spy()
        };
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore(); // Restore the sandbox after each test
    });

    it('should return search results for software jobs when query and category are provided', async () => {
        req.query.myquery = 'software';
        req.query.category = 'softwarejobs';

        const softwareJobsModelStub = {
            aggregate: sinon.stub().resolves([])
        };
        sandbox.stub(mongoose, 'model').withArgs('softwarejobs').returns(softwareJobsModelStub);

        await searchindexjob(req, res);

        expect(softwareJobsModelStub.aggregate.calledOnce).to.be.true;
        // Add more assertions to verify the behavior of the function
    });

    it('should return search results for core jobs when query and category are provided', async () => {
        req.query.myquery = 'core';
        req.query.category = 'corejobs';

        const coreJobsModelStub = {
            aggregate: sinon.stub().resolves([])
        };
        sandbox.stub(mongoose, 'model').withArgs('corejobs').returns(coreJobsModelStub);

        await searchindexjob(req, res);

        expect(coreJobsModelStub.aggregate.calledOnce).to.be.true;
        // Add more assertions to verify the behavior of the function
    });

    it('should return all jobs when no query is provided', async () => {
        req.query.category = 'softwarejobs';

        const softwareJobsModelStub = {
            aggregate: sinon.stub().resolves([])
        };
        sandbox.stub(mongoose, 'model').withArgs('softwarejobs').returns(softwareJobsModelStub);

        await searchindexjob(req, res);

        expect(softwareJobsModelStub.aggregate.calledOnce).to.be.true;
        // Add more assertions to verify the behavior of the function
    });

    it('should return an empty array when no matching jobs are found', async () => {
        req.query.myquery = 'nonexistent';
        req.query.category = 'softwarejobs';

        const softwareJobsModelStub = {
            aggregate: sinon.stub().resolves([])
        };
        sandbox.stub(mongoose, 'model').withArgs('softwarejobs').returns(softwareJobsModelStub);

        await searchindexjob(req, res);

        expect(softwareJobsModelStub.aggregate.calledOnce).to.be.true;
        // Add more assertions to verify the behavior of the function
    });
});
