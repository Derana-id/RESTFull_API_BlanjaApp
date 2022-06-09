<br />
<p align="center">
<div align="center">
  <img height="150" src=""/>
</div>
  <h3 align="center">Blanja : Backend E-Commerce</h3>
  <p align="center">
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp"><strong>Explore the docs »</strong></a>
    <br /><br />
    <a href="#">View Demo</a>
    ·
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp/issues">Report Bug</a>
    ·
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env example](#setup-env-example)
- [REST API](#rest-api)
- [Contributing](#contributing)
- [Related Project](#related-project)
- [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

-

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer]('https://nodemailer.com/about/')
- [Socket.io]()
- [Sequelize]()
- [PostgreSQL]()
- and other

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [nodejs](https://nodejs.org/en/download/)

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](./blanja.sql)

### Installation

- Clone the Repo
```
git clone https://github.com/Derana-id/RESTFull_API_BlanjaApp.git
```
- Go To Folder Repo
```
cd RESTFull_API_BlanjaApp
```
- Install Module
```
npm install
```
- Make a new database and import [blanja.sql](./blanja.sql)
- <a href="#setup-env-example">Setup .env</a>
- Starting application
```
npm run serve
```

### Setup .env example

Create .env file in your root project folder.

```env

# app
APP_NAME = [APP_NAME]
NODE_ENV = [NODE_ENV]
PORT = [APPLICATION_PORT]
API_URL = [BACKEND_URL]
APP_CLIENT = [FRONTEND_URL]

# database
DB_HOST = [DB_HOST]
DB_USER = [DB_USER]
DB_PASSWORD = [DB_PASSWORD]
DB_NAME = [DB_NAME]
DB_PORT = [DB_PORT]
DB_DIALECT = [DB_DIALECT]

# jwt
JWT_SECRET = [JWT_SECRET]
JWT_EXPIRED = [JWT_EXPIRED]

# google
EMAIL_FROM = [EMAIL_FROM]
EMAIL_USER = [EMAIL_USER]
GOOGLE_CLIENT_ID = [GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET = [GOOGLE_CLIENT_SECRET]
REDIRECT_URI = [REDIRECT_URI]
GMAIL_REFRESH_TOKEN = [GMAIL_REFRESH_TOKEN]

```

## REST API

You can view my Postman collection [here]()
</br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3b5e01421434a5ef05ae?action=collection%2Fimport)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Related Project
:rocket: [`Backend Blanja`](https://github.com/aryairama/arkademy-express-TokoKu)

:rocket: [`Frontend Blanja`](https://github.com/aryairama/arkademy-react-TokoKu)

:rocket: [`Demo Blanja`]()

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributors
<center>
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/altrawan">
          <img width="100" src="https://avatars.githubusercontent.com/u/39686865?v=4" alt="Nur Muhammad Alif Putra Setiawan"><br/>
          <sub><b>Nur Muhammad Alif Putra Setiawan</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/rifanhidayatulloh">
          <img width="100" src="https://avatars.githubusercontent.com/u/87940197?v=4" alt="Rif'an Hidayatulloh"><br/>
          <sub><b>Rif'an Hidayatulloh</b></sub>
        </a>
      </td>
    </tr>
  </table>
</center>

<p align="right">(<a href="#top">back to top</a>)</p>

## License
Distributed under the [MIT](/LICENSE) License.

<p align="right">(<a href="#top">back to top</a>)</p>




