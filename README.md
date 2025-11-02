# Email Reminder Application  

* An email reminder app named Task Ping built with Node.js, Express, MongoDB, and EJS.  
* Easily schedule reminders, get email notifications, and never miss an important event again!

##  Features

- **User Authentication:** Register, login, logout (secure, hashed passwords)
- **Dashboard:** See upcoming reminders and quick actions
- **Reminders CRUD:** Create, view, edit, delete reminders
- **Automated Email Sending:** Background job sends reminders to your email
- **Profile Management:** Update email, change password
- **Responsive UI:** Beautiful, mobile-friendly, and accessible
- **Error Handling:** Friendly error and success pages
- **Security:** Input validation, password hashing, session security
- **Documentation:** Full API docs and deployment guide

## Project Structure

* email-reminder/
│
* ├──* config/ # Database config
* ├──* controllers/ # Route logic (auth, dashboard, profile, reminders)
* ├──* jobs/ # Background jobs (email sending)
* ├──* middleware/ # Auth middleware
* ├──* models/ # Mongoose models (User, Reminder)
* ├──* public/ # Static files (css, images, favicon)
* ├──* routes/ # Express routes
* ├──* services/ # Email service (Nodemailer)
* ├──* views/ # EJS templates (pages, partials)
* │ ├──* auth/
* │ ├──* reminders/
* │ ├──* partials/
* │ └── ...
* ├──* .env # Environment variables (not committed)
* ├──* .gitignore # Files to ignore in git
* ├──* package.json # Dependencies and scripts
* ├──* README.md # This file!
* └──* server.js # App entry point

## Setup & Installation

### 1. **Clone the repo:**

git clone https://github.com/AdedayoWilliams09/taskping-email-reminder.git

cd taskping-email-reminder

2. Install dependencies: npm install

3. Create a .env.example file:

* PORT=3000
* MONGODB_URI=mongodb://localhost:27017/email_reminder
* SESSION_SECRET=your_super_secret_key
* EMAIL_USER=yourgmail@gmail.com
* EMAIL_PASS=your_gmail_app_password 

* EMAIL_USER: Your Gmail address (for sending reminders)
* EMAIL_PASS: <a href="https://support.google.com/accounts/answer/185833?hl=en" target="_blank">Gmail App Password </a> (not your normal password!)

4. Start MongoDB locally (if not running): mongod

5. Run the app: npm run dev

6. Visit in your browser: http://localhost:3000

#### Usage
* Register: Create a new account
* Login: Access your dashboard
* Dashboard: See upcoming reminders, create new ones, search/filter
* Reminders: Create, edit, delete, and view all your reminders
* Profile: Update your email or change your password
* Logout: End your session securely


#### Automated Email Reminders:

* The app uses a background job (node-cron) to check for due reminders every minute.
* When a reminder is due, an email is sent to the specified address.
* Reminder status updates to "sent" after email is delivered.

#### Security & Best Practices:

* Passwords are hashed with bcryptjs
* Sessions are secured with a secret
* All input is validated and sanitized
* No sensitive data is sent to the client
* Environment variables are used for all secrets

#### API Documentation:

* Auth
* Register:
* POST /register
* Body: name, email, password, confirm
* Response: Redirects to /login on success

* Example:
* Register
* POST /register
* Body (x-www-form-urlencoded or JSON):
* name: John Doe
* email: john@example.com
* password: MySecret123
* confirm: MySecret123
* Expected Response: Redirects to /login on success

* Login:
* POST /login
* Body: email, password
* Response: Redirects to /dashboard on success

* Example:
* Login
* POST /login
* Body:
* email: john@example.com
* password: MySecret123
* Expected Response: Redirects to /dashboard on success

* Logout
* GET /logout
* Response: Redirects to /login

* Example:
* Logout
* GET /logout
* Expected Response: Redirects to /login

* Reminders
* List Reminders:
* GET /reminders
* Query: status (optional), q (optional search)
* Response: Renders reminders list

* Example:
* Reminders
* List Reminders
* GET /reminders
* Query Parameters (optional):
* status: upcoming | completed | missed | sent
* q: meeting (search term)
* Example: /reminders?status=upcoming&q=project
* Expected Response: Renders reminders list

* Create Reminder
* GET /reminders/create (form)
* POST /reminders/create
* Body: title, description, dateTime, email, repeat
* Response: Redirects to /reminders on success

* Example:
* Create Reminder
* GET /reminders/create (shows form)
* POST /reminders/create
* Body:
* title: Doctor Appointment
* description: Annual checkup at the clinic
* dateTime: 2024-06-10T14:30 (ISO format or YYYY-MM-DDTHH:mm)
* email: john@example.com
* repeat: none | daily | weekly | monthly | yearly
* Expected Response: Redirects to /reminders on success

* Edit Reminder
* GET /reminders/:id/edit (form)
* POST /reminders/:id/edit
* Body: title, description, dateTime, email, repeat
* Response: Redirects to /reminders on success

* Example:
* Edit Reminder
* GET /reminders/60c123abc456def7890ghijk/edit (shows form)
* POST /reminders/60c123abc456def7890ghijk/edit

* Body:
* title: Dentist Appointment
* description: Teeth cleaning
* dateTime: 2024-06-12T09:00
* email: john@example.com
* repeat: yearly
* Expected Response: Redirects to /reminders on success

* Delete Reminder
* POST /reminders/:id/delete
* Response: Redirects to /reminders on success

* Example:
* Delete Reminder
* POST /reminders/60c123abc456def7890ghijk/delete
* Expected Response: Redirects to /reminders on success

* Profile
* View Profile
* GET /profile
* Response: Renders profile page



* Update Email
* POST /profile/email
* Body: email
* Response: Redirects to /profile on success

* Example:
* Update Email
* POST /profile/email

* Body:
* email: newemail@example.com
* Expected Response: Redirects to /profile on success

* Change Password
* POST /profile/password
* Body: oldPassword, newPassword, confirmPassword
* Response: Redirects to /profile on success

* Example:
* Change Password
* POST /profile/password
* Body:
* oldPassword: MySecret123
* newPassword: NewSecret456
* confirmPassword: NewSecret456
* Expected Response: Redirects to /profile on success

#### Testing:

* Test all endpoints with Postman or Thunder Client
* Test all user flows: register, login, create/edit/delete reminders, profile update, password change, logout
* Test email delivery by creating a reminder due in the next minute
* Test error pages by visiting a non-existent route or causing a server error



 #### UI/UX & Accessibility:

* Responsive design for all devices
* Google Fonts and FontAwesome icons
* Professional color scheme (blue, white, gold)
* Accessible forms and navigation (labels, ARIA, alt tags)
* SEO meta tags on all pages
* Favicon and logo included

 #### Programming Concepts:
 
* Full Stack App: Combines frontend (EJS), backend (Express), and database (MongoDB)
* MVC: Model (data), View (what you see), Controller (logic)
* Security: Password hashing, session management, input validation
* Background Jobs: Automated email sending with node-cron
* Error Handling: Centralized, user-friendly error pages









