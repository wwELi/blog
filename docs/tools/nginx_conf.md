# nginx 配置文件详解

## 🧩 nginx 是什么？
**Nginx 是一个高性能的 Web 服务器和反向代理服务器。常用于：**

- 静态资源服务（如前端文件）；
- 反向代理（转发请求到后端服务，如 Node.js / Java / Python）；
- 负载均衡；
- HTTPS / HTTP2；
- 缓存、压缩、中间层安全控制。

## 🧱 配置结构层次说明

| 层级             | 作用                                        |
| -------------- | ----------------------------------------- |
| **全局块main**        | 设置 Nginx 运行的全局参数，如用户、进程数、日志位置等            |
| **events 块**   | 影响 Nginx 与客户端的连接处理，如最大连接数、I/O 模型          |
| **http 块**     | 包含 Web 服务相关配置，如 MIME 类型、日志、gzip、server 定义 |
| **server 块**   | 一个虚拟主机的配置，可监听不同域名/端口                      |
| **location 块** | 定义请求路径的匹配规则及处理方式（反向代理、静态资源、重定向等）          |
| **configuration 块** | 能够将其他文件包含在nginx配置文件中        |

## ⚙️ 配置
HTTP 核心模块是Nginx中最大的一个模块，绝大多数与 Web 服务、反向代理、负载均衡、缓存、日志、压缩、安全相关的配置都写在这里。
主要包含http/server/location三个层次的每个层次都可以插入指令
- http 区段位于配置文件的根部，在这个区段中允许定义HTTP模块的指令和HTTP模块的相关区段。
- server区段用于声明一个站点，该区段只能用在http区段中。
- loation 区段应用于网站特定的URI位置，该区段能够用于server区段中，也能嵌套在其他location中。

```nginx
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。
​
    tcp_nopush      on;                   # 提高网络包传输效率
    tcp_nodelay     on;                   # 减少延迟
    types_hash_max_size 2048;

    gzip on;                              # 启用 gzip 压缩
    gzip_types text/plain application/json text/css application/javascript;


    # 负载均衡定义
    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       8080;   #监听端口
        server_name  www.website.com website.com;;   #监听地址, nginx收到http请求时，根据请求header中Host值与所有server区段比较，第一个与主机名匹配的server块将被选中，否则如果没有server区段与客户端请求的主机名匹配，nginx会选择第一个server区段。       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           #alias /spool/w3/location; 指定uri路径的别名，它不会改变root的值。uri中location后面的部分会追加到这个目录后面，而location自身指定的uri路径是"丢弃的"
           #try_files:
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```
### [Demo地址](https://github.com/wwELi/nginx-ssl)

