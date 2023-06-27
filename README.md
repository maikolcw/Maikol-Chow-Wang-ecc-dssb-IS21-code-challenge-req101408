How to start:

    cd into server folder
    npm install
    npm start
    cd into client folder
    npm install
    npm start

Frontend uses modern javascript framework Reactjs. Code is organized into components. Modules used are Axios for REST requests and Tailwindcss for css styling. Frontend hosted on localhost:4000.

Backend uses Express for API route development. 

As per requirements:

    Backend database uses local memory storage
    Backend hosted at localhost:3000
    Backend routes originate from localhost:3000/api
    Frontend consumes backend created API routes
    User is greeted with table list of products
    User can create a product
    User can edit a product
    Changes are responsive on the UI
    All info fits on the screen at different window sizes
    Validations are present when creating and editing a product
    API Health check at http://localhost:3000/api/
    Backend has POST, PUT, DELETE, and GET routes
    Up to 5 developers per project
    UUID generation is unique on project creation
    Initial 40 sample data generated adheres to product attributes
    Attributes of product adheres to requirements listed below
    Amongst other requirements

Product object adheres to these attributes:

    productId: VALUE
    productName: VALUE
    productOwnerName: VALUE
    Developers: ["NAME_1", "NAME_2", "NAME_3", "NAME_4", "NAME_5"]
    scrumMasterName: VALUE
    startDate: "YYYY/MM/DD"
    methodology: VALUE
    location: "https://github.com/bcgov/{repository}"
