const { viewyourposts } = require('../controllers/employerlogincontroller');
const sinon = require('sinon');
const { expect } = require('chai');

describe('viewyourposts', function() {

    let req, res, SoftwarejobStub, CorejobStub;

    beforeEach(() => {
        req = {
            myemail: 'test@example.com',
            myusername: 'testuser'
        };

        res = {
            render: sinon.spy()
        };

        SoftwarejobStub = sinon.stub();
        CorejobStub = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render myposts view with software and core job posts', function() {
        this.timeout(10000);
        const softwarePosts = [{ title: 'Software Engineer' }];
        const corePosts = [{ title: 'Project Manager' }];

        SoftwarejobStub.returns({
            find: sinon.stub().resolves(softwarePosts)
        });
        CorejobStub.returns({
            find: sinon.stub().resolves(corePosts)
        });

        return viewyourposts(req, res).then(() => {
            expect(SoftwarejobStub.calledWith({ employeremail: req.myemail })).to.be.true;
            expect(CorejobStub.calledWith({ employeremail: req.myemail })).to.be.true;
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args[0]).to.equal('../views/myposts.ejs');
            expect(res.render.firstCall.args[1]).to.deep.equal({
                softwareposts: softwarePosts,
                coreposts: corePosts,
                user: req.myusername
            });
        });
    });
});
