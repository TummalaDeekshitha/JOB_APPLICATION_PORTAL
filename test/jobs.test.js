const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const {jobschema}=require("../model/jobschemacoll.js")
const { searchjob } = require('../controllers/indexcontroller.js');

describe('searchjob function', () => {
    it('should render "searchresult.ejs" with correct category, role, and documents', async () => {
       
        const req = {
            body: {
                category: 'jobCategory',
                role: 'jobRole'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
            render: sinon.spy()
        };

        
        const mockFindResult = [{ jobname: 'jobRole' }];
        const mockModel = {
            find: sinon.stub().resolves(mockFindResult)
        };
        const Collectionjob = sinon.stub(mongoose, 'model').returns(mockModel);

        
        await searchjob(req, res);

        
        expect(Collectionjob.calledOnceWithExactly('jobCategories', jobschema)).to.be.true;
        expect(mockModel.find.calledOnceWithExactly({ jobname: 'jobRole' })).to.be.true;
        expect(res.render.calledOnceWithExactly('../views/searchresult.ejs', {
            category: 'jobCategory',
            role: 'jobRole',
            documents: mockFindResult,
            user: undefined 
        })).to.be.true;

        
        Collectionjob.restore();
    });

   
});
