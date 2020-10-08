# @funboxteam/languagetool-node

[![npm](https://img.shields.io/npm/v/@funboxteam/languagetool-node.svg)](https://www.npmjs.com/package/@funboxteam/languagetool-node)

Консольная утилита для проверки грамматики и орфографии с помощью локального сервиса
[LanguageTool](https://github.com/languagetool-org/languagetool).

## Мотивация

Порой репозитории с проектами содержат большое количество файлов с документацией.
Однажды мы решили начать проверять грамматику и орфографию в таких файлах. Но отправлять наши доки
на неизвестные сервера всем известных сервисов не очень хотелось.

Потому мы решили сделать свой консольный инструмент поверх LanguageTool. 

## Установка

LanguageTool для работы нужна Java, потому сперва нужно пойти на [java.com](https://www.java.com) и скачать её.

А затем установить сам пакет:

```bash
npm i -g @funboxteam/languagetool-node
```

Лучше всего устанавливать его глобально, потому что в процессе скачается архив с LanguageTool (≈250 МБ)
и распакуется в директорию с пакетом.

## Использование

Утилита умеет проверять переданные файлы или текст из STDIN.

Проверить файлы:

```bash
languagetool-node README.md CHANGELOG.md
```

Проверить файлы с конкретными расширениями в указанных директориях:

```bash
languagetool-node ~/project1/**/*.txt ~/project2/*.md
```

Проверить текст из STDIN:

```bash
echo "Вставьте ваш текст сюда .. или проверьте этот текстт. Релиз LanguageTool 4.0 состоялся в четверг 29 декабря 2017 года." | languagetool-node
```

<details>
  <summary>Пример вывода</summary>
  
  ```bash
  $ echo "Вставьте ваш текст сюда .. или проверьте этот текстт. Релиз LanguageTool 4.0 состоялся в четверг 29 декабря 2017 года." | languagetool-node

  <stdin>
    1:25  warning  Две точки подряд                                             typographical  spell
  Context: «Вставьте ваш текст сюда .. или проверьте этот текстт. Релиз Langua...»
  Possible replacements: «.»
  
    1:28  warning  Это предложение не начинается с заглавной буквы              typographical  spell
  Context: «Вставьте ваш текст сюда .. или проверьте этот текстт. Релиз LanguageTo...»
  Possible replacements: «Или»
  
    1:47  warning  Найдена орфографическая ошибка                               misspelling    spell
  Context: «...те ваш текст сюда .. или проверьте этот текстт. Релиз LanguageTool 4.0 состоялся в чет...»
  Possible replacements: «текст, текста, тексте, тексту, тексты, текс тт, текст т»
  
    1:90  warning  Днём недели 29 декабря 2017 является не четверг, а пятница.  uncategorized  spell
  Context: «...стт. Релиз LanguageTool 4.0 состоялся в четверг 29 декабря 2017 года. »
  
  ⚠ 4 warnings
  ```
</details>

## Внешний конфигурационный файл

Если нужно, можно перезаписать настройки по умолчанию, создав файл `~/.languagetoolrc.js`.
Его содержимое будет слито со стандартным конфигом.

Пример внешнего конфига:

```javascript
module.exports = {
  // белый список (поддерживает регулярные выражения)
  ignore: [
    'фронт(е|э)нд'
  ],
};
```

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
