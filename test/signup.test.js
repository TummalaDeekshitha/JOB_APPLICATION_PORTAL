// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const supertest = require('supertest');
// const database = require('../mangoosefile');
// const Signupcoll = require('../model/signupcoll');

// let app = require('../main');
// const request = supertest(app);

// afterEach(() => {
//     sinon.restore();
// })

// describe('SignUp Controller', () => {

//     it('should render signin page if countdocumets present', async () => {
//         // Stub functions
//         sinon.stub(Signupcoll, 'countDocuments').resolves(1);

//         // Calling the route
//         let res = request
//             .post('/signup')
//             .send({ username: 'test', email: 'EMAIL', pass: 'PASSWORD' })

//         // console.log(res)
//         // Asserting the response
//         expect(res.status).to.equal(200);
//         expect(res.text).to.includes('<title>Signup Form Portal</title>');
//     });

// });