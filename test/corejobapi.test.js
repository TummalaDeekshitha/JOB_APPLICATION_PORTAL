const { expect } =require( 'chai');
const sinon =require('sinon');
const Signupcoll =require( '../model/signupcoll'); 
const  {userdata}=require('../controllers/indexcontroller'); 

describe('userdata function', () => {
    it('should respond with user data', async () => {
        
        const req = {};
        let res = {
            
            json: function(data) {
                this.data = data; 
            }
        };

        
        const fakeUserData = [
            { _id: '1', name: 'User 1', email: 'user1@example.com' },
            { _id: '2', name: 'User 2', email: 'user2@example.com' }
        ];

        // Mock the find method of Signupcoll to return fake user data
        Signupcoll.find = async () => fakeUserData;

        await userdata(req, res);
        expect(res.data).to.deep.equal(fakeUserData);
    });

    
});
