const { expect } = require('chai');
const sinon = require('sinon');

const { verifyotp } = require('../controllers/indexcontroller.js');
// const { adminloginverifyotp } = require('../controllers/admincontroller.js');

describe('OTP Verification Functions', () => {
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

    describe('verifyotp function', () => {
        it('should render "changepassword.ejs" if OTP matches', () => {
            verifyotp(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('../views/changepassword.ejs', { emailvalue: 'test@example.com', message: '' })).to.be.true;
        });

        it('should render "forgotpassword.ejs" with error message if OTP does not match', () => {
            req.cookies.otp = '654321'; 

            verifyotp(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWithExactly('../views/forgotpassword.ejs', { message: 'wrong otp Access Denied' })).to.be.true;
        });
    });

    // describe('adminloginverifyotp function', () => {
    //     it('should render adminloginchangepassword.ejs with correct email when OTP matches', () => {
    //         adminloginverifyotp(req, res);

    //         expect(res.render.calledOnce).to.be.true;
    //         expect(res.render.calledWithExactly('../views/adminloginchangepassword.ejs', { emailvalue: 'test@example.com', message: '' })).to.be.true;
    //     });

    //     it('should render adminforgotpassword.ejs with error message when OTP does not match', () => {
    //         req.body.otp = '654321'; 

    //         adminloginverifyotp(req, res);

    //         expect(res.render.calledOnce).to.be.true;
    //         expect(res.render.calledWithExactly('../views/adminforgotpassword.ejs', { message: 'wrong otp Access Denied' })).to.be.true;
    //     });
    // });
});
