
FROM node:18 AS frontend-build

WORKDIR /app/frontend

COPY ./package*.json  ./
RUN npm install

COPY ./ ./

RUN npm run build

FROM node:18

WORKDIR /app/frontend

COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

COPY ./package*.json ./


RUN npm install --only=production
CMD ["npm", "run", "dev"]
