'use strict';

const { assert, expect } = require('chai');

const ContextUrlExtractor = require('../context-url-extractor');

describe('Creating an instance of context-url-extractor', () => {

	const content = 'This is some content';

	it('should instantiate an object of the expected type', () => {
		const extractor = new ContextUrlExtractor({ content });
		expect(extractor).to.be.instanceof(ContextUrlExtractor);
	});

	it('should handle the supported constructor parameters', () => {
		const extractor = new ContextUrlExtractor({ content });
		expect(extractor).to.have.property('content').that.is.a('string').to.equal(content);
		expect(extractor).to.have.property('contextCharsBefore').that.is.a('number').to.equal(170);
		expect(extractor).to.have.property('contextCharsAfter').that.is.a('number').to.equal(170);
	});

	it('should handle overwriting of default context chars', () => {
		const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 169, contextCharsAfter: 171 });
		expect(extractor.contextCharsBefore).to.be.a('number').to.equal(169);
		expect(extractor.contextCharsAfter).to.be.a('number').to.equal(171);
	});

	it('should export the extractUrls() method', () => {
		const extractor = new ContextUrlExtractor({ content });
		assert.isFunction(extractor.extractUrls);
	});

});

describe('Calling the extractUrl() method', () => {

	const testUrl = 'https://careers.example.com/path/to/account/page.aspx';
	const content = `Text before link <a href="${testUrl}">View/Edit Application</a> . Text after link`;

	it('should extract the URL that links the user to their application', () => {
		const extractor = new ContextUrlExtractor({ content });
		const res = extractor.extractUrls();

		expect(res).to.be.an('array');
		expect(res[0]).to.have.property('url').that.is.a('string').to.equal(testUrl);
		expect(res[0]).to.have.property('contextPre').that.is.a('string').to.equal('Text before link <a href="');
		expect(res[0]).to.have.property('contextPost').that.is.a('string').to.equal('">View/Edit Application</a> . Text after link');
		expect(res[0].url).to.equal(testUrl);
	});

	it('should return shorter context strings when requested', () => {
		const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 15, contextCharsAfter: 11 });
		const res = extractor.extractUrls();

		expect(res[0].contextPre).that.is.a('string').to.equal(' link <a href="');
		expect(res[0].contextPost).that.is.a('string').to.equal('">View/Edit');
	});

	it('should extract multiple URLs from a stringified HTML document', () => {
		const { content, expectedResult } = require('./fixtures/html-doc-with-multiple-hrefs.json');

		const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 20, contextCharsAfter: 20 });
		const res = extractor.extractUrls();

		expect(res).to.be.an('array').to.have.length(3);
		expect(res).to.deep.equal(expectedResult);
	});
	
	it('should extract multiple URLs from a document where all HTML tags apart from anchor tags have been removed', () => {
		const { content, expectedResult } = require('./fixtures/html-doc-with-multiple-hrefs-non-a-tags-removed.json');
		
		const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 20, contextCharsAfter: 20 });
		const res = extractor.extractUrls();
		
		expect(res).to.be.an('array').to.have.length(3);
		expect(res).to.deep.equal(expectedResult);
	});
	
	it('should extract multiple URLs from a document where all HTML tags have been removed', () => {
		const { content, expectedResult } = require('./fixtures/html-doc-with-multiple-hrefs-all-html-tags-removed.json');
		
		const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 20, contextCharsAfter: 20 });
		const res = extractor.extractUrls();
		
		expect(res).to.be.an('array').to.have.length(3);
		expect(res).to.deep.equal(expectedResult);
	});

});
