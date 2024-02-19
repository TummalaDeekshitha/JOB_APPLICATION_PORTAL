const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { verify } = require('../controllers/admincontroller.js');
const Employerdetail = require('../model/employerschemacoll.js');

describe('verify function', () => {
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

    it('should render adminabout.ejs with employer details if adminjwt cookie is present', async () => {
        req.cookies.adminjwt = 'validToken';
        const decodedToken = { name: 'Admin Name' };
        const employerDetails = [{ /* Sample employer details */ }];

        sinon.stub(jwt, 'verify').returns(decodedToken);
        sinon.stub(Employerdetail, 'find').resolves(employerDetails);

        await verify(req, res);

        expect(res.render.calledOnceWithExactly("../views/adminabout.ejs", { employerDetails, user: decodedToken.name })).to.be.true;
    });

    it('should render adminlogin.ejs with message "login here" if adminjwt cookie is not present', async () => {
        await verify(req, res);

        expect(res.render.calledOnceWithExactly("../views/adminlogin.ejs", { message: "login here" })).to.be.true;
    });

   
});
