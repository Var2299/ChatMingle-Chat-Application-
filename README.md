# ChatMingle

ChatMingle is a real-time chat application designed to facilitate seamless communication between users. It supports multiple users and provides a dynamic and interactive chat experience. The application has been developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack, and it integrates smoothly with both Windows and Ubuntu (Linux) systems.

Windows:-

![image](https://github.com/user-attachments/assets/7d6dfb77-6d4d-47c0-96cf-cd36e30d35b4)
![image](https://github.com/user-attachments/assets/567376eb-3c8b-4988-a86c-70bffd88c5a9)
![mongo](https://github.com/user-attachments/assets/63426f43-1198-48f7-9db7-3d0f98ff8f7e)

Ubuntu(Linux):-
![33](https://github.com/user-attachments/assets/187bd41f-962e-4888-8386-3cb520869edd)
![Screenshot from 2024-07-16 16-11-29](https://github.com/user-attachments/assets/28413352-c402-40c0-ab01-dde3f7fb0dd2)
![Screenshot from 2024-07-16 16-12-05](https://github.com/user-attachments/assets/e50ebb49-573f-48ce-aace-02a32fec49ae)



## Features

- **Real-time Messaging:** Users can send and receive messages in real-time.
- **User Authentication:** Secure login and registration system.
- **Multiple Chat Rooms:** Users can join different chat rooms and converse simultaneously.
- **Responsive Design:** Works seamlessly on both desktop and mobile devices.
- **Persistent Chat History:** Chat history is stored in MongoDB, ensuring that users can access past messages.
- **Notification System:** Users receive notifications for new messages.

## Technologies Used

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Version Control:** Git and GitHub
- **Operating Systems:** Windows, Ubuntu (Linux)

## Installation Steps

### Windows

1. **Install Necessary Software:**
    ```bash
    - Node.js and npm: Download and install from [Node.js official website](https://nodejs.org/).
    - Git: Download and install from [Git official website](https://git-scm.com/).
    - MongoDB: Download and install from [MongoDB official website](https://www.mongodb.com/try/download/community).
    ```

2. **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

3. **Install Project Dependencies:**
    ```bash
    npm install
    ```

4. **Configure Environment Variables:**
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```dotenv
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/chatmingle
        ```

5. **Start MongoDB Service:**
    - Ensure MongoDB is running. Start it using MongoDB Compass or via command line:
        ```bash
        mongod
        ```

6. **Run Your Project:**
    ```bash
    npm start
    ```

7. **Check if the Application is Running:**
    - Open your browser and navigate to `http://localhost:3000`.

### Ubuntu

1. **Install Necessary Software:**
    ```bash
    sudo apt update
    sudo apt install nodejs npm -y
    sudo apt install git -y
    ```
    - Follow the official MongoDB installation guide for Ubuntu.

2. **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

3. **Install Project Dependencies:**
    ```bash
    npm install
    ```

4. **Configure Environment Variables:**
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```dotenv
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/chatmingle
        ```

5. **Start MongoDB Service:**
    ```bash
    sudo systemctl start mongod
    sudo systemctl enable mongod
    ```

6. **Run Your Project:**
    ```bash
    npm start
    ```

7. **Check if the Application is Running:**
    - Open your browser and navigate to `http://localhost:3000`.

## Conclusion

By integrating Ubuntu (Linux) system capabilities, ChatMingle demonstrates cross-platform compatibility and robust real-time communication features. The project showcases your proficiency in using the MERN stack and managing Linux systems, adding significant value to your resume for software development internships.
