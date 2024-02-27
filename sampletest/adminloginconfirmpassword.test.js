const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const Employerdetail = require('../model/employerschemacoll.js');
const {adminloginconfirmpassword} = require('../controllers/admincontroller.js');

describe('adminloginconfirmpassword function', () => {
    let req, res, updateOneStub;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                newPassword: 'newPassword',
                confirmPassword: 'newPassword'
            }
        };

        res = {
            render: sinon.spy()
        };

        updateOneStub = sinon.stub(Employerdetail, 'updateOne');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render adminlogin.ejs with success message if passwords match', async () => {
        
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        updateOneStub.resolves({ nModified: 1 });
        await adminloginconfirmpassword(req, res);

        expect(updateOneStub.calledOnceWith({ email: 'test@example.com' }, { $set: { pass: 'hashedPassword' } })).to.be.true;
        expect(res.render.calledOnceWithExactly("../views/adminlogin.ejs", { message: "your password changed " })).to.be.true;
    });

    it('should render adminloginchangepassword.ejs with error message if passwords do not match', async () => {
        req.body.confirmPassword = 'differentPassword';

        await adminloginconfirmpassword(req, res);

        expect(updateOneStub.called).to.be.false;
        expect(res.render.calledOnceWithExactly("../views/adminloginchangepassword.ejs", { message: "password not match" })).to.be.true;
    });
});
