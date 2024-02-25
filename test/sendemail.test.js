const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const nodemailer = require('nodemailer');

const {sendEmail} = require('../controllers/admincontroller');

describe('sendEmail function', () => {

  afterEach(() => {
    sinon.restore();
  });

  it('should send email successfully', async () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test message';

    // Mock nodemailer transporter
    const sendMailStub = sinon.stub().resolves({ response: 'success' });
    const createTransportStub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sendMailStub
    });

    await sendEmail(email, subject, text);

    expect(createTransportStub.calledOnce).to.be.true;
    expect(sendMailStub.calledOnce).to.be.true;
    expect(sendMailStub.firstCall.args[0]).to.deep.equal({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text
    });
  });

  it('should handle error in sending email', async () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test message';

    // Mock nodemailer transporter to throw an error
    const sendMailStub = sinon.stub().rejects(new Error('Error sending email'));
    const createTransportStub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sendMailStub
    });

    // Wrap the function call in a try-catch block to catch the thrown error
    let error;
    try {
      await sendEmail(email, subject, text);
    } catch (err) {
      error = err;
    }

    expect(createTransportStub.calledOnce).to.be.true;
    expect(sendMailStub.calledOnce).to.be.true;
    expect(error).to.exist;
    expect(error.message).to.equal('Error sending email');
  });

});
