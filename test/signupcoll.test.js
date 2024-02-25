const Signupcoll = require('../model/signupcoll');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Signupcoll Model', () => {
    describe('save hook', () => {
        it('should hash password before saving', async () => {
            const plaintextPassword = 'password123';
            const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

            const signup = new Signupcoll({ name: 'Test User', email: 'test@example.com', pass: plaintextPassword });
            await signup.save();

            expect(signup.pass).to.not.equal(plaintextPassword);
            expect(await bcrypt.compare(plaintextPassword, signup.pass)).to.be.true;
        });
    });

    describe('generateAuthToken method', () => {
        it('should generate a valid JWT token', async () => {
            const signup = new Signupcoll({ name: 'Test User', email: 'test@example.com', pass: 'password123' });

            const jwtStub = sinon.stub(jwt, 'sign').returns('mockedToken');
            const saveStub = sinon.stub(signup, 'save').resolves();

            const token = await signup.generateAuthToken();

            expect(token).to.equal('mockedToken');
            expect(jwtStub.calledOnceWithExactly({ _id: signup._id, email: signup.email, name: signup.name }, "thisismyfirstnodejsexpressmongodbproject")).to.be.true;
            expect(saveStub.calledOnce).to.be.true;

            jwtStub.restore();
            saveStub.restore();
        });

        it('should handle errors during token generation', async () => {
            const signup = new Signupcoll({ name: 'Test User', email: 'test@example.com', pass: 'password123' });

            const jwtStub = sinon.stub(jwt, 'sign').throws(new Error('Mocked JWT Error'));
            const consoleErrorStub = sinon.stub(console, 'error');

            const token = await signup.generateAuthToken();

            expect(token).to.be.undefined;
            expect(jwtStub.calledOnce).to.be.true;
            expect(consoleErrorStub.calledOnceWithExactly('the error Mocked JWT Error')).to.be.true;

            jwtStub.restore();
            consoleErrorStub.restore();
        });
    });
});
