const Employerdetail = require('../model/employerschemacoll');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Employerdetail Model', () => {
    describe('save hook', () => {
        it('should hash password before saving', async () => {
            const plaintextPassword = 'password123';
            const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

            const employer = new Employerdetail({ name: 'Test Employer', email: 'test@example.com', pass: plaintextPassword });
            await employer.save();

            expect(employer.pass).to.not.equal(plaintextPassword);
            expect(await bcrypt.compare(plaintextPassword, employer.pass)).to.be.true;
        });
    });

    describe('generateAuthToken method', () => {
        it('should generate a valid JWT token', async () => {
            const employer = new Employerdetail({ name: 'Test Employer', email: 'test@example.com', pass: 'password123' });

            const jwtStub = sinon.stub(jwt, 'sign').returns('mockedToken');
            const saveStub = sinon.stub(employer, 'save').resolves();

            const token = await employer.generateAuthToken();

            expect(token).to.equal('mockedToken');
            expect(jwtStub.calledOnceWithExactly({ _id: employer._id, name: employer.name, email: employer.email }, "thisismyfirstnodejsexpressmongodbproject")).to.be.true;
            expect(saveStub.calledOnce).to.be.true;

            jwtStub.restore();
            saveStub.restore();
        });

        it('should handle errors during token generation', async () => {
            const employer = new Employerdetail({ name: 'Test Employer', email: 'test@example.com', pass: 'password123' });

            const jwtStub = sinon.stub(jwt, 'sign').throws(new Error('Mocked JWT Error'));
            const consoleErrorStub = sinon.stub(console, 'error');

            const token = await employer.generateAuthToken();

            expect(token).to.be.undefined;
            expect(jwtStub.calledOnce).to.be.true;
            expect(consoleErrorStub.calledOnceWithExactly('the error Mocked JWT Error')).to.be.true;

            jwtStub.restore();
            consoleErrorStub.restore();
        });
    });
});
