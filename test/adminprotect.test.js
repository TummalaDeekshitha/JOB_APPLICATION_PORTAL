const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { adminprotect } = require('../middleware/adminprotect.js');

describe('adminprotect middleware', () => {
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

    it('should render adminlogin.ejs if no token provided', async () => {
        await adminprotect(req, res, next);

        expect(res.render.calledOnceWithExactly("../views/adminlogin.ejs")).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should render 403 status with message "Bad Request" if token has null _id', async () => {
        req.cookies.adminjwt = 'invalidToken';

        sinon.stub(jwt, 'verify').returns({ _id: null });

        await adminprotect(req, res, next);

        expect(res.status.calledOnceWithExactly(403)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Bad Request" })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should call next() if token is provided and valid', async () => {
        req.cookies.adminjwt = 'validToken';

        sinon.stub(jwt, 'verify').returns({ _id: 'adminId', name: 'adminname', email: 'admin@example.com' });

        await adminprotect(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(req.myusername).to.equal('adminname');
        expect(req.myemail).to.equal('admin@example.com');
    });

    it('should return 500 status if jwt.verify throws an error', async () => {
        req.cookies.adminjwt = 'invalidToken';

        sinon.stub(jwt, 'verify').throws(new Error('Token verification failed'));

        await adminprotect(req, res, next);

        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Internal Server Error" })).to.be.true;
        expect(next.called).to.be.false;
    });
});
