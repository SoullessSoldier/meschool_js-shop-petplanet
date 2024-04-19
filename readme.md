## MethEdSchool - Интенсив - Лендинг интернет-магазина PetPlanet

На интенсиве ты:\
🔸создашь посадочную страницу для магазина PetShop с использованием SCSS и с учетом доступности (Accessibility);\
🔸реализуешь адаптивный дизайн под различные устройства;\
🔸проведешь оптимизацию файлов и изображений для улучшения производительности и скорости загрузки страницы;\
🔸узнаешь методы создания стилей с использованием SCSS.

Для сборки и оптимизации проекта  воспользуешься инструментом Vite и npm пакетами. А проект будет структурирован таким образом, чтобы его можно было дополнять и развивать дальше. Это особенно актуально для будущего создания интернет-магазина.

Запуск:
```
cd app
npm i
npm run dev
```


### Day 1
Начинаем проект / HTML
```
npm create vite@latest
```

создан минимальный vite.config.js, все исходники перенесены в /src

Ссылки:

[Типограф](https://www.artlebedev.ru/typograf/)


### Day 2
SCSS - Normalize, Default, Fonts
```
npm i -D sass
npm i normalize.css
```

Шрифты в *public*. Предзагрузка шрифтов через тег *link*

Плагин VS Code eCSStractor\
Setting:
```json
"ecsstractor_port.attributes": "class"
"ecsstractor_port.bem_nesting": true
"ecsstractor_port.comment_style": "scss"
```
Полезные ссылки:\
[normalize.css](https://necolas.github.io/normalize.css/)

[default max css](https://codepen.io/Quper/pen/GRRZzWy)

[google-webfonts-helper](https://gwfh.mranftl.com/fonts)


### Day 3
Стили + адаптив

Полезные ссылки:\
[https://tinypng.com/](https://tinypng.com/)

[https://squoosh.app/](https://squoosh.app/)


### Day 4
Оптимизация\
Адаптив под большие экраны (доделать)

```
npm i -D vite-plugin-image-optimizer
npm i -D sharp
npm i -D svgo
```
Поправили конфиг этого плагина в vite.config.js, при сборке изображения уменьшаются.

Вручную изображения оптимизируются через [squash.io](https://squoosh.app/),\
либо вручную через js-библиотеку **sharp**

Использование свойства background-image: image-set для прописки изображений разного\
(или одного) формата - для DPR 2.0 (Retina-дисплей) 
```css
/** сверху всегда самый оптимальный вариант */
background-image: image-set(
      url("/assets/img/dog.avif") type("image/avif") 1x,
      url("/assets/img/dog@2x.avif") type("image/avif") 2x,
      url("/assets/img/dog.webp") type("image/webp") 1x,
      url("/assets/img/dog@2x.webp") type("image/webp") 2x,
      url("/assets/img/dog.png") type("image/png") 1x,
      url("/assets/img/dog@2x.png") type("image/png") 2x
    );
```

Тест производительности - Litehouse в Dev tools,\
запускать не на "npm run dev"-режиме (в preview) и в режиме инкогнито.


Ссылки из урока\
[https://www.npmjs.com/package/vite-plugin-image-optimizer](https://www.npmjs.com/package/vite-plugin-image-optimizer)

