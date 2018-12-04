
img_dir="/Users/mac/Downloads/MSEProject/Pytorch-dsh/1049/"

#verify if an image is corrupt or not
#help from https://stackoverflow.com/questions/3964681/find-all-files-in-a-directory-with-extension-txt-in-python

# corrupt_img_dir="c://temp//myimages//corruptimages//"
# good_img_dir="c://temp//myimages///goodimages//"

from PIL import Image
import os,time


def verify_image(img_file):
     #test image
     try:
        v_image = Image.open(img_file)
        v_image.verify()
        if v_image.format == "WEBP":
            return False
        return True;
        #is valid
        #print("valid file: "+img_file)
     except OSError:
        return False;


#main script
for root, dirs, files in os.walk(img_dir):
    for file in files:
        if file.endswith(".jpg"):
             currentFile=os.path.join(root, file)
             #test image
             if verify_image(currentFile):
                 # new_file_name=good_img_dir+time.strftime("%Y%m%d%H%M%S_"+os.path.basename(currentFile))
                 # print("good file, moving to dir: "+new_file_name)
                 # try:
                 #     os.rename(currentFile, new_file_name)
                 # except WindowsError:
                 print("True")
             else:
                 os.remove(currentFile)
                 #Move to corrupt folder
                 #makefilename unique
                 #new_file_name=corrupt_img_dir+time.strftime("%Y%m%d%H%M%S_"+os.path.basename(currentFile))
                 print("corrupt file" + currentFile)
                 #os.rename(currentFile, new_file_name)