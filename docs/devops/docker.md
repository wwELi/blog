# 🐳 Docker 学习文档
> 一份从零开始的 Docker 入门指南，包含安装、核心概念、运行容器及常用命令。
## 1. 什么是 Docker

Docker 是一个 **容器化平台**，用于将应用及其依赖打包成轻量级、可移植的容器。
容器可以在任何安装了 Docker 的主机上运行，实现 “一次构建，到处运行”。

### ✨ 优点
- 启动速度快，资源占用低
- 环境一致，避免“在我机器上没问题”
- 易于部署、扩展和迁移
- 支持微服务架构

## 2. 安装 Docker

### 🍎 macOS
1. 下载 https://www.docker.com/products/docker-desktop/
2. 拖拽安装到“应用程序”文件夹
3. 启动 Docker 并验证：
   docker --version

### 🐧 Linux（Ubuntu 示例）
```bash
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release -y
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
docker --version
```
### 使用 colima
Use colima run docker compose https://smallsharpsoftwaretools.com/tutorials/use-colima-to-run-docker-containers-on-macos/


## 3. Docker 基本概念

- 镜像 (Image)：容器的模板。
- 容器 (Container)：镜像运行后的实例。
- 仓库 (Repository)：存放镜像的地方，如 Docker Hub。
- Dockerfile：定义如何构建镜像的文件。

|          | **Docker Image**                   | **Docker Container**                    |
|----------|------------------------------------|-----------------------------------------|
| **类型**   | The actual package (静态文件)          | Actually start the application (动态运行实例) |
| **比喻理解** | Image 就像是类（Class）                  | Container 就像是类的实例（Object）            |
| **关系**   | 每个镜像可以创建多个容器实例                     | 每个容器都是独立运行的实例    |

**Docker vs. Virtual Machine**
- Docker -> 虚拟化 -> (OS) Applications
- Virtual Machine -> 虚拟化 -> (OS) Applications & Kernel

|    | **Docker**    | **Virtual Machine** |
|----------|---------------|---------------------|
| **启动速度** | 秒级            | 分钟级                 |
| **性能开销** | 较低（共享主机内核）    | 较高（运行完整操作系统）        |
| **所需资源** | 更少（轻量）        | 更多（需要整个 OS）         |
| **文件体积** | 小（MB ~ 几百 MB） | 大（GB）               |

## 4. 运行你的第一个容器
```bash
docker run hello-world
```

输出：
Hello from Docker!
This message shows that your installation appears to be working correctly.

## 5. 常用命令速查
### Docker

| **类别**               | **命令**                                                    | **说明**                                                                                                                                                                                                        |
|----------------------|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **镜像管理(Image)**      | **docker pull `镜像名`**                                     | 从仓库拉取镜像<br>默认命名空间（namespace）：library                                                                                                                                                                          |
| **镜像管理(Image)**      | **docker pull `registry`/`namespace`/`image`:`tag`**      | 当你使用 **私有仓库（Private Registry）** 或 **组织镜像（Organization Repository）** 时，拉取镜像需要：使用完整镜像路径<br><br>私有仓库需要登录认证：<br>docker login `registry`<br>系统会提示你输入：用户名 & 密码<br>登录成功后，凭据会保存在本地的 `~/.docker/config.json`，拉取镜像时自动使用 |
| **镜像管理(Image)**      | **docker images**                                         | 查看本地镜像列表                                                                                                                                                                                                      |
| **容器管理 (Container)** | **docker run -d -p `宿主机端口`:`容器端口`  --name `容器名称` `镜像名称`** | 从指定镜像创建并启动容器<br>• -d : 后台运行 (detach)<br>• -p `宿主机端口`:`容器端口` ：端口映射                                                                                                                                             |
| **容器管理 (Container)** | **docker ps**                                             | 查看正在运行的容器                                                                                                                                                                                                     |
| **容器管理 (Container)** | **docker ps -a**                                          | 查看所有容器（包括已停止）                                                                                                                                                                                                 |
| **容器管理 (Container)** | **docker stop `容器ID`**                                    | 停止容器                                                                                                                                                                                                          |
| **容器管理 (Container)** | **docker start `容器ID`**                                   | 启动已停止的容器                                                                                                                                                                                                      |
| **容器管理 (Container)** | **docker restart `容器ID`**                                 | 重启容器                                                                                                                                                                                                          |
| **容器管理 (Container)** | **docker rm `容器ID`**                                      | 删除容器                                                                                                                                                                                                          |
| **容器管理 (Container)** | **docker logs `容器ID`**                                    | 查看容器日志                                                                                                                                                                                                        |
| **容器管理 (Container)** | **docker exec -it `容器ID` /bin/bash**                      | 以普通用户身份进入容器交互终端                                                                                                                                                                                               |
| **容器管理 (Container)** | **docker exec -u -0 -it `容器ID` /bin/bash**                | 以root user身份进入容器交互终端                                                              

### Docker Compose
- Docker Compose 是 Docker 官方提供的一个工具，用来定义和管理多容器应用
- Docker Compose 让你用一个文件，一条命令，启动整个项目的多个服务（容器） — 比如前端 + 后端 + 数据库
- 核心文件：docker-compose.yml
    - 这是一个 YAML 文件，用来声明：
    - 要启动哪些服务（如 app、db）
    - 使用什么镜像、Dockerfile
    - 端口映射、环境变量、网络、卷挂载等配置
