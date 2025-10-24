# ☸️ Kubernetes 入门

## 环境准备 🐳
- Docker Desktop

## 设置
::: info 在docker Desktop进行如下设置 :tada:
setting -> Kubernetes -> Enable Kubernetes
:::

等待加载完成使用 命令 验证

```bash
kubectl version --short
```
## 创建demo
本地创建 一个nginx 的demo 新建deployment yaml 
```yaml
apiVersion: apps/v1
kind: Deployment 
metadata:
  name: static-html-deployment
  labels:
    app: static-html # 标签名
spec:
  replicas: 2 # 副本数
  selector:
    matchLabels:
      app: static-html
  template:
    metadata:
      labels:
        app: static-html
    spec:
      containers:
        - name: static-html     # container name
          image: nginx:latest   # 镜像文件
          imagePullPolicy: IfNotPresent 
          ports:
            - containerPort: 80

```
这个只是定义了部署的 pod的定义 还需要定义向外暴露的的服务信息（如果使用本地的镜像需要设置k8s环境可以访问docker） 

```yaml
apiVersion: v1
kind: Service
metadata:
  name: static-html-service
spec:
  selector:
    app: static-html     # 👈 匹配上面 Deployment 的标签
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080  # NodePort 范围是 30000-32767
```

执行运行pod命令
`kubectl apply -f k8s-deployment.yaml`通过 `kubectl get pods` 查看pods
执行运行service
`kubectl apply -f k8s-service.yaml` 同样可以通过 `kubectl get svc`查看
运行成功之后可以访问`http://localhost:30080/`
删除命令
```bash
kubectl delete -f k8s-deployment.yaml
kubectl delete -f k8s-service.yaml
```
## 访问dashboard
使用 `kubectl proxy` 后访问
> http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

一般使用token 登录 Dashboard 默认需要 ServiceAccount 和 ClusterRoleBinding 才能访问集群资源。

- 创建 ServiceAccount
```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
EOF
```
- 创建 ClusterRoleBinding
```bash
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
EOF
```
- 获取登录的token
```bash
kubectl -n kubernetes-dashboard create token admin-user
```
使用生成的token 就可以访问了

## K8s Node（节点）
1. Node 是 Kubernetes 集群中用于运行 **Pod** 的工作节点（Worker Node）。  
2. 每个 Node 都包含运行容器所需的核心组件：`kubelet`、`kube-proxy` 和容器运行时（container runtime）。

**一个 K8s 集群通常包含：**
- 若干个 **Node（工作节点）**
- 每个 Node 可以运行多个 **Pod**
- 控制平面（Control Plane）负责调度哪些 Pod 应该运行在哪个 Node 上。

| 组件                      | 作用说明                              |
|-------------------------|-----------------------------------|
| **kubelet**             | 管理当前节点上的 Pod 生命周期，监听来自控制平面的指令     |
| **kube-proxy**          | 管理网络规则，处理 Pod 间和 Service 的通信与负载均衡 |
| **容器运行时**（如 containerd） | 实际拉取镜像并运行容器  |

### POD
在 Kubernetes 中，**Pod 是容器的抽象层**。  它代表集群中运行的一个应用实例，通常包含：
  - 一个或多个容器（Container）
  - 存储卷（Volume）
  - 网络命名空间（IP、端口）
  - 运行配置（环境变量、探针、资源限制等）

### Service
为什么需要 Service？
- Pod 是短暂的、动态的，IP 地址会随 Pod 重启而变化  
- Service 提供一个 **固定的访问入口**，并自动负载均衡到对应 Pod  
- Service 可用于：
  - 集群内部通信（ClusterIP）  
  - 对外暴露（NodePort、LoadBalancer）  
  - HTTP 路由（配合 Ingress）

示例：为 nginx Pod 创建 ClusterIP Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80       # Service 对外端口
      targetPort: 80 # Pod 容器端口
  type: ClusterIP 
```

### Ingress
**route traffic into cluster = Ingress**
- 是 Kubernetes 提供的七层（HTTP/HTTPS）路由规则对象，用于将外部请求（通常来自浏览器）转发到集群内部的 Service 和 Pod
- 为什么需要 Ingress？
        
在 Kubernetes 中，Service（如 ClusterIP）**默认不能被外部访问**，即使用 NodePort/LoadBalancer 暴露也：
        
  - 不方便管理多个服务
  - 不支持基于 URL 或域名做转发
  - 缺少 HTTPS 支持

 👉 Ingress 提供统一的入口网关，灵活路由、支持 TLS，适合生产环境使用
        
示例：将流量按路径转发给不同服务
        
```yaml
# http://myapp.com/web → 转发到 web-service
# http://myapp.com/api → 转发到 api-service

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
spec:
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /web
        pathType: Prefix
        backend:
          service:
            name: web-service # 对应service 的名称
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80

