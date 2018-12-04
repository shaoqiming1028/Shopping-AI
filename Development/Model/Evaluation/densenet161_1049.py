import numpy as np
import torch

from torchvision import models
from torchvision import transforms as tfs
from torchvision.datasets import ImageFolder
from train_densenet import train

from PIL import Image
from torch import nn
from torch.autograd import Variable
from torch.utils.data import DataLoader
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

# tmp = Image.open("/home/yang/dataset/google_coles_images/test7/HerbertAdamsFrozenMixedVegetablePasties4pack/0a52592494527459876d30045c7b3bb8.jpg")
# tmp.show()

train_tf = tfs.Compose([
    tfs.RandomResizedCrop(224),
    tfs.RandomHorizontalFlip(),
    tfs.ToTensor(),
    tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # 使用 ImageNet 的均值和方差
])

# valid_tf = tfs.Compose([
#     tfs.Resize(256),
#     tfs.CenterCrop(224),
#     tfs.ToTensor(),
#     tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
# ])

#  Define dataset using ImageFolder
train_set = ImageFolder('/home/yang/dataset/imagenet/fruits/val50_5', train_tf)
#train_set = ImageFolder('/home/yang/dataset/google_coles_images/1049_compression', train_tf)
#train_set = ImageFolder('/home/a1728768/fastdir/virtualenvs/dataset/products/1049_compression', train_tf)
#valid_set = ImageFolder('/home/a1728768/fastdir/virtualenvs/dataset/imagenet/val100_7', valid_tf)
#  DataLoader Iterator
train_data = DataLoader(train_set, 64, True, num_workers=8)



densenet161 = models.densenet161(pretrained=True)

for param in densenet161.parameters():
    param.requires_grad = False

num_ftrs = densenet161.classifier.in_features
print(num_ftrs)

# five  classes
Output_features = 20
densenet161.classifier = nn.Linear(2208, Output_features)

densenet161 = torch.nn.DataParallel(densenet161).cuda()

print(densenet161)

for param in densenet161.module.classifier.parameters():
    param.requires_grad = True

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD([{'params': densenet161.module.classifier.parameters(), 'lr':1e-3},
                            {'params': densenet161.module.features.parameters()}], lr=5e-4, weight_decay=1e-3, momentum=0.9)
#optimizer = torch.optim.SGD(densenet161.module.classifier.parameters(), lr=5e-4, weight_decay=1e-3, momentum=0.9)


# train
train(densenet161, train_data, 2, optimizer, criterion)

# save model
print("densenet 161 pretrained model, 30 epochs")
#torch.save(densenet161.state_dict(), "densenet161_1049_pretrained_4gpu_e30.pth.tar")

#  Change Mobilenet into evaluation model
#model = model.eval()

# im1 = Image.open('/Users/mac/PycharmProjects/mobilenet/11.jpg')


#  Pretreatment
#im = valid_tf(im1)
#out = model(Variable(im.unsqueeze(0)))
#pred_label = out.max(1)[1].data[0]
#pred_label = out.max(1)
#print('predict label: {}'.format(valid_set.classes[pred_label]))
#file = open('／home/ubuntu/project/result.txt','w')
#file.write('predict label: {}'.format(valid_set.classes[pred_label]))
#print(valid_set.classes[pred_label])


