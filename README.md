# context-url-extractor

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Methods for extracting URLs from HTML or text strings with surrounding context

When data mining content that contains URLs, it's far easier for a machine to categorise them if they are semantic (or friendly) URLs:

### Bad URL

 - http://example.com?country=19&province=2

### Good URL

 - http://example.com/americas/canada/quebec

This package provides a jumping off point for data mining the surrounding context of each URL found in the supplied content.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```javascript
npm install --save context-url-extractor
```

## Usage

```javascript
const extractor = new ContextUrlExtractor({ content });
const res = extractor.extractUrls();
```
### Custom Context Lengths

The default pre and post context string lengths are set to 170 characters, but this can be overridden in the constructor.

```javascript
const extractor = new ContextUrlExtractor({ content, contextCharsBefore: 80, contextCharsAfter: 80 });
```
### Example Response
```javascript
[
	{
		"url": "https://example.com/profile.aspx?section=99&trId=9877A4CF44987123AED90&rd=722108935",
		"contextPre": "nd. To log in to your profile please <a href=\"",
		"contextPost": "\">click here</a> and sign in with your email "
	}
]
```

## Maintainers

[@njhoran](https://github.com/njhoran)

## Contributing

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2019 njhoran