```
        
### DNS Name
- 每个 **Service 和 Pod** 都会被自动注册到一个**内部 DNS 系统中**，从而可以通过“名字”来访问服务，而不是直接使用 IP 地址
- Kubernetes 为 Service 自动生成以下 DNS 名称：
    
```
`service-name`.`namespace`.svc.cluster.local
```
## Yaml 配置文件

### 1️⃣ 通用 YAML 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| apiVersion | string | API 版本 | `v1`, `apps/v1` |
| kind | string | 资源类型 | `Pod`, `Deployment`, `Service` |
| metadata | object | 元数据，包括 name、namespace、labels、annotations | `metadata:\n  name: nginx-pod\n  labels:\n    app: web` |
| spec | object | 资源规范，定义行为和配置 | `spec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web` |
| status | object | 状态信息（系统生成，只读） | `status:\n  phase: Running` |

### 2️⃣ Pod YAML 字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| containers | list | 容器列表 | `containers:\n  - name: nginx\n    image: nginx:latest` |
| initContainers | list | 初始化容器，Pod 启动前执行 | `initContainers:\n  - name: init-mydb\n    image: busybox` |
| volumes | list | 挂载卷 | `volumes:\n  - name: data\n    emptyDir: {}` |
| restartPolicy | string | 重启策略 | `restartPolicy: Always` |
| nodeSelector | object | 节点选择 | `nodeSelector:\n  role: frontend` |
| tolerations | list | 污点容忍 | `tolerations:\n  - key: "key"\n    operator: "Equal"\n    value: "value"\n    effect: "NoSchedule"` |
| affinity | object | Pod 调度亲和/反亲和 | `affinity:\n  podAntiAffinity: {...}` |
| livenessProbe | object | 存活探针 | `livenessProbe:\n  httpGet:\n    path: /\n    port: 80` |
| readinessProbe | object | 就绪探针 | `readinessProbe:\n  tcpSocket:\n    port: 80` |
| resources | object | CPU/内存请求与限制 | `resources:\n  requests:\n    cpu: 250m\n    memory: 128Mi\n  limits:\n    cpu: 500m\n    memory: 256Mi` |

### 3️⃣ Deployment YAML 字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| replicas | int | Pod 副本数 | `replicas: 3` |
| selector | object | 匹配 Pod 标签 | `selector:\n  matchLabels:\n    app: web` |
| template | object | Pod 模板 | `template:\n  metadata:\n    labels:\n      app: web\n  spec:\n    containers: [...]` |
| strategy | object | 滚动更新策略 | `strategy:\n  type: RollingUpdate\n  rollingUpdate:\n    maxUnavailable: 1` |

### 4️⃣ Service YAML 字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| selector | object | 匹配 Pod 标签 | `selector:\n  app: web` |
| type | string | Service 类型 | `ClusterIP`, `NodePort`, `LoadBalancer`, `ExternalName` |
| ports | list | 端口映射 | `ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30080` |
| clusterIP | string | 集群内部 IP（可选） | `clusterIP: None`（Headless Service） |
| externalName | string | 外部域名 | `externalName: example.com` |
| sessionAffinity | string | 会话保持 | `sessionAffinity: ClientIP` |


### 5️⃣ Ingress YAML 字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| rules | list | 路由规则 | `rules:\n  - host: myapp.local\n    http:\n      paths:\n        - path: /\n          pathType: Prefix\n          backend:\n            service:\n              name: nginx-service\n              port:\n                number: 80` |
| tls | list | TLS 配置 | `tls:\n  - hosts:\n      - myapp.local\n    secretName: my-tls-secret` |
| annotations | object | 控制器特定配置 | `annotations:\n  kubernetes.io/ingress.class: nginx` |

### 6️⃣ 高级 YAML 特性

| 特性 | 说明 | 示例 |
|------|------|------|
| 锚点 & 别名 | 避免重复配置 | `defaults: &defaults\n  image: nginx:latest\npod1:\n  <<: *defaults` |
| 多文档文件 | 用 `---` 分隔多个文档 | `---\napiVersion: v1\nkind: Pod\n...\n---\napiVersion: v1\nkind: Pod\n...` |
| 多行字符串 | `|` 保留换行，`>` 折叠换行 | `description: |\n  第一行\n  第二行` |

### 7️⃣ 常见 YAML 错误

| 错误 | 原因 | 解决方法 |
|------|------|-----------|
| `expected <block end>` | 缩进错误或空格不一致 | 使用空格缩进，避免 Tab |
| `mapping values are not allowed` | 键值缺少冒号 | 检查冒号和空格 |
| `unknown field` | 字段拼写错误 | 对照官方 API 文档 |
| CrashLoopBackOff | 容器或配置错误 | 检查容器镜像、端口、探针设置 |

### 8️⃣ 小结

- Kubernetes YAML 核心字段：`apiVersion`、`kind`、`metadata`、`spec`  
- Pod 是最小调度单元，Deployment 管理 Pod 副本  
- Service 提供稳定访问，Ingress 管理外部路由  
- 掌握缩进、列表、字典、注释、多文档等 YAML 特性  
- 高级特性：锚点、别名、多行字符串，避免重复和冗长

### 📚 参考资料

- Kubernetes 官方文档 YAML：https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/  
- YAML 官方规范：https://yaml.org/spec/  
- Kubernetes Cheat Sheet：https://kubernetes.io/docs/reference/kubectl/cheatsheet/

## Demo 
https://github.com/wwELi/nuxt-app/blob/main/deployment/deployment.yml