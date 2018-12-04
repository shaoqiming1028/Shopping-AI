import numpy as np
import torch

from torchvision import models
from torchvision import transforms as tfs
from torchvision.datasets import ImageFolder
#from train_resnet_1047 import train

from PIL import Image
from torch import nn
from torch.autograd import Variable
from torch.utils.data import DataLoader

from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True


# # 1. prepare datasets
# train_tf = tfs.Compose([
#     tfs.RandomResizedCrop(224),
#     tfs.RandomHorizontalFlip(),
#     tfs.ToTensor(),
#     tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # 使用 ImageNet 的均值和方差
# ])

# train_set = ImageFolder('/fast/users/a1699631/virtualenvs/pytorch-mobilenet/Pytorch-dsh/1049_compression/', train_tf)
# train_data = DataLoader(train_set, 64, True, num_workers=8)

device = torch.device("cuda")
resnet152 = models.resnet152(pretrained=False)

Output_features = 1047
resnet152.fc = nn.Linear(2048, Output_features)
resnet152 = torch.nn.DataParallel(resnet152).cuda()

params = torch.load('/home/yang/pytorch_project/project/image_retrieval/keep_train/resnet_params/resnet152_1047_pretrained_4gpu_e30.pth.tar')
resnet152.load_state_dict(params)
resnet152 = resnet152.to(device)

for param in resnet_152.module.parameters():
    param.requires_grad = True

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
#train(resnet_152, train_data, valid_data, 30, optimizer, criterion).cuda()
train(resnet_152, train_data, 30, optimizer, criterion)


# save model
print("resnet 152 pretrained model,30 epochs")
torch.save(resnet_152.state_dict(), "resnet152_1047_reload_4gpu_e30.pth")