const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const { confirmpassword } = require('../controllers/indexcontroller.js');
const Signupcoll = require('../model/signupcoll');

describe('confirmpassword function', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                newPassword: 'newPassword123',
                confirmPassword: 'newPassword123'
            }
        };

        res = {
            render: sinon.spy()
        };

        next = sinon.spy();

        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should update password and render "signin.ejs" if newPassword matches confirmPassword', async () => {
        sinon.stub(Signupcoll, 'updateOne').resolves({});

        await confirmpassword(req, res, next);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'your password changed ' })).to.be.true;
        expect(bcrypt.hash.calledOnce).to.be.true;
        expect(bcrypt.hash.calledWithExactly('newPassword123', 10)).to.be.true;

        Signupcoll.updateOne.restore();
    });

    it('should render "changepassword.ejs" with error message if newPassword does not match confirmPassword', async () => {
        req.body.confirmPassword = 'differentPassword';

        await confirmpassword(req, res, next);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/changepassword.ejs', { message: 'password not match' })).to.be.true;
        expect(bcrypt.hash.called).to.be.false;
    });
});
