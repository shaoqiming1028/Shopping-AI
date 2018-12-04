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


# 1. prepare datasets
train_tf = tfs.Compose([
    tfs.RandomResizedCrop(224),
    tfs.RandomHorizontalFlip(),
    tfs.ToTensor(),
    tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # 使用 ImageNet 的均值和方差
])

train_set = ImageFolder('/home/a1728768/fastdir/virtualenvs/dataset/products/1049_compression', train_tf)
train_data = DataLoader(train_set, 64, True, num_workers=8)

# 2. load pretrained model 
device = torch.device("cuda")
densenet161 = models.densenet161(pretrained=False)

#densenet161.to(device)
densenet161.classifier = nn.Linear(2208, 1047)
densenet161 = torch.nn.DataParallel(densenet161)
# print params in model
# print("Model's state_dict:")
# for param_tensor in densenet161.state_dict():
#     print(param_tensor, "\t", densenet161.state_dict()[param_tensor].size())

params = torch.load('/home/a1728768/fastdir/virtualenvs/pytorch/Mobiilenet-finetune/model_volta/027.pth')
densenet161.load_state_dict(params)
densenet161 = densenet161.to(device)

for param in densenet161.module.classifier.parameters():
    param.requires_grad = True

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD([{'params': densenet161.module.classifier.parameters(), 'lr':2e-3},
                            {'params': densenet161.module.features.parameters()}], lr=1e-3, weight_decay=1e-3, momentum=0.9)


# 3. train
train(densenet161, train_data, 30, optimizer, criterion)

# 4. save model
print("Star from 027.pth, densenet 161 pretrained model, 30 epochs")
torch.save(densenet161.state_dict(), "densenet161_1047_reload_4gpu_e30.pth")


