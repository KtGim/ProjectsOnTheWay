FROM nginx:1.12-alpine
WORKDIR /var/www/tenantui
COPY dist /var/www/tenantui
COPY nginx.conf /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]
