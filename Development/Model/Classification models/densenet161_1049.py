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
train_set = ImageFolder('/home/a1728768/fastdir/virtualenvs/dataset/imagenet/train_7', train_tf)
#valid_set = ImageFolder('/home/a1728768/fastdir/virtualenvs/dataset/imagenet/val100_7', valid_tf)
#  DataLoader Iterator
train_data = DataLoader(train_set, 64, True, num_workers=8)
valid_data = ""


densenet161 = models.densenet161(pretrained=True)

for param in densenet161.parameters():
    param.requires_grad = False

num_ftrs = densenet161.classifier.in_features

# five classes
Output_features = 1049
densenet161.classifier.out_features = Output_features

for param in densenet161.module.parameters():
    param.requires_grad = True



densenet161 = torch.nn.DataParallel(densenet161).cuda()

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD([{'params': densenet161.module.classifier.parameters()},
                            {'params': densenet161.module.parameters(), 'lr':5e-4}], lr=1e-3, weight_decay=1e-3, momentum=0.9)

# train
train(densenet161, train_data, valid_data, 30, optimizer, criterion)

# save model
print("densenet 161 pretrained model, 30 epochs")
torch.save(densenet161.state_dict(), "densenet161_1049_pretrained_4gpu_e30.pth.tar")

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


