const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { index } = require('../controllers/indexcontroller.js');

describe('index function', () => {
    it('should render "about.ejs" with user information if jwt cookie is present', async () => {
       
        const req = {
            cookies: { jwt: 'testToken' }
        };
        const res = {
            render: sinon.spy()
        };

        
        const verifyStub = sinon.stub(jwt, 'verify').returns({ name: 'Test User' });

        
        await index(req, res);

        expect(verifyStub.calledOnceWithExactly('testToken', "thisismyfirstnodejsexpressmongodbproject")).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/about.ejs', { user: 'Test User' })).to.be.true;

        
        verifyStub.restore();
    });

    it('should render "employerabout.ejs" with employer information if employerjwt cookie is present', async () => {
       
        const req = {
            cookies: { employerjwt: 'testToken' }
        };
        const res = {
            render: sinon.spy()
        };

       
        const verifyStub = sinon.stub(jwt, 'verify').returns({ name: 'Test Employer' });

       
        await index(req, res);

        expect(verifyStub.calledOnceWithExactly('testToken', "thisismyfirstnodejsexpressmongodbproject")).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/employerabout.ejs', { user: 'Test Employer' })).to.be.true;

        
        verifyStub.restore();
    });

    it('should render "index.ejs" if no jwt or employerjwt cookie is present', async () => {
        
        const req = {
            cookies: {}
        };
        const res = {
            render: sinon.spy()
        };

        await index(req, res);

      
        expect(res.render.calledOnceWithExactly('../views/index.ejs')).to.be.true;
    });
});
