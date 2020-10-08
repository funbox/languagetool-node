# @funboxteam/languagetool-node

[![npm](https://img.shields.io/npm/v/@funboxteam/languagetool-node.svg)](https://www.npmjs.com/package/@funboxteam/languagetool-node)

CLI spell and grammar checker. 
Uses [LanguageTool](https://github.com/languagetool-org/languagetool) under the hood.

[По-русски](./README.ru.md)

## Rationale

Some projects have a lot of documentation inside the repos. Once we decided to start linting their
grammar and check for spelling errors. But we didn't want to send our docs 
to the unknown servers of the well-known services. 

Hence, we decided to build our own CLI tool upon the LanguageTool.   

## Getting Started

LanguageTool requires Java to work, so first of all go to [java.com](https://www.java.com) and download it. 

Then install the package:

```bash
npm i -g @funboxteam/languagetool-node
```

It's recommended to install the package globally, because archive with LanguageTool will be downloaded
(≈250 MB) and unzipped it into the package directory. 

## Usage

The tool can check the passed files or the text from STDIN. 

Check files:

```bash
languagetool-node README.md CHANGELOG.md
```

Check files defined using globs:

```bash
languagetool-node ~/project1/**/*.txt ~/project2/*.md
```

Check the text from STDIN:

```bash
echo "Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017." | languagetool-node
```

<details>
  <summary>Output example</summary>
  
  ```bash
  $ echo "Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017." | languagetool-node

  <stdin>
    1:23  warning  Two consecutive dots                                        typographical  spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 w...»
  Possible replacements: «.»
  
    1:26  warning  This sentence does not start with an uppercase letter       typographical  spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 were...»
  Possible replacements: «Or»
  
    1:40  warning  Possible spelling mistake found                             misspelling    spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thurs...»
  Possible replacements: «text, texts, text t»
  
    1:69  warning  Possible spelling mistake found                             misspelling    spell
  Context: «...check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017. »
  Possible replacements: «released, release»
  
    1:80  warning  The date 29 december 2017 is not a Thursday, but a Friday.  inconsistency  spell
  Context: «...textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017. »
  
  ⚠ 5 warnings
  ```
</details>

## External configuration file

It's possible to override default options by creating file `~/.languagetoolrc.js`.
It will be merged with default config.

Example of external config:

```javascript
module.exports = {
  // allowed words (regexps are supported)
  ignore: [
    '(T|O)TF',
  ],
};
```

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
