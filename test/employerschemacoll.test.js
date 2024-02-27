const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Employerdetail = require('../model/employerschemacoll.js');

describe('Employerdetail Model', () => {
    let employer;

    beforeEach(() => {
        employer = new Employerdetail({
            name: 'Test Employer',
            companyname: 'Test Company',
            email: 'test@example.com',
            pass: 'password123',
            industry: 'Test Industry',
            employeridnumber: '123456',
            aadharnumber: 1234567890,
            photo: 'test.jpg'
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should hash password before saving', async () => {
        const bcryptStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

        await employer.save();

        expect(bcryptStub.calledOnce).to.be.true;
        expect(employer.pass).to.equal('hashedPassword');
    });

    it('should generate auth token', async () => {
        const jwtStub = sinon.stub(jwt, 'sign').returns('mockedToken');
        const saveStub = sinon.stub(employer, 'save').resolves();

        const token = await employer.generateAuthToken();

        expect(jwtStub.calledOnce).to.be.true;
        expect(saveStub.calledOnce).to.be.true;
        expect(token).to.equal('mockedToken');
    });
});
