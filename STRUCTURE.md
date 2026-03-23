# Cheque Clearing System — Project Structure

cheque-clearing-system/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/                  # Static assets (logos, images)
│   │
│   ├── components/
│   │   ├── ui/                  # Reusable dumb components
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.module.css
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── StatusBadge.module.css
│   │   │   └── index.js         # barrel export
│   │   │
│   │   └── layout/              # App shell
│   │       ├── AppLayout.jsx
│   │       ├── AppLayout.module.css
│   │       ├── Sidebar.jsx
│   │       ├── Sidebar.module.css
│   │       └── index.js
│   │
│   ├── pages/                   # One file per route
│   │   ├── Login.jsx
│   │   ├── Login.module.css
│   │   ├── Signup.jsx
│   │   ├── Signup.module.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.module.css
│   │   ├── ChequeList.jsx
│   │   ├── ChequeList.module.css
│   │   ├── ChequeUpload.jsx
│   │   ├── ChequeUpload.module.css
│   │   ├── ChequeDetail.jsx
│   │   └── ChequeDetail.module.css
│   │
│   ├── hooks/                   # Custom hooks (talk to Redux)
│   │   ├── useAuth.js
│   │   └── useCheques.js
│   │
│   ├── store/                   # Redux Toolkit
│   │   ├── index.js             # configureStore
│   │   └── slices/
│   │       ├── authSlice.js
│   │       └── chequesSlice.js
│   │
│   ├── services/                # All API calls live here
│   │   ├── api.js               # Axios instance + interceptors
│   │   ├── authService.js
│   │   └── chequeService.js
│   │
│   ├── constants/
│   │   └── index.js             # API endpoints, status enums
│   │
│   ├── utils/
│   │   └── index.js             # formatDate, formatAmount, etc.
│   │
│   ├── App.jsx                  # Router setup
│   ├── main.jsx                 # ReactDOM entry
│   └── index.css                # CSS variables + reset
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js


## Layer Rules (strict)
#
# pages      → use hooks only, never import services directly
# hooks      → dispatch to store, call selectors
# store      → calls services via createAsyncThunk
# services   → axios calls only, no business logic
# components → receive props, no store access (except layout)
