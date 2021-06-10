# Changelog

## 1.0.4 (10.06.2021)

Fixed several security vulnerabilities:

- [Use of a Broken or Risky Cryptographic Algorithm](https://github.com/advisories/GHSA-r9p9-mrjm-926w) in [elliptic](https://github.com/indutny/elliptic). Updated from 6.5.3 to 6.5.4.

- [Regular Expression Denial of Service](https://github.com/advisories/GHSA-43f8-2h32-f4cj) in [hosted-git-info](https://github.com/npm/hosted-git-info). Updated from 2.8.8 to 2.8.9.

- [Command Injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) in [lodash](https://github.com/lodash/lodash). Updated from 4.17.20 to 4.17.21.

- and others.


## 1.0.3 (05.02.2021)

* Replaced `findFreePort` helper with
  [@funboxteam/free-port-finder](https://github.com/funbox/free-port-finder).
* Replaced `colorize` and `formatBytes` helpers with self-titled helpers from
  [@funboxteam/diamonds](https://github.com/funbox/diamonds).
* Fixed symbols order in `log` helper.

## 1.0.2 (16.10.2020)

* Added LICENSE file.
* Updated the deps.

## 1.0.1 (06.06.2019)

* Fixed an error in the exception handler.

## 1.0.0 (26.04.2019)

* Init version.
