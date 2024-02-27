const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const { aboutpage } = require('../controllers/indexcontroller');
const Signupcoll = require('../model/signupcoll.js');
describe('aboutpage', () => {

    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email1: 'test@example.com',
                password1: 'password123'
            }
        };

        res = {
            cookie: sinon.spy(),
            render: sinon.spy()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render about page if email and password match', async () => {
        sinon.stub(Signupcoll, 'findOne').resolves({
            pass: await bcrypt.hash('password123', 10),
            tokens: [{ token: 'testtoken' }],
            name: 'Test User'
        });

        sinon.stub(Signupcoll, 'countDocuments').resolves(1);

        sinon.stub(bcrypt, 'compare').resolves(1);

        await aboutpage(req, res);

        expect(res.render.calledWith('../views/about.ejs', { user: 'Test User' })).to.be.true;
    });

    it('should render signin page with wrong password message if password does not match', async () => {
        sinon.stub(Signupcoll, 'findOne').resolves({
            pass: await bcrypt.hash('wrongpassword', 10),
            tokens: [{ token: 'testtoken' }]
        });

        sinon.stub(Signupcoll, 'countDocuments').resolves(1);

        sinon.stub(bcrypt, 'compare').resolves(0);

        await aboutpage(req, res);

        expect(res.render.calledWith('../views/signin.ejs', { message: 'wrong password' })).to.be.true;
    });

    it('should render signin page with no account message if email not found', async () => {
        sinon.stub(Signupcoll, 'countDocuments').resolves(0);

        await aboutpage(req, res);

        expect(res.render.calledWith('../views/signin.ejs', { message: "you don't have account" })).to.be.true;
    });
    it('should handle errors', async () => {
        async () => {
            // Mock an invalid JWT token
            try {
                await aboutpage(req, res);
            } catch (error) {
                expect(error.message).to.equal("Cannot read properties of undefined (reading 'status')");
            }
    
        }})
    })
