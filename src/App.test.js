import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Content from './Content.js';
import { shallow, mount, render } from 'enzyme';
var express = require('express');
var fetch = require('node-fetch');
var assert = require('assert');

//UI Testing

it('renders App without crashing', () => {
 	const div = document.createElement('div');
  	ReactDOM.render(<App />, div);
  	ReactDOM.unmountComponentAtNode(div);
});

it('renders Content without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Content />, div);
	ReactDOM.unmountComponentAtNode(div);
});


// Content initial values testing

it('has correct initial company', () => {
	const content = mount(<Content/>);
	const expectedName = 'DJI';
	const actualName = content.instance().state.name;
	expect(actualName).toBe(expectedName);
});

it('has correct starting activeTab', () => {
	const content = mount(<Content/>);
	const expectedTab = 'table';
	const actualTab = content.instance().state.activeTab;
	expect(actualTab).toBe(expectedTab);
});

it('has no error Text to start off', () => {
	const content = mount(<Content/>);
	const expectedErrorText = '';
	const actualErrorText = content.instance().state.errorText;
	expect(actualErrorText).toBe(expectedErrorText);
});

// server testing



describe('Stock Get Call Interday', function() {
    it('Call to company symbol AAPL', async () => {
        var url = 'http://localhost:3001/api/company/AAPL/interday';
        let results = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
        const data = results.text;
        assert.equal(results.status, 200);
        expect(data).not.toBe(null);
    });
});

describe('Stock Get Call Intraday', function() {
    it('Call to company symbol AAPL', async () => {
        var url = 'http://localhost:3001/api/company/AAPL/intraday';
        let results = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
        const data = results.text;
        assert.equal(results.status, 200);
        expect(data).not.toBe(null);
    });
})


describe('API Crypto Get Call', function() {
    it('Call to cryptocurrency Ethereum', async () => {
        var url = 'http://localhost:3001/api/coin/ETH';
        let results = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
        const data = results.text;
        assert.equal(results.status, 200);
        expect(data).not.toBe(null);
    });
});

describe('API News Get Call', function() {
    it('Call to News API for Apple', async () => {
        var url = 'http://localhost:3001/api/news/apple';
        let results = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
        const data = results.text;
        assert.equal(results.status, 200);
        expect(data).not.toBe(null);
    });

});





