#!/bin/bash

# 1. 添加所有修改
git add .

# 2. 获取修改文件列表
files=$(git diff --cached --name-only)

# 3. 判断是否有修改
if [ -z "$files" ]; then
  echo "没有修改，跳过 commit"
  exit 0
fi

# 4. 生成 commit message（简单模板）
commit_msg="Update: $(echo $files | tr '\n' ' ')"

# 5. 提交
git commit -m ":art: $commit_msg"

# 6. 推送
current_branch=$(git branch --show-current)
# git push origin "$current_branch"

echo "✅ 提交完成: $commit_msg"
