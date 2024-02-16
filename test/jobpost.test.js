const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { jobpost } = require('../controllers/employerlogincontroller');

describe('jobpost', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                employerjwt: 'mocked_jwt_token'
            },
            myusername: 'mocked_username'
        };

        res = {
            render: sinon.spy()
        };
    });

    it('should render "postjob.ejs" with email and username if employerjwt cookie exists', () => {
        const verifyStub = sinon.stub(jwt, 'verify').returns({ email: 'test@example.com' });

        jobpost(req, res);

        expect(verifyStub.calledOnceWithExactly('mocked_jwt_token', 'thisismyfirstnodejsexpressmongodbproject')).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/postjob.ejs', { email: 'test@example.com', user: 'mocked_username' })).to.be.true;

        verifyStub.restore();
    });

    it('should render "employerlogin.ejs" if employerjwt cookie does not exist', () => {
        req.cookies.employerjwt = undefined;

        jobpost(req, res);

        expect(res.render.calledOnceWithExactly('../views/employerlogin.ejs')).to.be.true;
    });
});
