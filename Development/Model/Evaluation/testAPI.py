import torch
import torch.nn as nn
import torch.nn.functional as F

# x = torch.tensor([1,2,3,4])
# print(torch.unsqueeze(x,-2))

# m = nn.BatchNorm2d(100, affine=False)
# input = torch.randn(20, 100, 35, 45)
# output = m(input)
# print(output.size())

# input1 = torch.randn(1, 100, 128)
# input2 = torch.randn(1, 100, 128)
# print(input1.dim())
# output2 = F.cosine_similarity(input1, input2, 1)
# #print(output2)
# print(output2.size())


# input1 = torch.randn(3,4,1, 1)
# input2 = torch.randn(1,4,1, 1)
# tmp1 = input1.squeeze()
# tmp2 = input2.squeeze()
# print(tmp1.view(4,-1))
# print(tmp1)
# #print(input1[1][0])
# print(tmp2)
# cos = nn.CosineSimilarity(dim=-1, eps=1e-6)
# output = cos(tmp1, tmp2)
# print(output.size())


# # pool of square window of size=3, stride=2
# m = nn.AvgPool2d(3, stride=1)
# # pool of non-square window
# #m = nn.AvgPool2d((3, 2), stride=(2, 1))
# input = torch.randn(1, 2, 3, 3)
# output = m(input)
# print(output)

# torch.cat()
x = torch.randn(2, 3)
print(x)
x = torch.cat(x)
print(x)