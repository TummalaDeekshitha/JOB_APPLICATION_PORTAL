const { corejobsapi, softwarejobsapi } = require('../controllers/indexcontroller');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { expect } = require('chai');

describe('corejobsapi function', () => {
    let req, res, modelStub, findStub;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.spy()
        };
        modelStub = sinon.stub(mongoose, 'model');
        findStub = sinon.stub();
        modelStub.returns({ find: findStub });
    });

    afterEach(() => {
        modelStub.restore();
    });

    it('should return core job data if found', async () => {
        const coreJobData = [{ jobTitle: 'Software Engineer', company: 'ABC Inc.' }];
        findStub.resolves(coreJobData);

        await corejobsapi(req, res);

        expect(modelStub.calledOnceWithExactly("corejobs", sinon.match.object)).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(res.json.calledOnceWith(coreJobData)).to.be.true;
    });

    it('should handle errors if data retrieval fails', async () => {
        const errorMessage = 'Failed to retrieve core job data';
        findStub.rejects(new Error(errorMessage));

        await corejobsapi(req, res);

        expect(modelStub.calledOnceWithExactly("corejobs", sinon.match.object)).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(res.json.called).to.be.false;
    });
});

describe('softwarejobsapi function', () => {
    let req, res, modelStub, findStub;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.spy()
        };
        modelStub = sinon.stub(mongoose, 'model');
        findStub = sinon.stub();
        modelStub.returns({ find: findStub });
    });

    afterEach(() => {
        modelStub.restore();
    });

    it('should return software job data if found', async () => {
        const softwareJobData = [{ jobTitle: 'Software Developer', company: 'XYZ Corp' }];
        findStub.resolves(softwareJobData);

        await softwarejobsapi(req, res);

        expect(modelStub.calledOnceWithExactly("softwarejobs", sinon.match.object)).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(res.json.calledOnceWith(softwareJobData)).to.be.true;
    });

    it('should handle errors if data retrieval fails', async () => {
        const errorMessage = 'Failed to retrieve software job data';
        findStub.rejects(new Error(errorMessage));

        await softwarejobsapi(req, res);

        expect(modelStub.calledOnceWithExactly("softwarejobs", sinon.match.object)).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(res.json.called).to.be.false;
    });
});
