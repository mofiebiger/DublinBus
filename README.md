=======
Git Commands (Mo's Magic Git Cheat Sheet)
============

## Translated Versions
- [Versão em português](READMEpt.md)

___

_A list of my commonly used Git commands_

*If you are interested in my Git aliases, have a look at my `.bash_profile`, found here: https://github.com/joshnh/bash_profile/blob/master/.bash_profile*

--

### Getting & Creating Projects

| Command | Description |
| ------- | ----------- |
| `git init` | Initialize a local Git repository |
| `git clone ssh://git@github.com/[username]/[repository-name].git` | Create a local copy of a remote repository |

### Basic Snapshotting

| Command | Description |
| ------- | ----------- |
| `git status` | Check status |
| `git add [file-name.txt]` | Add a file to the staging area |
| `git add -A` | Add all new and changed files to the staging area |
| `git commit -m "[commit message]"` | Commit changes |
| `git rm -r [file-name.txt]` | Remove a file (or folder) |

### Branching & Merging

| Command | Description |
| ------- | ----------- |
| `git branch` | List branches (the asterisk denotes the current branch) |
| `git branch -a` | List all branches (local and remote) |
| `git branch [branch name]` | Create a new branch |
| `git branch -d [branch name]` | Delete a branch |
| `git push origin --delete [branch name]` | Delete a remote branch |
| `git checkout -b [branch name]` | Create a new branch and switch to it |
| `git checkout -b [branch name] origin/[branch name]` | Clone a remote branch and switch to it |
| `git checkout [branch name]` | Switch to a branch |
| `git checkout -` | Switch to the branch last checked out |
| `git checkout -- [file-name.txt]` | Discard changes to a file |
| `git merge [branch name]` | Merge a branch into the active branch |
| `git merge [source branch] [target branch]` | Merge a branch into a target branch |
| `git stash` | Stash changes in a dirty working directory |
| `git stash clear` | Remove all stashed entries |

### Sharing & Updating Projects

| Command | Description |
| ------- | ----------- |
| `git push origin [branch name]` | Push a branch to your remote repository |
| `git push -u origin [branch name]` | Push changes to remote repository (and remember the branch) |
| `git push` | Push changes to remote repository (remembered branch) |
| `git push origin --delete [branch name]` | Delete a remote branch |
| `git pull` | Update local repository to the newest commit |
| `git pull origin [branch name]` | Pull changes from remote repository |
| `git remote add origin ssh://git@github.com/[username]/[repository-name].git` | Add a remote repository |
| `git remote set-url origin ssh://git@github.com/[username]/[repository-name].git` | Set a repository's origin branch to SSH |

### Inspection & Comparison

| Command | Description |
| ------- | ----------- |
| `git log` | View changes |
| `git log --summary` | View changes (detailed) |
| `git diff [source branch] [target branch]` | Preview changes before merging |

## Code Guidelines

These are some generic guidelines for keeping our code clear and readable. 
They can be found on "https://code.tutsplus.com/tutorials/top-15-best-practices-for-writing-super-readable-code--net-8118".

* Use descriptive variable names
* Where possible modularise any code being written.
    -   i.e. use of functions preferable to big blocks of code. 
* Ensure no private information is visible when you commit
    - Ensure the .gitignore includes the config file with API keys and passwords in it. 
* Commenting & Documentation 
    - Include at least a single line comment for each function to explain its function.
    - For complex function also include a short docstring shwoing usage instructions.
    - Avoid commenting every line of code. A comment per block is enough. 
* Avoid deep nested loops
    - this may not be avoidable but wherever possible they should be avoided. 
* For any SQL queries being written capitalize special words
    - e.g instead of "select * from table;" use "SELECT * FROM table;" - this can be changed easily so don't worry too much about it. 
* Code review
    - ensure all code goes through the code review process before commiting to master.
* Testing
    - where possible write tests before writing code. 
* Git commit messages
    - use descriptive commit messages (not like I did by typing "updated readme" ever time I edit this)

If there are and errors/issues just add/edit the above list. 

## Git Branching Guide

There will be two main branches in the github repo. All development should take place on the dev branch. 
Then as a group we can review all changes and merge those changes to master. 

**Note: I'm just getting used to using github so add to this guide as issues not covered arise/ if there are mistakes.**

When working on a piece of code create a branch from the dev branch and only merge back to the dev branch. 

**Move to Dev branch**

To check which branch you are on use: 
```
git branch -a
```

To switch to the dev branch use:
```
git checkout dev
```

**Create new branch for feature you are working on**

Once on the dev branch, create a branch for the feature you are working on:
```
git branch "feature_branch name"
```

Move to that branch: 
```
git checkout "feature_branch name"
```

Once you are finished working on that feature commit your changes and push them on your feature branch. 

```
git add . 
git commit -m "commit message"
git push (may need to set upstream --set-upstream origin "feature_branch name")
```

**Merge that branch back to the dev branch.**

Before merging back ensure to pull the latest changes from the dev branch to avoid conflicts.

```
git checkout dev
git pull 
```

Then to merge changes on the feature branch back to the dev branch:
```
git merge dev
```
Note: We will have to resolve conflicts. In the event of minor conflits we can resolve them individually, or as a group for major conflicts.

Finally, delete the feature_branch when you are finished with it. 
```
git branch -d "feature_branch name"
```

As a group we can review the dev code before commiting to master.
>>>>>>> 12768e0772bb3fcc956181d86d166ebbc501a861
