const { logout } = require('../controllers/indexcontroller');
const sinon = require('sinon');
const { expect } = require('chai');

describe('logout function', () => {
    let req, res, clearCookieStub, renderSpy;

    beforeEach(() => {
        req = {};
        clearCookieStub = sinon.stub();
        renderSpy = sinon.spy();
        res = {
            clearCookie: clearCookieStub,
            render: renderSpy
        };
    });

    it('should clear cookies and render "index.ejs"', () => {
        logout(req, res);

        expect(clearCookieStub.calledThrice).to.be.true;
        expect(clearCookieStub.calledWithExactly('jwt')).to.be.true;
        expect(clearCookieStub.calledWithExactly('employerjwt')).to.be.true;
        expect(clearCookieStub.calledWithExactly('adminjwt')).to.be.true;
        expect(renderSpy.calledOnce).to.be.true;
        expect(renderSpy.calledWithExactly('../views/index.ejs')).to.be.true;
    });
});
