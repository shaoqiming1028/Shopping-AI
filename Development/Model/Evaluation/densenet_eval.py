import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader
import numpy as np
import torchvision
from torchvision import datasets, models, transforms
from PIL import Image
from torch.autograd import Variable
import time 
import os

# Check Pytorch and Torchvision Version
#print("PyTorch Version: ",torch.__version__)
#print("Torchvision Version: ",torchvision.__version__)

# Check GPU
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
#print(device)
#print(torch.cuda.device_count())

# 1. Prepare dataset
# 1.1 preprocess for normalization
data_transforms = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# 1.2 Load eval dataset
Path_dataset = "/home/yang/dataset/test"
batch_size = 10
num_workers = 4
eval_dataset = datasets.ImageFolder(Path_dataset, data_transforms)
dataloader_dict = DataLoader(eval_dataset, batch_size=batch_size, num_workers=num_workers)

# 1.3 Single input image
Path_image = "/home/yang/dataset/test/banana/IMG_20180322_173908.jpg"
input_img = Image.open(Path_image)
#print(input_img)
input_img = data_transforms(input_img).unsqueeze(0).cuda() # here unsqueeze transfer the 3D tensor [3, 224, 224] into 4D tensor [1, 3, 224, 224] for evaluation
print(input_img.size())


# 2. load Pretrained model and Finetune, works for Resnet, Densenet
# 2.1 load pretrained model
model = models.densenet161(pretrained=True)
#model = models.resnet152(pretrained=True)

# # print params in model
# print("Model's state_dict:")
# for param_tensor in model.state_dict():
#     print(param_tensor, "\t", model.state_dict()[param_tensor].size())

#check the structure of model
#print(model)

# 2.2 Finetune: remove the last layer of model, in order to extract high dimension feature
# children(): returns an iterator over immediate children modules
new_model = torch.nn.Sequential(*(list(model.children())[:-1]))

# 2.3 load model to device
new_model = new_model.to(device)
#new_densenet = new_densenet.cuda('cuda:0')

# 2.4 set the model to evaluation mode
new_model.eval()


# 3. Evaluate Image
# 3.1 Dataset
for im, label in dataloader_dict:
    print(im.size())
    with torch.no_grad():
        im = im.to(device)
        label = label.to(device)
        output_dataset = new_model(im)

output_img = new_model(input_img)
print(output_img.size())
print(output_dataset.size())
#print(output[0].size())

# for im, label in dataloader_dict:
#     #print(im.size())
#     with torch.no_grad():
#         im = im.to(device)
#         label = label.to(device)
#         output2 = new_model(im)
# #print(output2)
# dis = F.pairwise_distance(output_dataset, output2)
# #print(dis)

# 3.2 Average pool 2D operation applied
res_dataset = F.avg_pool2d(output_dataset, kernel_size=7, stride=1).squeeze()
res_img = F.avg_pool2d(output_img, kernel_size=7, stride=1).squeeze()
print(res_dataset.size())
print(res_img.size())

# 3.3 Calculate cosine similarity
cos = nn.CosineSimilarity(dim=-1,eps=1e-6)
#results.append(F.cosine_similarity(img_output[0], tens))
results = cos(res_dataset,res_img)
    
print(len(results))
print(results)

# 4. Sort
sorted, indices = torch.sort(results, descending=True)
print(indices)

