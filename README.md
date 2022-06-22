<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp">
    <img src="https://lh3.googleusercontent.com/d/13oL_tdqAFzcRVAPIk0lWpAuGZQ1Dmj4d" alt="Logo" width="400px">
  </a>

  <h3 align="center">Blanja : Backend E-Commerce</h3>

  <p align="center">
    Create a Node.js app for building e-commerce RESTful APIs using Express.
    <br />
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="blanja-app.herokuapp.com/">View Web Service</a>
    ·
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp/issues">Report Bug</a>
    ·
    <a href="https://github.com/Derana-id/RESTFull_API_BlanjaApp/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#setup-env-example">Setup .env example</a></li>
      </ul>
    </li>
    <li><a href="#rest-api">REST API</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#related-project">Related Project</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

Create a Node.js app for building e-commerce RESTful APIs using Express.

### Built With
This app was built with some technologies below:
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/about/)
- [Socket.io](https://socket.io/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- and other

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [Node.js](https://nodejs.org/en/download/)

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
- Type ` npm run dev` To Start Development
- Type ` npm run start` To Start Production

<p align="right">(<a href="#top">back to top</a>)</p>

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
DRIVE_REFRESH_TOKEN = [DRIVE_REFRESH_TOKEN]

# midtrans
MT_PRODUCTION = [MIDTRANS_PRODUCTION]
MT_CLIENT_KEY = [MIDTRANS_CLIENT_KEY]
MT_SERVER_KEY = [MIDTRANS_SERVER_KEY]
```

<p align="right">(<a href="#top">back to top</a>)</p>

## REST API

You can view my Postman collection [here](https://www.postman.com/warped-shadow-374852/workspace/e-commerce/overview)
</br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20204010-9bbf1514-fc7c-4c49-b41b-678b052dea35?action=collection%2Ffork&collection-url=entityId%3D20204010-9bbf1514-fc7c-4c49-b41b-678b052dea35%26entityType%3Dcollection%26workspaceId%3D2d0c24df-fbb7-405f-93af-c4ef984f8428)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Related Project
:rocket: [`Backend Blanja`](https://github.com/Derana-id/RESTFull_API_BlanjaApp)

:rocket: [`Frontend Blanja`](https://github.com/Derana-id/Front-End-BelanjaApp)

:rocket: [`Frontend Blanja Admin`](https://github.com/Derana-id/Front-End-Admin)

:rocket: [`Web Service`](blanja-app.herokuapp.com/)

:rocket: [`Demo Blanja`](https://bit.ly/blanja-app/)

:rocket: [`Demo Blanja Admin`](https://blanja-admin.vercel.app/)

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
