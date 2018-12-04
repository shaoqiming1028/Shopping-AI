# coding: utf-8
import os  # 引入文件操作库

import os

def delete_dir(dir):
    if  os.path.isdir(dir):
        for item in os.listdir(dir):
            if item!='System Volume Information':#windows下没权限删除的目录：可在此添加更多不判断的目录
                delete_dir(os.path.join(dir, item))

        if not os.listdir(dir):
            os.rmdir(dir)
            print("移除空目录：" + dir)

if __name__ == "__main__":  # 执行本文件则执行下述代码

    delete_dir("/Users/mac/Downloads/MSEProject/Pytorch-dsh/images")
