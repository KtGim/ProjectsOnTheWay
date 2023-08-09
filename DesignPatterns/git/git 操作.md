# git 操作

- 合并其他分支的某个提交

```
  例如要将A分支的一个commit合并到B分支：
  首先切换到A分支
  git checkout A
  git log
  找出要合并的commit ID :
  例如
  0128660c08e325d410cb845616af355c0c19c6fe
  然后切换到B分支上
  git checkout B
  git cherry-pick  0128660c08e325d410cb845616af355c0c19c6fe
  然后就将A分支的某个commit合并到了B分支了
```

  - git remote -v 查看当前所有远程分支
  - git add remote origin gitUrl 将远程 gitUrl 仓库 印射到本地 origin
  - git revert 回复合并版本，如果之前之前版本是 revert 版本 则会取消此次 revert 版本
  - git reset 重置版本，如果版本是三方合并的版本，需要重置到两个分支合并的父节点处。单个分支需要恢复到合并节点之前。
  - 所有操作都是基于版本对应的文件进行，不会影响之后修改的文件
  