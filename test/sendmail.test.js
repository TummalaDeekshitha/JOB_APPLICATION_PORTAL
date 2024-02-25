const { expect } = require('chai');
const sinon = require('sinon');

const { sendmail } = require('../controllers/employerlogincontroller');

describe('sendmail', () => {

    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            render: sinon.spy()
        };
    });

    it('should render the mail view', () => {
        req.myemail = 'test@example.com';
        req.query = {
            email: 'recipient@example.com',
            category: 'category',
            job: 'job',
            company: 'company'
        };

        sendmail(req, res);

        expect(res.render.calledOnceWith('../views/mail.ejs', {
            from: req.myemail,
            to: req.query.email,
            Category: req.query.category,
            Job: req.query.job,
            company: req.query.company
        })).to.be.true;
    });

    it('should handle errors', async() => {
        try {
             sendmail(req, res);
        } catch (error) {
            expect(error.message).to.equal("Cannot read properties of undefined (reading 'email')");
        }
    });

});
