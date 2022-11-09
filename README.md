# Instascrape
Instascrape is a web scrapping app that returns an Instagram user’s following/follower count, post count, bio, username, and profile picture.

https://user-images.githubusercontent.com/89381034/200910415-04ba003d-474b-46fc-b0c6-9fcf5df613d4.mp4

## Technologies used
- Node.js
- Puppeteer
- Google Sheets
- Google Cloud Platform

## Instructions
- Download or clone this repository
- Run npm install to install the libraries
- Add your username/password in credentials.js or set them as environment variables
- Connect Google Sheets to Node.js. [Here's](https://www.youtube.com/watch?v=PFJNJQCU_lo&ab_channel=JamesGrimshaw) a tutorial video that explains this process step-by-step.
- In the first column of the sheet, enter the usernames of the Instagram profiles to visit. In the second sheet, create a new row and enter the information you want to scrape for (i.e. followers, following, bio, etc). 
- Run node index.js to execute the program
