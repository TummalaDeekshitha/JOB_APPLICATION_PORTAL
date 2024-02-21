const { expect } = require('chai');
const sinon = require('sinon');
const { employerloginverifyotp } = require('../controllers/employerlogincontroller.js');

describe('employerloginverifyotp function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                otp: '123456'
            },
            cookies: {
                otp: '123456'
            }
        };

        res = {
            render: sinon.spy()
        };
    });

    it('should render employerloginchangepassword.ejs if OTP is correct', () => {
        employerloginverifyotp(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/employerloginchangepassword.ejs', { emailvalue: 'test@example.com', message: '' })).to.be.true;
    });

    it('should render employerforgotpassword.ejs with error message if OTP is incorrect', () => {
        req.body.otp = '654321'; // Incorrect OTP

        employerloginverifyotp(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/employerforgotpassword.ejs', { message: 'wrong otp Access Denied' })).to.be.true;
    });
});
