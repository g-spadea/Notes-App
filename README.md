# Notes App

**Notes App** is a modern note-taking application built with **SvelteKit**. It leverages **Server-Side Rendering (SSR)** for improved performance and SEO. The app integrates **Firebase** for authentication and **Firestore** for data storage, ensuring a seamless and secure user experience.

## Features


- **Server-Side Rendering (SSR)** 🌐: Enhances performance and SEO.
- **Firebase Authentication** 🔒: Secure and reliable user authentication.
- **Firestore Integration** 🔄: Real-time data storage and synchronization.
- **Offline Capability** 📶: Access and use the app even without an internet connection.
- **Progressive Web App (PWA)** 📱: Installable on your device for a native app-like experience.
- **Responsive Design** 💻📱: Optimized for both desktop and mobile devices.

## Technologies Used

- **SvelteKit** 🚀: Framework for building fast, modern web applications.
- **Svelte 5** 🌟: Utilized for its latest features and improvements.
- **Firebase** 🔥: Authentication and Firestore for backend services.

## Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/g-spadea/Notes-App.git
    cd notes-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Set up Firebase**:
    - Create a Firebase project.
    - Enable Firestore and Authentication.
    - Add your Firebase and Firebase Admin configuration to the project in a .env file at root of the project. (Refer to the example)

4. **Run the application**:
    ```bash
    npm run dev
    
    or
    
    DEBUG="app:*" npm run dev # using for check auth state
    ```

You can preview the production build with `npm run preview`.

### License

This project is licensed under the MIT License.
