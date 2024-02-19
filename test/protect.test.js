const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/protect');

describe('protect middleware', () => {
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

    it('should render signin.ejs with empty message if no token provided', async () => {
        await protect(req, res, next);

        expect(res.render.calledOnceWithExactly("../views/signin.ejs", { message: "" })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should call next() if token is provided and valid', async () => {
        req.cookies.jwt = 'validToken';

        sinon.stub(jwt, 'verify').returns({ _id: 'userId', name: 'username', email: 'user@example.com' });

        await protect(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(req.myusername).to.equal('username');
        expect(req.myemail).to.equal('user@example.com');
    });

    it('should return 403 status if decoded token has null _id', async () => {
        req.cookies.jwt = 'validToken';

        sinon.stub(jwt, 'verify').returns({ _id: null });

        await protect(req, res, next);

        expect(res.status.calledOnceWithExactly(403)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Bad Request" })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 500 status if jwt.verify throws an error', async () => {
        req.cookies.jwt = 'invalidToken';

        sinon.stub(jwt, 'verify').throws(new Error('Token verification failed'));

        await protect(req, res, next);

        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.send.calledOnceWithExactly({ success: false, message: "Internal Server Error" })).to.be.true;
        expect(next.called).to.be.false;
    });
});
