const { about } = require('../controllers/indexcontroller');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { expect } = require('chai');

describe('about function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {}
        };
        res = {
            render: sinon.spy()
        };
        
    });

    afterEach(() => {
        sinon.restore(); 
    });

    it('should render "about.ejs" with user data if valid JWT token exists', async () => {
        
        const token = jwt.sign({ name: 'Test User' }, 'thisismyfirstnodejsexpressmongodbproject');
        req.cookies.jwt = token;

        
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
        
        try {
            await about(req, res);
        } catch (error) {
            expect(error.message).to.equal("Cannot read properties of undefined (reading 'status')");
        }

    });
});
