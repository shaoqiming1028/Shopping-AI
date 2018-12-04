import numpy as np
import torch

from torchvision import models
from torchvision import transforms as tfs
from torchvision.datasets import ImageFolder
from train_resenet import train

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


resnet_152 = models.resnet152(pretrained=True)
#print(model)

for param in resnet_152.parameters():
    param.requires_grad = True

num_ftrs = resnet_152.fc.in_features

# 1049 classes
Output_features = 1049
resnet_152.fc.out_features = Output_features


resnet_152 = torch.nn.DataParallel(resnet_152).cuda()


criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD([{'params': resnet_152.module.conv1.parameters()},
			     {'params': resnet_152.module.bn1.parameters()},
			     {'params': resnet_152.module.relu.parameters()},
			     {'params': resnet_152.module.maxpool.parameters()},
			     {'params': resnet_152.module.layer1.parameters()},
			     {'params': resnet_152.module.layer2.parameters()},
			     {'params': resnet_152.module.layer3.parameters()},
			     {'params': resnet_152.module.layer4.parameters()},
			     {'params': resnet_152.module.avgpool.parameters()},
                 {'params': resnet_152.module.fc.parameters(),'lr':1e-3}], lr=5e-4, weight_decay=1e-4, momentum=0.9)

# train
#train(resnet_152, train_data, valid_data, 30, optimizer, criterion)
train(resnet_152, train_data, valid_data, 2, optimizer, criterion)


# save model
print("resnet 152 pretrained model, 30 epochs")
torch.save(resnet_152.state_dict(), "resnet152_1049_pretrained_4gpu_e30.pth.tar")

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


