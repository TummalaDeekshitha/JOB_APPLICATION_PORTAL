// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');
// const Employerdetail = require('../model/employerschemacoll'); // Import your Employerdetail model
// const { sendEmail, removeemployer } = require('../controllers/admincontroller'); // Import the functions to test
// const app = require('../main'); // Import your Express app

// // Configure chai
// chai.use(chaiHttp);
// const expect = chai.expect;

// describe('removeemployer', function() {
//     afterEach(function() {
//         sinon.restore(); // Restore sinon's behavior after each test
//     });

//     it('should revoke employer eligibility and render admin view', async function() {
//         this.timeout(5000);
        
//         // Stub the Employerdetail.updateOne method to return a successful response
//         const updateOneStub = sinon.stub(Employerdetail, 'updateOne').resolves({ nModified: 1 });

//         // Stub the Employerdetail.find method to return a sample result
//         const findStub = sinon.stub(Employerdetail, 'find').resolves([{ /* Sample employer details */ }]);

//         // Stub the sendEmail function to return a resolved Promise
//         const sendEmailStub = sinon.stub().resolves();

//         // Create a mock request object
//         const req = {
//             query: { email: 'test@example.com' },
//             myusername: 'admin' // Assuming the admin username is provided in the request
//         };

//         // Create a mock response object with necessary methods
//         const res = {
//             render: sinon.spy(), // Spy on the render method to check if it's called
//             status: sinon.stub().returnsThis(), // Stub the status method to return the response object itself
//             send: sinon.stub() // Stub the send method to check if it's called in case of errors
//         };

//         // Call the removeemployer function with mock request and response objects
//         await removeemployer(req, res);

//         // Assertions for the success scenario
//         expect(updateOneStub.calledOnce).to.be.true; // Verify that updateOne method is called once
//         expect(updateOneStub.firstCall.args[0]).to.deep.equal({ email: 'test@example.com' });
//         expect(updateOneStub.firstCall.args[1]).to.deep.equal({ $set: { eligible: false } });

//         expect(sendEmailStub.calledOnce).to.be.true; // Verify that sendEmail function is called once
//         expect(sendEmailStub.firstCall.args[0]).to.equal('test@example.com');
//         expect(sendEmailStub.firstCall.args[1]).to.equal('JobForger - Permission Revoked');
//         expect(sendEmailStub.firstCall.args[2]).to.equal('Your permissions to post jobs on JobForge have been revoked.');

//         expect(findStub.calledOnce).to.be.true; // Verify that find method is called once

//         expect(res.render.calledOnce).to.be.true; // Verify that render method is called once
//         expect(res.render.firstCall.args[0]).to.equal('../views/adminabout.ejs');
//         expect(res.render.firstCall.args[1]).to.deep.equal({ user: 'admin', employerDetails: [{ /* Sample employer details */ }] });
      
//     });

//     it('should handle errors', async function() {
//         // Stub the Employerdetail.updateOne method to throw an error
//         const updateOneStub = sinon.stub(Employerdetail, 'updateOne').rejects(new Error('Database error'));

//         // Create a mock request object
//         const req = { query: { email: 'test@example.com' } };

//         // Create a mock response object with necessary methods
//         const res = {
//             status: sinon.stub().returnsThis(), // Stub the status method to return the response object itself
//             send: sinon.stub() // Stub the send method to check if it's called with error message
//         };

//         // Call the removeemployer function with mock request and response objects
//         await removeemployer(req, res);

//         // Assertions for the error scenario
//         expect(updateOneStub.calledOnce).to.be.true; // Verify that updateOne method is called once
//         expect(updateOneStub.firstCall.args[0]).to.deep.equal({ email: 'test@example.com' });
//         expect(updateOneStub.firstCall.args[1]).to.deep.equal({ $set: { eligible: false } });

//         expect(res.status.calledOnceWith(500)).to.be.true; // Verify that status method is called once with status code 500
//         expect(res.send.calledOnceWith('Internal Server Error')).to.be.true; // Verify that send method is called once with error message
//     });
// });
