<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

# Pokéteam

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#screenshots">Screenshots</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

- Web application initially made for CMSC335 Final Project.
- Users can select 6 pokémons for their team and save the team as an image. Each user's team is stored in a database. Users can view all submissions in the archive and view individual pokémon info.
- The application can be viewed at https://www.poketeam.tk/.

### Built With

- [![MongoDB][mongodb]][mongodb-url]
- [![Express.js][express.js]][express.js-url]
- [![EJS][ejs]][ejs-url]
- [![Node.js][node.js]][node.js-url]
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Screenshots

![www poketeam tk_](https://user-images.githubusercontent.com/57494592/208791891-897c2e7a-33b5-4275-83b6-b31f0e8ce6c3.png)
![www poketeam tk_create](https://user-images.githubusercontent.com/57494592/208797068-cec889ab-2896-4a77-8c29-e5d9d043903f.png)
![www poketeam tk_archive__page=1](https://user-images.githubusercontent.com/57494592/208796701-f17096d6-2226-4f03-8f60-500676518110.png)
![www poketeam tk_view](https://user-images.githubusercontent.com/57494592/208796767-7b4a15cf-50b6-467d-ab03-c7dacd630b29.png)
![www poketeam tk_pokemon_xerneas](https://user-images.githubusercontent.com/57494592/208796881-a3f2bb48-6b17-4a6f-b434-afd7c1acbb83.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/picklejason/poketeam.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create and set `.env` variables
   ```
   MONGO_DB_URI = "mongodb_uri"
   MONGO_DB_NAME = "db_name"
   MONGO_COLLECTION = "collection"
   ```

## Usage

In order to run the app, run its app.js file:

```
node app.js
```

Then, open http://localhost:3000 in a browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

Jason Chen - jasonchen0429@gmail.com

Project Link: [https://github.com/picklejason/poketeam](https://github.com/picklejason/poketeam)

## Acknowledgments

- [PokéAPI](https://pokeapi.co/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- MARKDOWN LINKS & IMAGES -->

[license-shield]: https://img.shields.io/github/license/picklejason/poketeam.svg?style=for-the-badge
[license-url]: https://github.com/picklejason/poketeam/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/picklejason/
[mongodb]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://www.mongodb.com/
[express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express.js-url]: https://expressjs.com/
[ejs]: https://img.shields.io/badge/-EJS-B4CA65?style=for-the-badge
[ejs-url]: https://ejs.co/
[node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[node.js-url]: https://nodejs.org/en/
