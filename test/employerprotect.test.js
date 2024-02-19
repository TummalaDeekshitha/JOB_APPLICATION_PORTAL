const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { employerprotect } = require('../middleware/employerprotect.js');

describe('employerprotect middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };

        res = {
            render: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render employerlogin.ejs with empty message if no token provided', async () => {
        await employerprotect(req, res, next);

        expect(res.render.calledOnceWithExactly("../views/employerlogin.ejs", { message: "" })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should render 403 status with message "Bad Request" if token has null _id', async () => {
        req.cookies.employerjwt = 'invalidToken';

        sinon.stub(jwt, 'verify').returns({ _id: null });

        await employerprotect(req, res, next);

        expect(res.status.calledOnceWithExactly(403)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Bad Request" })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should call next() if token is provided and valid', async () => {
        req.cookies.employerjwt = 'validToken';

        sinon.stub(jwt, 'verify').returns({ _id: 'employerId', name: 'employername', email: 'employer@example.com' });

        await employerprotect(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(req.myusername).to.equal('employername');
        expect(req.myemail).to.equal('employer@example.com');
    });

    it('should return 500 status if jwt.verify throws an error', async () => {
        req.cookies.employerjwt = 'invalidToken';

        sinon.stub(jwt, 'verify').throws(new Error('Token verification failed'));

        await employerprotect(req, res, next);

        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Internal Server Error" })).to.be.true;
        expect(next.called).to.be.false;
    });
});
