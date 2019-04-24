# @funboxteam/languagetool-node

## Описание

Утилита для проверки грамматики и орфографии с помощью локального сервиса
[LanguageTool](https://github.com/languagetool-org/languagetool).

## Установка

Для работы `languagetool-node` требуется Java, скачать дистрибутив можно на сайте
<https://www.java.com>.

Рекомендуется установить пакет глобально, так как для работы будет скачан архив с LanguageTool
(≈250 МБ) и распакован в директорию с пакетом.

```bash
npm -g i @funboxteam/languagetool-node
```

## Использование

`languagetool-node` может производить проверку файлов, директорий и текста переданного в STDIN.

Проверка нескольких файлов:
```bash
languagetool-node README.md CHANGELOG.md
```

Проверка директории по маске:
```bash
languagetool-node ~/project1/**/*.txt ~/project2/*.md
```

Проверка текста из STDIN:
```bash
echo "Вставьте ваш текст сюда .. или проверьте этот текстт. Релиз LanguageTool 4.0 состоялся в четверг 29 декабря 2017 года." | languagetool-node
```

### Внешний файл конфигурации

Создать в домашней директории пользователя файл с именем `.languagetoolrc.js`.

Пример содержимого файла:
```javascript
module.exports = {
  // Белый список (поддерживает регулярные выражения)
  ignore: [
    'фронт(е|э)нд'
  ],
};
```
