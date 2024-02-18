const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const { aboutpage } = require('../controllers/indexcontroller.js');

describe('aboutpage function', () => {
    it('should render "about.ejs" with user information if email and password match', async () => {
        
        const req = {
            body: {
                email1: 'test@example.com',
                password1: 'password'
            }
        };
        const res = {
            cookie: sinon.spy(),
            render: sinon.spy()
        };

       
        const mockUser = {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            pass: await bcrypt.hash('password', 10), 
            tokens: [{ token: 'testToken' }]
        };
        const findOneStub = sinon.stub().resolves(mockUser);
        const countDocumentsStub = sinon.stub().resolves(1);
        const Signupcoll = { findOne: findOneStub, countDocuments: countDocumentsStub };

       
        await aboutpage(req, res);

        
        expect(findOneStub.calledOnceWithExactly({ email: 'test@example.com' })).to.be.true;
        expect(countDocumentsStub.calledOnceWithExactly({ email: 'test@example.com' })).to.be.true;
        expect(bcrypt.compareSync('password', mockUser.pass)).to.be.true;
        expect(res.cookie.calledOnceWithExactly('jwt', 'testToken', { maxAge: 100000000, httpOnly: true })).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/about.ejs', { user: 'Test User' })).to.be.true;
    });

    it('should render "signin.ejs" with message "wrong password" if email exists but password does not match', async () => {
       
        const req = {
            body: {
                email1: 'test@example.com',
                password1: 'wrongpassword'
            }
        };
        const res = {
            render: sinon.spy()
        };

        
        const mockUser = {
            _id: '1',
            name: 'Test User',
            email: 'test@example.com',
            pass: await bcrypt.hash('password', 10) 
        };
        const findOneStub = sinon.stub().resolves(mockUser);
        const countDocumentsStub = sinon.stub().resolves(1);
        const Signupcoll = { findOne: findOneStub, countDocuments: countDocumentsStub };

      
        await aboutpage(req, res);

        
        expect(findOneStub.calledOnceWithExactly({ email: 'test@example.com' })).to.be.true;
        expect(countDocumentsStub.calledOnceWithExactly({ email: 'test@example.com' })).to.be.true;
        expect(bcrypt.compareSync('wrongpassword', mockUser.pass)).to.be.false;
        expect(res.render.calledOnceWithExactly('../views/signin.ejs', { message: 'wrong password' })).to.be.true;
    });

    it('should render "signin.ejs" with message "you don\'t have account" if email does not exist', async () => {
        const req = {
            body: {
                email1: 'nonexistent@example.com',
                password1: 'password'
            }
        };
        const res = {
            render: sinon.spy()
        };

      
        const findOneStub = sinon.stub().resolves(null);
        const countDocumentsStub = sinon.stub().resolves(0);
        const Signupcoll = { findOne: findOneStub, countDocuments: countDocumentsStub };

        
        await aboutpage(req, res);

        
        expect(findOneStub.calledOnceWithExactly({ email: 'nonexistent@example.com' })).to.be.true;
        expect(countDocumentsStub.calledOnceWithExactly({ email: 'nonexistent@example.com' })).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/signin.ejs', { message: "you don't have account" })).to.be.true;
    });

   
});
