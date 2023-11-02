[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=12397373&assignment_repo_type=AssignmentRepo)

## Back-end Development Year 1
---

# Application Installation and Usage Instructions
### This guide provides step-by-step instructions on how to set up and run the MyTodo application. Follow these steps to get it up and running on your local machine for development and testing purposes.

### Prerequisites
- Before you begin, ensure you have met the following requirements:
- You have installed Node.js and npm (Node Package Manager). You can verify their installation using node -v and npm -v in your terminal.
You have a MySQL server running and have the necessary credentials.

### Installation
Follow these steps to set up the MyTodo application:

1. Clone the Repository
Start by cloning the project repository to your local machine. You can do this by running:
```ini
git clone <https://github.com/noroff-backend-1/jan23ft-api-ca-mariaemiliekj.git>
```
Or download the zip file.

2. Install Dependencies
Navigate to the project directory in your terminal and run the following command to install the necessary dependencies:
```ini
npm install
```
This command installs all the required packages, including dotenv, express, jest, jsend, jsonwebtoken, mysql, mysql2, sequelize, and supertest.

3. Set Up the Database
Create a new database in your MySQL server named myTodo.

4. Configure Environment Variables
Create a .env file in the root directory of the project. This file will store configuration settings and sensitive information. Add the required environment variables and their values as shown in the .env example section. Be sure to replace the placeholders with your actual MySQL credentials and preferred settings.

5. Database Seeding (Optional)
You can seed the database using the provided seeding script (for statuses)

### Running the Application
Once you have completed the installation process, you're ready to start the server. Run the following command in the project directory:
```ini
npm start
```
This command starts the application. You can now access the server at http://localhost:3000.

### Testing
To ensure that the installation was successful and the application is running as expected, you can execute the automated tests. Run the following command:
```ini
npm test
```


# Environment Variables

The following environment variables are required for the application to run properly. They can be set in a `.env` file in the root directory of the project.

```ini
# .env example
HOST="localhost"                 //or the domain/IP where your server is hosted
PORT="3000"                      //The port your server should listen on
DATABASE_NAME="my_database_name" //The name of your database
DIALECT="mysql"                  //The type of SQL database you are using
ADMIN_USERNAME="admin_username"  //The username for an admin user
ADMIN_PASSWORD="secure_admin_password"  // The password for an admin user
TOKEN_SECRET="your_secret_key_for_encoding_tokens"  // Secret key for JWT or other encoding methods

# Test User (optional, for testing environments only)
TEST_NAME="test_user"            // Name used in tests
TEST_USERNAME="test_username"    // Username used in tests
TEST_PASSWORD="test_password"    // Password used in tests
```
# Additional Libraries/Packages
No additional libraries or packages are nessecary, just use npm install.

# NodeJS Version Used
For this project, version v18.16.0 of NodeJs was used. Ensure you have this version or later for compatibility.

# Swagger Documentation
http://localhost:3000/doc 

Be sure the project is up and running before entering the link. (npm start)





