const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { signinhandle } = require('../controllers/indexcontroller.js');

describe('signinhandle function', () => {
    let req, res;

    beforeEach(() => {
       
        req = {
            cookies: {}
        };
        res = {
            render: sinon.spy()
        };
    });

    it('should render "about.ejs" with user information if JWT cookie exists and is valid', async () => {
        const user = { name: 'John Doe' };
        const token = jwt.sign(user, 'thisismyfirstnodejsexpressmongodbproject');
        req.cookies.jwt = token;

        
        await signinhandle(req, res);

       
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/about.ejs', { user: user.name })).to.be.true;
    });

    it('should render "signin.ejs" with message "signin or singup first" if JWT cookie does not exist', async () => {
       
        await signinhandle(req, res);

       
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWithExactly('../views/signin.ejs', { message: 'signin or singup first' })).to.be.true;
    });
});
