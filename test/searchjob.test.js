const { expect } = require('chai');
const sinon = require('sinon');
const { searchjob } = require('../controllers/indexcontroller.js');
const mongoose = require('mongoose');

describe('searchjob function', () => {
    let req, res;

    beforeEach(() => {
        
        req = {
            body: {
                category: 'IT',
                role: 'Software Engineer'
            },
            myusername: 'testuser'
        };
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
            render: sinon.spy()
        };
    });

    afterEach(() => {
        
        sinon.restore();
    });

    it('should return 400 status with message if category or role is missing in request body', async () => {
        req.body.category = undefined;
    
        await searchjob(req, res);
    
        // Log the actual response status and message for debugging
        console.log('Response Status:', res.status.args[0][0]);
        console.log('Response Message:', res.send.args[0][0]);
    
        // Expectations
        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.calledWith('NO category or role  got selected')).to.be.true;
    });
    

    it('should render "searchresult.ejs" with correct data if category and role are provided', async () => {
       
        sinon.stub(mongoose, 'model').returns({
            find: sinon.stub().resolves([{ jobname: 'Software Engineer', otherField: 'value' }])
        });

        
        await searchjob(req, res);

       
        expect(res.render.calledOnceWithExactly('../views/searchresult.ejs', {
            category: 'IT',
            role: 'Software Engineer',
            documents: [{ jobname: 'Software Engineer', otherField: 'value' }],
            user: 'testuser'
        })).to.be.true;
    });

    it('should return 500 status with message if an error occurs during search', async () => {
        
        sinon.stub(mongoose, 'model').throws(new Error('Database error'));
       await searchjob(req, res);
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.send.calledOnceWith('Internal server error')).to.be.true;
    });
});
