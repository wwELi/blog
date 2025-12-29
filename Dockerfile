## 仅使用 Nginx，直接托管当前目录的 dist 静态文件（无需在镜像内构建）
FROM nginx:1.27-alpine

# 删除默认站点配置
RUN rm -f /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将本地已有的 dist 目录直接复制到 Nginx 根目录
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


