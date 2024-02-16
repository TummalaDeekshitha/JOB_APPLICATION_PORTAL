const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { postjob } = require('../controllers/employerlogincontroller');

describe('postjob', () => {
    let req, res, SamplemodelMock;

    before(() => {
        req = {
            body: {
                category: 'Software',
                companyname: 'Test Company',
                jobname: 'Test Job',
                openings: 5,
                lastdate: '2024-02-15',
                description: 'Test job description',
                email: 'test@example.com'
            },
            file: {
                buffer: Buffer.from('mocked_file_content'),
                mimetype: 'image/png'
            }
        };

        res = {
            redirect: sinon.spy()
        };
    });

    beforeEach(() => {
        SamplemodelMock = sinon.mock(mongoose.Model.prototype);
    });

    afterEach(() => {
        SamplemodelMock.restore();
    });

    it('should save a new job post and redirect to homepage', async () => {
        SamplemodelMock.expects('save').once();

        await postjob(req, res);

        SamplemodelMock.verify();
        expect(res.redirect.calledOnceWithExactly('/')).to.be.true;
    });
});
