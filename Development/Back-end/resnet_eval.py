import csv
import torch
import torch.nn as nn
# import torch.nn.functional as F
# import torch.optim as optim
# from torch.utils.data import DataLoader
# import numpy as np
# import torchvision
from torchvision import datasets, models, transforms
from PIL import Image
# from torch.autograd import Variable
# import time
# import os
import concurrent.futures
import pandas as pd
import sys

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

# # 1.2 Load eval dataset
# Path_dataset = "/Users/mac/Downloads/MSEProject/Pytorch-dsh/images_rename/"
# batch_size = 1
# num_workers = 1
# eval_dataset = datasets.ImageFolder(Path_dataset, data_transforms)
# dataloader_dict = DataLoader(eval_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)

# 1.3 Single input image
Path_image = sys.argv[1]
input_img = Image.open(Path_image)
#print(input_img)
input_img = data_transforms(input_img).unsqueeze(
    0
)  # here unsqueeze transfer the 3D tensor [3, 224, 224] into 4D tensor [1, 3, 224, 224] for evaluation
#print(input_img.size())

# 2. load Pretrained model and Finetune, works for Resnet, Densenet
# 2.1 load pretrained model
#model = models.resnet152(pretrained=True)

# load self pretrained densenet
model = models.resnet152(pretrained=False)
model.fc = nn.Linear(2048, 1047)
model = torch.nn.DataParallel(model)
params = torch.load(
    '/Users/mac/Downloads/MSEProject/Pytorch-dsh/resnet152_1047_reload_4gpu_e30.pth',
    map_location='cpu')
model.load_state_dict(params)

# 2.2 Finetune: remove the last layer of model, in order to extract high dimension feature
# children(): returns an iterator over immediate children modules
#new_model = torch.nn.Sequential(*(list(model.children())[:-1]))
new_model = torch.nn.Sequential(
    *(list(model.module.children())[:-1])
)  # if you have transform the model to DataParallel, add .module before get the children
#print(new_model)

# 2.3 load model to device
new_model = new_model.to(device)
#new_densenet = new_densenet.cuda('cuda:0')

# 2.4 set the model to evaluation mode
new_model.eval()

# # 3. Evaluate Image
# # 3.1 Dataset
# output_dataset = []
# for im, label in dataloader_dict:
#     print(im.size())
#     with torch.no_grad():
#         im = im.to(device)
#         label = label.to(device)
#         #output_dataset = new_model(im)
#         output_dataset.append(new_model(im))
#
output_img = new_model(input_img)

#
# #print(output_img.size())


def retrieval(output_img):
    # 3.2 Average pool 2D operation applied
    # output_dataset = torch.cat(output_dataset)
    # res_dataset = output_dataset.squeeze()

    # np.savetxt('rng_abc.txt', np.array(res_dataset), fmt='%.6f')

    res_img = output_img.squeeze()
    # # #print(res_dataset.size())
    #
    # 3.3 Calculate cosine similarity

    res_dataset = pd.read_csv(
        '/Users/mac/Downloads/Web-Mobile/ig.csv',
        dtype='float',
        delimiter=",",
        skiprows=0).values
    #res_dataset = np.loadtxt('/Users/mac/Downloads/MSEProject/Pytorch-dsh/evaluation/rng.csv', dtype='float')

    #print(len(res_dataset[0]))
    cos = nn.CosineSimilarity(dim=-1, eps=1e-8)
    # results.append(F.cosine_similarity(img_output[0], tens))
    results = cos(torch.from_numpy(res_dataset).float(), res_img.data)

    # print(len(results))
    # print(results.detach().numpy().tolist().index(1))

    # 4. Sort
    sorted, indices = torch.sort(results, descending=True)
    #print(indices)
    #print(sorted)

    # 5. Top3
    csv_file = csv.reader(
        open('/Users/mac/Downloads/Web-Mobile/igdb.csv', 'r'))
    ind_file = []

    for iter in csv_file:
        ind_file.append(iter)

    # del ind_file[0]
    # print (ind_file[1])
    imlist = [ind_file[index][1] for i, index in enumerate(indices[0:14])]

    #
    # imlist = []
    # for i,index in enumerate(sort_indices[0:3]):
    #     print (ind_file[index])

    final = []

    for i in range(13):
        if (imlist[i] != imlist[i + 1]) and (imlist[i] not in final):
            final.append(imlist[i])
    #print(final)

    print(final[0] + "," + final[1] + "," + final[2])


with concurrent.futures.ProcessPoolExecutor() as executor:
    executor.map(retrieval, output_img)
