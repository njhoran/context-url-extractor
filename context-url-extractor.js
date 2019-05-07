'use strict';

const getHrefs = require('get-hrefs');
const regexEscape = require('regex-escape');
const urlRegex = require('url-regex');

const DEFAULT_CONTEXT_CHARS = 170;

const GET_HREFS_OPTIONS = {
	sortQueryParameters : false,
	defaultProtocol     : 'https'
};

const URL_REGEX_OPTIONS = { strict: false };

class UrlExtractor {
	constructor ({ content, contextCharsBefore = DEFAULT_CONTEXT_CHARS, contextCharsAfter = DEFAULT_CONTEXT_CHARS }) {
		this.content            = this._clean(content);
		this.contextCharsBefore = contextCharsBefore;
		this.contextCharsAfter  = contextCharsAfter;
	}

	extractUrls () {
		// first extraction attempt
		const extractedUrls = getHrefs(this.content, GET_HREFS_OPTIONS)
			.map(url => this._handleUrlContext(url))
			.filter(context => !!context);
	
		if (extractedUrls.length) return extractedUrls;
		
		// second extraction attempt
		const regexUrls = this.content.match(urlRegex(URL_REGEX_OPTIONS));
		
		if (!regexUrls) return;
	
		return regexUrls
			.map(url => this._handleUrlContext(url))
			.map(context => this._applyDefaultProtocol(context, GET_HREFS_OPTIONS.defaultProtocol))
			.filter(context => !!context);
	}

	_handleUrlContext (url) {
		const urlContext = this._fetchContext(this._createRegex(url)) || [];
		
		if (urlContext.length === 1) return false;
		
		return {
			url,
			contextPre  : urlContext[0] ? urlContext[0].slice(-Math.abs(this.contextCharsBefore)) : '',
			contextPost : urlContext.pop().slice(0, Math.abs(this.contextCharsAfter))
		};
	}

	_applyDefaultProtocol (context, defaultProtocol) {
		switch (true) {
			case /^:\/{2}/.test(context.url):
				return Object.assign({}, context, { url: `${defaultProtocol}${context.url}` });
			case /^\/{2}/.test(context.url):
				return Object.assign({}, context, { url: `${defaultProtocol}:${context.url}` });
			case /^(?!http)/.test(context.url):
				return Object.assign({}, context, { url: `${defaultProtocol}://${context.url}` });
			default:
				return context;
		}
	}
	
	_clean (content) {
		return content.replace(/&amp;/g, '&');
	}

	_fetchContext (contextRegex) {
		return this.content.split(contextRegex);
	}

	_createRegex (url) {
		return new RegExp(regexEscape(url));
	}
}

module.exports = UrlExtractor;
