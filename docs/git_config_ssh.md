# Git 配置多个SSH

1 如果本地还没有配置SSH执行如下代码生成
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
2 本地需要配置多个
```bash
ssh-keygen -t rsa -b 4096 -C "another_email@example.com" -f ~/.ssh/id_rsa_another
```
-f 参数指定密钥文件的保存路径和名称。对于每个密钥对，都要使用不同的文件名（例如 id_rsa_another、id_rsa_service 等）。

本地配置config

```
touch ~/.ssh/config
```
使用如下配置
```
# 默认配置
Host github.com
  User git
  Hostname github.com
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes

# 第二个配置
Host github-another
  User git
  Hostname github.com
  IdentityFile ~/.ssh/id_rsa_another
  IdentitiesOnly yes

# 对于其他服务
Host myserver
  User yourusername
  Hostname example.com
  IdentityFile ~/.ssh/id_rsa_myserver
  IdentitiesOnly yes
```
 - Host 是你用来引用这个配置的别名。
 - Hostname 是实际的服务器地址。
 - IdentityFile 是密钥文件的路径。
 - IdentitiesOnly yes 确保只使用指定的密钥进行身份验证。
 