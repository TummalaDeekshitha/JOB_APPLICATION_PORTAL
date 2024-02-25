const { expect } = require('chai');
const sinon = require('sinon');

const { verifyotp } = require('../controllers/indexcontroller');

describe('verifyotp', () => {

    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                otp: '123456'
            }
        };

        res = {
            render: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render change password page if OTP matches', async () => {
        req.cookies = {
            otp: '123456'
        };

        await verifyotp(req, res);

        expect(res.render.calledOnceWith('../views/changepassword.ejs', {
            emailvalue: 'test@example.com',
            message: ''
        })).to.be.true;
    });

    it('should render forgot password page if OTP does not match', async () => {
        req.cookies = {
            otp: '654321'
        };

        await verifyotp(req, res);

        expect(res.render.calledOnceWith('../views/forgotpassword.ejs', {
            message: 'wrong otp Access Denied'
        })).to.be.true;
    });

});
