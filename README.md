# pkg-doc

[![bitHound Overalll Score](https://www.bithound.io/github/AdamLiechty/pkg-doc/badges/score.svg)](https://www.bithound.io/github/AdamLiechty/pkg-doc)


> Generates Markdown documentation of all installed npm modules (and bower components if any) used by your project.

## Sample output
```markdown
# my-app

## Direct Dependencies

### Node

[lodash](#lodash)

## NodeJS modules

### lodash

version 3.10.1 (MIT license)

The modern build of lodash modular utilities.

[Homepage](https://lodash.com/)

#### Dependers

[my-app](#my-app)
```

## Getting Started

1. Install the package

  ```
  npm install -g pkg-doc
  ```

2. Run it

  From your project root:
  ```
  pkg-doc doc/third-party.md
  ```
  or simply
  ```
  pkg-doc
  ```
  This will generate the documentation in a file located at doc/third-party.md
