# ECE 356 Ocean's Project

SeaNav is a underwater navigation system

# Order of commands
1. `git status` or `git branch` (check which branch you're on) \
2. (if not on master) git checkout master \
3. `git pull origin master` (get the most recent version of master) \
4. `git checkout nick_branch` (switch to nick_branch) \
5. (u can ignore this step later when u've done work locally) `git pull nick_branch` (get the latest version of nick_branch) \
\
6. (after you've done work) `git add .` -> `git commit -m "Completed something"` -> `git push origin nick_branch` \
7. `git checkout master` (switch to master)
8. `git pull origin master` (get the most recent version of master)
9. `git merge nick_branch` (hopefull it'll just be a fast-forward, u can if its weird u can lmk and ill merge ur branch with master)
10. `git push origin master` (push master to github)

# Branching
## To show which branch you're on currently, can also see with git status
git branch
## To create new branch and switch to it
git checkout -b <new-branch-name>
## To switch to other branch
git checkout <branch-name-u-want-to-switch-to>

# Pull
git pull origin <branch-name>

# Commit
'''
git status \
git add "filename" \
git add . (Add all files changed) \
git commit -m "Message" 
'''

# Push
git push


# Arduino Libraries
Pressure Sensor: Adafruit LPS35HW by Adafruit \
IMU Sensor: Adafruit BNO055 by Adafruit 


# Tutorials
Pressure Sensor (LPS35HW): https://cdn-learn.adafruit.com/downloads/pdf/lps35hw-water-resistant-pressure-sensor.pdf \
IMU Sensor (BNO055): https://cdn-learn.adafruit.com/downloads/pdf/adafruit-bno055-absolute-orientation-sensor.pdf 

# Datasheets
Pressure Sensor (LPS35HW): https://www.st.com/resource/en/datasheet/lps35hw.pdf \ 
IMU Sensor (BNO055): https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf 