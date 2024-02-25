
const { signup } = require('../controllers/indexcontroller.js');
const Signupcoll = require('../model/signupcoll');
const sinon = require('sinon');
const { expect } = require('chai');

describe('signup function', () => {
    let req, res, sandbox, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            render: sinon.spy()
        };
        sandbox = sinon.createSandbox();
        next = sinon.spy(); // Create a spy for next function
    });

    afterEach(() => {
        sandbox.restore(); // Restore the sandbox after each test
    });

    it('should render "signin.ejs" with message "you already have an account" if email already exists', async () => {
        const existingEmail = 'existing@example.com';
        req.body.email = existingEmail;

        // Stub countDocuments to return a value greater than 0
        sandbox.stub(Signupcoll, 'countDocuments').resolves(1);

        await signup(req, res, next); // Pass next function to the signup function

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'you already have an account' })).to.be.true;
    });

    it('should render "signin.ejs" with message "account done" if email does not exist and account is successfully created', async () => {
        req.body.username = 'testUser';
        req.body.email = 'test@example.com';
        req.body.pass = 'testPassword';

        // Stub countDocuments to return 0
        sandbox.stub(Signupcoll, 'countDocuments').resolves(0);

        const mockSave = sandbox.stub(Signupcoll.prototype, 'save').resolves();

        // Stub generateAuthToken to return a token
        const mockToken = 'mockedToken';
        sandbox.stub(Signupcoll.prototype, 'generateAuthToken').resolves(mockToken);

        await signup(req, res, next); // Pass next function to the signup function

        expect(Signupcoll.prototype.generateAuthToken.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'account done' })).to.be.true;
    });

    // it('should handle errors during signup', async () => {
    //     const errorMessage = 'Mocked error during signup';
    //     sandbox.stub(Signupcoll, 'countDocuments').rejects(new Error(errorMessage));

    //     const consoleErrorSpy = sandbox.spy(console, 'error');

    //     await signup(req, res, next); // Pass next function to the signup function

    //     expect(consoleErrorSpy.calledOnceWithExactly("Error during signup:", new Error(errorMessage))).to.be.false;
    //     expect(next.calledOnceWithExactly(new Error(errorMessage))).to.be.true; // Ensure next is called with the error
    //     expect(res.render.called).to.be.false;
    // });
});