- 常用命令

| **操作**       | **命令/描述**              |
|--------------|------------------------|
| 启动服务         | docker compose up      |
| 后台运行         | docker compose up -d   |
| 停止服务         | docker compose down    |
| 一并清除 volumes | docker-compose down -v |
| 查看状态         | docker compose ps      |
| 查看日志         | docker compose logs    |
| 定义文件         | docker-compose.yml     |

## 6. 示例：运行 Nginx Web 服务器

```bash
docker run -d \
  --name mynginx \
  -p 8080:80 \
  nginx
```
访问：
http://localhost:8080

## 7. Dockerfile 示例
**Dockerfile 是一个脚本文件，用来定义“如何构建一个 Docker 镜像”**
| 指令         | 作用说明                              | 示例                                |
|------------|-----------------------------------|-----------------------------------|
| FROM       | 指定基础镜像，所有镜像都从某个镜像开始构建             | FROM node:18                      |
| WORKDIR    | 设置工作目录，后续命令都在此目录执行相当于执行CD 命令                | WORKDIR /app                      |
| COPY       | 将本地文件/目录复制到镜像中                    | COPY package.json ./              |
| ADD        | 复制文件，支持自动解压 tar 文件，还支持 URL 下载     | ADD app.tar.gz /app/              |
| RUN        | 在镜像构建时执行命令（如安装依赖）                 | RUN npm install                   |
| CMD        | 容器启动时执行的默认命令（可以被覆盖）               | CMD ["node", "index.js"]          |
| ENTRYPOINT | 容器启动时执行的命令，通常搭配 CMD 使用，较难覆盖       | ENTRYPOINT ["python"]             |
| ENV        | 设置环境变量                            | ENV NODE_ENV production           |
| EXPOSE     | 声明容器监听的端口（仅做说明，端口映射需用 docker run） | EXPOSE 3000                       |
| VOLUME     | 声明数据卷，数据持久化或共享                    | VOLUME /data/db                   |
| USER       | 指定运行命令的用户名或 UID                   | USER node                         |
| ARG        | 定义构建时变量（仅在 build 阶段有效）            | ARG APP_VERSION=1.0               |
| ONBUILD    | 为后续基于此镜像的 Dockerfile 设置触发构建指令     | ONBUILD COPY . /app               |
| LABEL      | 添加元数据标签，方便管理和查询                   | LABEL maintainer="me@example.com" ||

**示例构建node应用的镜像**
```docker
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```
构建镜像：
```bash
docker build -t mynodeapp .
```

运行容器：
```bash
docker run -d -p 3000:3000 mynodeapp
```
## 8. Docker Volumes
**配置Volumes 的作用**
- 默认情况下：容器中的数据是临时的 一旦容器删除，数据也就没了,为了保存数据（比如数据库文件、日志、上传的用户文件等），就需要使用 Volume
- Docker Volumes 是 Docker 提供的一种持久化数据的机制，允许容器中的数据保存到宿主机上，即使容器被删除，数据仍然保留
- 你可以简单理解为：Volume = 挂在容器上的一个宿主机上的文件夹
1. **挂载本地目录**        
    ```yaml
    # 将 本地目录 ./data 映射到容器内的 /app/data
    # 常用于开发环境
            
    services:
    app:
        image: my-app
        volumes:
        - ./data:/app/data
    ```
2. **使用命名卷**
    ```yaml
    # 容器内路径 /var/lib/postgresql/data 使用一个名为 db-data 的 volume 持久化数据
    # Docker 自动管理这个 volume 的路径与生命周期
    # 推荐用于生产环境（比 bind mount 更隔离）
        
        services:
          db:
            image: postgres
            volumes:
              - db-data:/var/lib/postgresql/data
        
        volumes:
          db-data:
    ```
3. **查看和管理**
    | **命令**                              | **作用**          |
    |-------------------------------------|-----------------|
    | **docker volume ls**                | 查看所有卷           |
    | **docker volume inspect my-volume** | 查看卷细节           |
    | **docker volume rm my-volume**      | 删除卷（需确保没有容器在使用） |   
## 9. 多阶段构建
- 多阶段构建就是在构建过程中使用多个镜像阶段，在前面的阶段中构建代码、编译产物，最后只将需要的内容复制进最终的运行镜像
- 它允许你在一个 Dockerfile 中定义多个 `FROM` 阶段，并从前一个阶段中选择性地复制文件到最终镜像中
- 只有最后一个阶段的内容才会保留✅所有阶段都会进入最终镜像❌

**demo 使用node 打包前端项目后用nginx托管**
```docker
FROM node:latest as node-01
COPY ./html /html/
COPY ./app /app/

WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx
COPY --from=node-01 /dist /usr/share/nginx/html
COPY ./html/assets /usr/share/nginx/html/assets
COPY default.conf /etc/nginx/conf.d/default.conf
```
## 10. 参考资料
- 官方文档：https://docs.docker.com  
- Docker Hub：https://hub.docker.com  
- 在线实验环境：https://labs.play-with-docker.com
