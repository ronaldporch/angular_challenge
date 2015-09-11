# Angular Challenge

This repository represents an implementation of the MEAN Stack in the structure of a simple user registration and authorization with data persistence within MongoDB and Session/Local Storage.

## How to Use

Fork repository (git clone https://github.com/ronaldporch/angular_challenge)
Install npm dependencies (npm install)
Run MongoDB Server along with Node.js Server (mongod && npm start)

Visit the Register Page from the Navigation Bar
Enter in User Name, Email, and Password. Uses HTML5 Validation for missing fields, backend validation for Unique fields.
Accept the Email Link that is sent to the added Email (Or copy and paste the link in case the HREF Link does not work)
Once at the Login Screen, User's Username will be present in Username field, indicating account has been activated.
Enter in Password, and select rather you want to save login (Would like to have login persist for default 72 hours)
Once logged in, User will see information that would be otherwise hidden to unauthorized users.

## Improvements

Mocha/Chai Testing for Front/Backend (Depended on Postman API Client for Backend Testing)
Front-End formatting for Email (Email Tables are a living nightmare)
Could use something more interesting for Authorized Users
Metadata for Disabled Accessibility