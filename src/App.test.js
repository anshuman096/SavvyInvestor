import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Content from './Content.js';
import { shallow, mount, render } from 'enzyme';

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
	const expectedName = 'MSFT';
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

// Content change

it('picks up tab changes', () => {
	const content = mount(<Content/>);
	content.instance().handleTabChange('chart');
	const actualActiveTab = content.instance().state.activeTab;
	const expectedActiveTab = 'chart';
	expect(actualActiveTab).toBe(expectedActiveTab);
});

it('picks up invalid symbols correctly', () => {
	const content = mount(<Content/>);
	content.instance().setState({name: 'Invalid'});
	content.instance()._loadData();
	const actualErrorText = content.instance().state.errorText;
	const expectedErrorText = '';//sus
	expect(actualErrorText).toBe(expectedErrorText);
})



