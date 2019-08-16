
import os
files_root = "../static/ModelFiles/StopModels"
files = [file for root, dirs, total_files in os.walk(files_root) for file in total_files]
for i in range(len(files)):
    files[i] = files[i].split('.')[0]
print(files)
#     print(file)
#     res = re.match(r"^%s\.[a-zA-Z]{3,4}$" % user.username, file)
#     if res.group():
#         my_file = os.path.join(files_root, file)
#         os.remove(my_file)
#         break