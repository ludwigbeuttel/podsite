# PodSite

a frontend for your Podcast

## On the status of this project

This project is in a pretty early stage. While all features work with most podcast feeds, some might cause issues.

Oh, and it's in German. I'll translate it into English at some point.

## Features

* Litte setup required. Just enter your podcasts information and run two commands. You don't even habe to do any theming (altough you can).
* Integrated audio player
* Extremely resource efficient on your backend
* Internationalization (german and english available)

## How it works

Everytime somebody visits your wesite they download your entire feed and parse it client side.

This is resource efficient on your end (since your users are just downloading the html file and feed) but not exactly optimal for your visitors/listeners.

However, this does make it possible to use a statically generated website that can run without a backend.

## Deployment

### minimal setup

just want to take a look at the application?

1. make sure you have a current version of nodeJS installed
2. Create a file named *.env* in the project's root folder and add "FEEDLOCATION=your_feed_url"
3. Install dependencies using the command **npm install** and start the application in development mode using **npm run serve**

### full setup

Want to use this for your own feed?

1. make sure you have a current version of nodeJS installed
2. rename or duplicate *podcastData.template.ts* and *pages/about.template.vue* and remove the ".template".
3. Enter your podcasts's data in *podcatsData.ts*. Icons from <https://materialdesignicons.com/> are supported and have to be prefixed with "mdi-". Feed free to add or remove values from the array.
4. Create a file named *.env* in the project's root folder and add "FEEDLOCATION=your_feed_url".
5. Add your *favicon.ico* file to the *static* (create the folder if it doesn't exist) folder. This is usually your podcast art.
6. add legal information under *./pages/about.vue*
7. theme your website (optional): Some theming is done automatically (including extracting colors from your podcast art) but you can customnize your theme further using the *vuetify.options.ts* file. For options, visit <https://vuetifyjs.com/en/customization/theme/>
8. Install dependencies using the command **npm install** and start the application in development mode using **npm run serve**
9. Check if your feed loads and your data is correct
10. Run **npm run generate** to generate your very own website
11. copy the website from the *dist* folder to your web server. The website has to be accessible under the same URL as your feed to avoid CORS errors.

## TODO

### short term

✔ podcast search
✔ english translation / internationalization

* better error detection & configuration
* add comments to the code

### long term

* write an optional backend for podcast management
* write an optional backend for pagination so users don't have to download the entire feed on every visit