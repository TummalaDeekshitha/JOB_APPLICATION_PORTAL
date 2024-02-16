const { expect } = require('chai');
const mongoose = require('mongoose');
const { jobschema, Corejob, Softwarejob } = require('../model/jobschemacoll');

describe('Job Schema and Models', () => {
    describe('Job Schema', () => {
        it('should have the required fields', () => {
            const { companyname, jobname, totalapplications, openings, lastdate, description, logo, employeremail } = jobschema.obj;
            expect(companyname).to.exist;
            expect(jobname).to.exist;
            expect(totalapplications).to.exist;
            expect(openings).to.exist;
            expect(lastdate).to.exist;
            expect(description).to.exist;
            expect(logo).to.exist;
            expect(employeremail).to.exist;
        });

        it('should have the correct types for each field', () => {
            const { companyname, jobname, totalapplications, openings, lastdate, description, logo, employeremail } = jobschema.obj;
            expect(companyname).to.be.a('object');
            expect(jobname).to.be.a('object');
            expect(totalapplications).to.be.a('object');
            expect(openings).to.be.a('object');
            expect(lastdate).to.be.a('object');
            expect(description).to.be.a('object');
            expect(logo).to.be.a('object');
            expect(employeremail).to.be.a('object');
        });

        it('should have required fields set to true', () => {
            const { companyname, jobname, totalapplications, openings, lastdate, description, employeremail } = jobschema.obj;
            expect(companyname.required).to.be.true;
            expect(jobname.required).to.be.true;
            expect(totalapplications.required).to.be.true;
            expect(openings.required).to.be.true;
            expect(lastdate.required).to.be.true;
            expect(description.required).to.be.true;
            expect(employeremail.required).to.be.true;
        });
    });

    describe('Job Models', () => {
        it('should create a new instance of Softwarejob', () => {
            const softwareJob = new Softwarejob({
                companyname: 'Google',
                jobname: 'Software Engineer',
                totalapplications: 100,
                openings: 10,
                lastdate: new Date(),
                description: 'Job description',
                logo: { data: Buffer.from('image data'), contentType: 'image/jpeg' },
                employeremail: 'employer@example.com'
            });
            expect(softwareJob).to.be.instanceOf(Softwarejob);
        });

        it('should create a new instance of Corejob', () => {
            const coreJob = new Corejob({
                companyname: 'Microsoft',
                jobname: 'Core Developer',
                totalapplications: 50,
                openings: 5,
                lastdate: new Date(),
                description: 'Job description',
                logo: { data: Buffer.from('image data'), contentType: 'image/jpeg' },
                employeremail: 'employer@example.com'
            });
            expect(coreJob).to.be.instanceOf(Corejob);
        });
    });
});
