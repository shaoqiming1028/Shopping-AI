import numpy as np
import torch
import sys
from torchvision import models
from torchvision import transforms as tfs
from torchvision.datasets import ImageFolder
from mobile_train import train

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

valid_tf = tfs.Compose([
    tfs.Resize(256),
    tfs.CenterCrop(224),
    tfs.ToTensor(),
    tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

#  Define dataset using ImageFolder
# train_set = ImageFolder('/Users/mac/Downloads/MSEProject/train/', train_tf)
valid_set = ImageFolder('./val', valid_tf)
#  DataLoader Iterator
# train_data = DataLoader(train_set, 64, True, num_workers=4)
valid_data = DataLoader(valid_set, 8, False, num_workers=4)

#  Mobilenet
class MobileNet(nn.Module):
    def __init__(self):
        super(MobileNet, self).__init__()

        # Normal convolution block followed by Batchnorm (CONV_3x3-->BN-->Relu)
        def conv_bn(inp, oup, stride):
            return nn.Sequential(
                nn.Conv2d(inp, oup, 3, stride, 1, bias=False),
                nn.BatchNorm2d(oup),
                nn.ReLU(inplace=True)
            )

        # Depthwise convolution block (CONV_BLK_3x3-->BN-->Relu-->CONV_1x1-->BN-->Relu)
        def conv_dw(inp, oup, stride):
            return nn.Sequential(
                nn.Conv2d(inp, inp, 3, stride, 1, groups=inp, bias=False),
                nn.BatchNorm2d(inp),
                nn.ReLU(inplace=True),

                nn.Conv2d(inp, oup, 1, 1, 0, bias=False),
                nn.BatchNorm2d(oup),
                nn.ReLU(inplace=True),
            )

        self.model = nn.Sequential(
            conv_bn(3, 32, 2),
            conv_dw(32, 64, 1),
            conv_dw(64, 128, 2),
            conv_dw(128, 128, 1),
            conv_dw(128, 256, 2),
            conv_dw(256, 256, 1),
            conv_dw(256, 512, 2),
            conv_dw(512, 512, 1),
            conv_dw(512, 512, 1),
            conv_dw(512, 512, 1),
            conv_dw(512, 512, 1),
            conv_dw(512, 512, 1),
            conv_dw(512, 1024, 2),
            conv_dw(1024, 1024, 1),
            nn.AvgPool2d(7),
        )
        self.fc = nn.Linear(1024, 1000)

    def forward(self, x):
        x = self.model(x)
        x = x.view(-1, 1024)
        x = self.fc(x)
        return x

model = MobileNet()
#print(model)

model = torch.nn.DataParallel(model)

#params = torch.load('model_trained.pth.tar', map_location=lambda storage, loc: storage)
    #torch.load('model_trained.pth.tar',map_location='cpu')#['state_dict']
#model.load_state_dict(params)

# original saved file with DataParallel
params = torch.load('mobienet_30e.pth.tar',map_location=lambda storage, loc: storage)

model_dict = model.state_dict()

# 1. filter out unnecessary keys
pretrained_dict = {k: v for k, v in params.items() if k in model_dict}
# 2. overwrite entries in the existing state dict
model_dict.update(pretrained_dict)
# 3. load the new state dict
model.load_state_dict(model_dict)

# # create new OrderedDict that does not contain `module.`
# from collections import OrderedDict
# new_state_dict = OrderedDict()
# for k, v in state_dict.items():
#     name = k[7:] # remove `module.`
#     new_state_dict[name] = v
# # load params
# model.load_state_dict(new_state_dict)

#  Final layer --->  5 classes
#model.fc = nn.Linear(1024, 5)
#criterion = nn.CrossEntropyLoss()
#optimizer = torch.optim.SGD(model.parameters(), lr=1e-2, weight_decay=1e-4)
#train(model, train_data, valid_data, 1, optimizer, criterion)

#  Change Mobilenet into evaluation model
model = model.eval()

im1 = Image.open(sys.argv[1])


#  Pretreatment
im = valid_tf(im1)
out = model(Variable(im.unsqueeze(0)))
pred_label = out.max(1)[1].data[0]
#pred_label = out.max(1)
#print('predict label: {}'.format(valid_set.classes[pred_label]))
#file = open('／home/ubuntu/project/result.txt','w')
#file.write('predict label: {}'.format(valid_set.classes[pred_label]))
print(valid_set.classes[pred_label])


