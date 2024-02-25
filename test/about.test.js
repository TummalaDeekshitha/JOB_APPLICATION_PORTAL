const { about } = require('../controllers/indexcontroller');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { expect } = require('chai');

describe('about function', () => {
    let req, res, sandbox;

    beforeEach(() => {
        req = {
            cookies: {}
        };
        res = {
            render: sinon.spy()
        };
        
    });

    afterEach(() => {
        sinon.restore(); // Restore the sandbox after each test
    });

    it('should render "about.ejs" with user data if valid JWT token exists', async () => {
        // Mock a valid JWT token
        const token = jwt.sign({ name: 'Test User' }, 'thisismyfirstnodejsexpressmongodbproject');
        req.cookies.jwt = token;

        // Stub jwt.verify to return the user data
        sinon.stub(jwt, 'verify').returns({ name: 'Test User' });

        await about(req, res);

        expect(jwt.verify.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/about.ejs', { user: 'Test User' })).to.be.true;
    });

    it('should render "signin.ejs" with message "signin or singup first" if JWT token does not exist', async () => {
        await about(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'signin or singup first' })).to.be.true;
    });

    it('should render "signin.ejs" with message "signin or singup first" if JWT token is invalid', async () => {
        // Mock an invalid JWT token
        req.cookies.jwt = 'invalidToken';

        // Stub jwt.verify to throw an error
        sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

        await about(req, res);

        expect(jwt.verify.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'signin or singup first' })).to.be.true;
    });
});
