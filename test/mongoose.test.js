// const { expect } = require('chai');
// const sinon = require('sinon');
// const mongoose = require('mongoose');
// const { connectDB } = require('../mangoosefile.js');

// describe('connectDB function', () => {
//     let connectStub;

//     before(() => {
//         connectStub = sinon.stub(mongoose, 'connect');
//     });

//     after(() => {
//         connectStub.restore();
//     });

//     it('should connect to the database with the provided URL', async () => {
//         const url = 'mongodb://localhost:27017/test';

//         await connectDB();

//         expect(connectStub.calledOnce).to.be.true;
//         expect(connectStub.calledWithExactly(url)).to.be.true;
//     });

//     it('should log an error message if connection fails', async () => {
//         const errorMessage = 'Connection error message';
//         connectStub.rejects(new Error(errorMessage));

//         const consoleErrorStub = sinon.stub(console, 'error');

//         try {
//             await connectDB();
//         } catch (error) {
//             expect(error.message).to.equal(errorMessage);
//         }

//         expect(consoleErrorStub.calledOnce).to.be.true;
//         expect(consoleErrorStub.calledWithExactly(`Error connecting to DB: ${errorMessage}`)).to.be.true;

//         consoleErrorStub.restore();
//     });
// });
