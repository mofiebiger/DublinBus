# Dublin Bus Project Team 1: The Bold Toads

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


