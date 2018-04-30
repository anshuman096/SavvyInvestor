

var express = require('express');
var fetch = require('node-fetch');
var assert = require('assert');



describe('Stock Get Call', function() {
    it('Call to company symbol AAPL', () => {
    

            var url = 'http://localhost:3001/api/company/' + 'AAPL';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log(results.status)
                console.log("Right here")


                assert.equal(results.status, 200)
            
            })

            


        });
});


describe('API Crypto Get Call', function() {
    it('Call to currency symbol ETH', () => {
        

        var url = 'http://localhost:3001/api/coin/' + 'ETH';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});

describe('API News Get Call', function() {
    it('Call to currency symbol Apple', () => {
        

        var url = 'http://localhost:3001/api/news/' + 'apple';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});


describe('API Add Account call', function() {
    it('Add account', () => {
        

        var url = 'http://localhost:3001/api/account/' + 'add/curran+bhatia';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});

describe('API Delete Account call', function() {
    it('Delete account', () => {
        

        var url = 'http://localhost:3001/api/account/' + 'delete/curran+bhatia';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});


describe('API Login Account call', function() {
    it('Login account', () => {
        

        var url = 'http://localhost:3001/api/current/' + 'add/curran+bhatia';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});

describe('API Logout Account call', function() {
    it('Logout account', () => {
        

        var url = 'http://localhost:3001/api/current/' + 'logout/curran+bhatia';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            }).then(results => {
                console.log("Right here")

                assert.equal(results.status, 200)
            
            });

    });
});