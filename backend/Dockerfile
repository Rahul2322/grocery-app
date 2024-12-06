
FROM node:18 AS backend-build
WORKDIR /app/backend

COPY ./package*.json ./
RUN npm install

COPY ./ ./
RUN npm run build

FROM node:18

WORKDIR /app/backend

COPY --from=backend-build /app/backend/dist /app/backend/dist

COPY ./package*.json  ./
RUN npm install --only=production

CMD ["npm", "run", "start"]
