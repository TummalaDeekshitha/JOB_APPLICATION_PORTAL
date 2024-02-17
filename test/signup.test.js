const { expect } = require('chai');
const sinon = require('sinon');
const { signup } = require('../controllers/indexcontroller.js');
const Signupcoll = require('../model/signupcoll');

describe('signup function', () => {
    it('should render "signin.ejs" with message "you already have an account" if email already exists', async () => {
        
        const req = {
            body: {
                username: 'testuser',
                email: 'existing@example.com',
                pass: 'password'
            }
        };
        const res = {
            render: sinon.spy() 
        };

        
        const countDocumentsStub = sinon.stub(Signupcoll, 'countDocuments').resolves(1);

       
        await signup(req, res);

       
        expect(countDocumentsStub.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'you already have an account' })).to.be.true;

        
        countDocumentsStub.restore();
    });

    it('should create a new account and render "signin.ejs" with message "account done" if email does not exist', async (done) => {
        
        const req = {
            body: {
                username: 'newuser',
                email: 'new@example.com',
                pass: 'password'
            }
        };
        const res = {
            render: sinon.spy() 
        };

        
        const countDocumentsStub = sinon.stub(Signupcoll, 'countDocuments').resolves(0);

       
        await signup(req, res);

        
        expect(countDocumentsStub.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'account done' })).to.be.true;

       
        countDocumentsStub.restore();
        done();
    }).timeout(10000);

   
});
