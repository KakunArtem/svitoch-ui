## Local development

1. Install modules
```bash
npm i --legacy-peer-deps
```
2. Build the app
```bash
npm run build
```
3. Start the app
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Docker container
1. Build the Docker image
```bash
docker build -t svitoch-ui .
```
2. Run the Docker container from the image
```bash
docker run -p 3000:3000 -d svitoch-ui
```