

# Better Canvas (Student Portal) - AI Chatbot

A modern, user-friendly student portal application built with Vue.js, providing a cleaner alternative to traditional learning management systems.

## 🚀 Features

- **Secure Authentication** - AWS Cognito integration for robust user authentication
- **Interactive Chat Interface** - Real-time chat with typing indicators and animated responses
- **User Profile Management** - View and update personal information
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Modern UI/UX** - Clean, intuitive interface built with Vue 3

## 🛠️ Technologies

- **Frontend Framework**: Vue 3
- **State Management**: Pinia
- **Routing**: Vue Router
- **Authentication**: AWS Amplify & Cognito
- **API Communication**: Axios
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v14 or later)
- npm or yarn
- AWS Account (for Cognito user authentication)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/michalispap/Frontend-App.git
   cd Frontend-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create or update the `.env` file with your AWS Cognito settings:
   ```
   VITE_USER_POOL_ID=<user_pool_id>
   VITE_USER_POOL_CLIENT_ID=<user_pool_client_id>
   VITE_COGNITO_DOMAIN=<cognito_domain>
   VITE_REDIRECT_SIGNIN=https://your-app-domain.com/
   VITE_REDIRECT_SIGNOUT=https://your-app-domain.com/
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000` (May need extra configurations to work properly)

## ⚙️ AWS Cognito Configuration

1. **Create a User Pool in AWS Cognito**
   - Set up a new user pool with email as the primary authentication method
   - Configure password policies and MFA as needed

2. **Create an App Client**
   - Create a new app client (no client secret)
   - Configure the callback URL to match your application domain
   - Enable Authorization code grant flow
   - Add OAuth scopes: email, profile, openid

3. **Configure Domain Name**
   - Set up a Cognito domain for the hosted UI

4. **Update the App Configuration**
   - Update the AWS Amplify configuration in main.js with your Cognito details

## 📦 Build for Production

```bash
npm run build
```

This will create a dist directory with the compiled assets ready for deployment.

## 🚢 Deployment with AWS Amplify

1. **Set up AWS Amplify**
   - Connect your repository to AWS Amplify
   - Configure build settings

2. **Configure Custom Headers**
   ```yaml
   customHeaders:
     - pattern: "**/*"
       headers:
         - key: Content-Security-Policy
           value: <custom_headers>
   ```

3. **Configure Rewrites**
   ```yaml
   rewrites:
     - source: "/*"
       target: "/index.html"
       status: "200"
   ```

4. **Environment Variables**
   Add these variables to your Amplify build settings:
   ```
   NODE_OPTIONS=--max-old-space-size=4096
   VITE_BASE_URL=https://your-app-domain.com
   ```

## 📁 Project Structure (Subject to change)

```
better-canvas/
├── public/              # Static files
├── src/
│   ├── components/      # Vue components
│   │   └── Navbar.vue
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── services/        # API and other services
│   │   └── api.js
│   ├── stores/          # Pinia stores
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── user.js
│   ├── views/           # Page components
│   │   ├── Chat.vue
│   │   ├── Login.vue
│   │   └── Profile.vue
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── .browserslistrc      # Supported browsers
├── .gitignore
├── index.html           # HTML template
├── jsconfig.json        # JavaScript configuration
├── package.json         # Dependencies
├── README.md
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the 🇬🇷 team
