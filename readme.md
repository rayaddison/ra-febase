#Getting started

###Pre-requisites

*Advise using RVM to manage Ruby*  
Ensure the following are installed;

* Node - use npm to manage: https://www.npmjs.com
* Sass - http://sass-lang.com
* Grunt - http://gruntjs.com
* Susy 2 - http://susydocs.oddbird.net
* Bower - http://bower.io

###Dependancies

Install all project specific dependancies by running;

````
$npm install
````

````
$bower install
````


###Grunt

````
$grunt
````

All being well you should see the terminal ...waiting on the watch command

###Tasks

* Shell - run terminal commands from grunt task. Remote update included.
* Concat - combine all js files on the fly
* Uglify - minify your concatinated js file on the fly
* Imagemin - minify all your projects JPG/PNG/GIF files on the fly
* SVGmin - minify all your projects SVG files on the fly
* Sass - generate your minified css files from scss files on the fly

###Customise

Change paths for input / output files in the gruntfile.js then re-run grunt

###Susy grids

Default grid of 24 columns with 0.5 gutter (layouts/_framework.scss)  
Secondary guuterless grid available: $gutterless__grid

###Grunt Markdown

Used to create the base html files for projects including styleguide

###Styleguide

Uses grunt markdown to generate the necessary files

####Palette

Palette colours and variable arrays are editble in _variables.scss

###FAVICONS

Generate your favicons here: [http://realfavicongenerator.net](http://realfavicongenerator.net)

###JS Libraries

#jQuery 1.9.1

Included in md pages from Google APIs, fallback to local copy.

####Production JS

/web/assets/js/production.min.js

* onmediaquery - used to add after content tag to body
* retina.js - if there's an @2x version , use it
* respond.js - For IE8 media queries (required to show above break__0)
* Modernizer - target browsers using html tag css classes based on support offered

