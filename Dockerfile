FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline
COPY . .
ARG VITE_API_BASE_URL=https://api.xopsconference.com
ARG VITE_TRISKELGATE_URL=https://triskelgate-api.greensea-3f1bb7ef.uksouth.azurecontainerapps.io
ARG VITE_AGORAPASS_URL=https://app.agorapass.io
ARG VITE_TRISKELL_EVENT_ID=1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TRISKELGATE_URL=$VITE_TRISKELGATE_URL
ENV VITE_AGORAPASS_URL=$VITE_AGORAPASS_URL
ENV VITE_TRISKELL_EVENT_ID=$VITE_TRISKELL_EVENT_ID
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/index.html || exit 1
CMD ["nginx", "-g", "daemon off;"]
