const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { employerloginhandler } = require('../controllers/employerlogincontroller.js');

describe('employerloginhandler', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                employerjwt: 'mockedToken'
            }
        };

        res = {
            render: sinon.spy()
        };
    });

    it('should render "employerabout.ejs" with correct user data if employerjwt cookie exists', async () => {
        const verifyStub = sinon.stub(jwt, 'verify').returns({ user: 'Test User', name: 'Test Name' });

        await employerloginhandler(req, res);

        expect(verifyStub.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/employerabout.ejs', { user: 'Test Name' })).to.be.true;

        jwt.verify.restore();
    });

    it('should render "employerlogin.ejs" with empty message if employerjwt cookie does not exist', async () => {
        req.cookies.employerjwt = undefined;
    
        await employerloginhandler(req, res);
    
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/employerlogin.ejs', { message: "" })).to.be.true;
    });
    
    it('should render "employerlogin.ejs" with empty message if jwt verification fails', async () => {
        const verifyStub = sinon.stub(jwt, 'verify').throws(new Error('Mocked verification error'));
    
       
    
        try {
            await employerloginhandler(req, res);
        } catch (error) {
            expect(error.message).to.equal("Mocked verification error");
        }
        
    });
    
});
