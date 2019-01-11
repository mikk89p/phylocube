FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY backend.conf /etc/nginx/conf.d/backend.conf

WORKDIR /tmp/cache/nginx
RUN chmod -R 777 .

WORKDIR /usr/share/nginx/html
COPY dist/ .
RUN chmod -R 755 .