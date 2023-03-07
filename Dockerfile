FROM node:14.20.1 as build-step
WORKDIR /app
# COPY ["package.json", "./"]
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY package*.json /app/
RUN npm install
# COPY . .
COPY ./ /app/
 RUN npm run build --prod

FROM nginx:latest
# COPY --from=build-step /app/dist/ ionpure.webapp/usr/share/nginx/html
COPY --from=build-step /app/dist/ionpure.webapp /usr/share/nginx/html
EXPOSE 80
