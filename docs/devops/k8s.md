# k8s

## 环境准备
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
