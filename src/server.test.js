

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