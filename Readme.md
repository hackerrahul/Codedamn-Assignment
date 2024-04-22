# Codedamn Playground

#### This is a project to build a playground like the one integrated in codedamn.com


## Dependencies to run the backend
* Node js installed
* Dependencies for **node-pty** package
    > Python
    > Visual Studio Enterprise based for **windows**
     * Development with c++
     * MSVC v141 (under individual components)
     * C++ ATL v143 build tools


## Start Dev mode for backend
```bash
    cd backend
    npm install

    npm run dev
```

## Start Dev mode for Frontend
```bash
    cd backend
    npm install
    npm run build
```

## ENV

* Backend
```env
    TZ=UTC
    PORT=3333
    HOST=localhost
    LOG_LEVEL=info
    APP_KEY=Cedg-bGKwWcPpPpScUM6FxBVErErjNAL
    NODE_ENV=development
    SESSION_DRIVER=cookie
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=
    DB_DATABASE=codedamn
```

* Frontend
```env
    API_BASE_URL=http://localhost:3333
    PUBLIC_API_BASE_URL=http://localhost:3333
```

Tha'ts all you need to test the app