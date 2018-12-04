import time
from functools import wraps
import numpy as np
import torch
import torch.backends.cudnn as cudnn
from torch.autograd import Variable
from torch.utils.data import DataLoader
#from torchvision import transforms as tfs
from torchvision.datasets import ImageFolder
from torchvision.datasets.cifar import CIFAR10
#import torchvision.transforms as transforms
from torchvision import transforms as tfs


def init_cifar_dataloader(root, batchSize):
    """load dataset"""
    # normalize = transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
    # transform_train = transforms.Compose([
    #     transforms.RandomHorizontalFlip(),
    #     transforms.ToTensor(),
    #     normalize
    # ])
    # transform_test = transforms.Compose([
    #     transforms.ToTensor(),
    #     normalize
    # ])


    # train_set = ImageFolder('/home/yang/dataset/imagenet/fruits/train_5', transform_train)
    # valid_set = ImageFolder('/home/yang/dataset/imagenet/fruits/val50_5', transform_test)

    # train_loader = DataLoader(train_set,
    #                           batch_size=batchSize, shuffle=True, num_workers=4, pin_memory=True)
    # print(f'train set: {len(train_loader.dataset)}')
    # test_loader = DataLoader(valid_set,
    #                          batch_size=batchSize * 8, shuffle=False, num_workers=4, pin_memory=True)
    # print(f'val set: {len(test_loader.dataset)}')
    train_tf = tfs.Compose([
        tfs.RandomResizedCrop(224),
        tfs.RandomHorizontalFlip(),
        tfs.ToTensor(),
        tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # 使用 ImageNet 的均值和方差
    ])

    valid_tf = tfs.Compose([
        #tfs.Resize(256),
        tfs.CenterCrop(224),
        tfs.ToTensor(),
        tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

        #  Define dataset using ImageFolder
    train_set = ImageFolder('/home/yang/dataset/imagenet/fruits/origin_5', train_tf)
    valid_set = ImageFolder('/home/yang/dataset/imagenet/fruits/val50_5', valid_tf)
    # train_set = ImageFolder('/home/yang/dataset/imagenet/fruits/train_5', train_tf)
    # valid_set = ImageFolder('/home/yang/dataset/imagenet/fruits/val50_5', valid_tf)
    #  DataLoader Iterator
    train_data = DataLoader(train_set, 64, True, num_workers=4)
    valid_data = DataLoader(valid_set, 8, False, num_workers=4)


    return train_data, valid_data


def timing(f):
    """print time used for function f"""

    @wraps(f)
    def wrapper(*args, **kwargs):
        time_start = time.time()
        ret = f(*args, **kwargs)
        print(f'total time = {time.time() - time_start:.4f}')
        return ret

    return wrapper


def compute_result(dataloader, net):
    bs, clses = [], []
    net.eval()
    for img, cls in dataloader:
        clses.append(cls)
        with torch.no_grad():
            bs.append(net(Variable(img.cuda())).data.cpu())
    return torch.sign(torch.cat(bs)), torch.cat(clses)


@timing
def compute_mAP(trn_binary, tst_binary, trn_label, tst_label):
    """
    compute mAP by searching testset from trainset
    https://github.com/flyingpot/pytorch_deephash
    """
    for x in trn_binary, tst_binary, trn_label, tst_label: x.long()

    AP = []
    Ns = torch.arange(1, trn_binary.size(0) + 1)
    for i in range(tst_binary.size(0)):
        query_label, query_binary = tst_label[i], tst_binary[i]
        _, query_result = torch.sum((query_binary != trn_binary).long(), dim=1).sort()
        correct = (query_label == trn_label[query_result]).float()
        P = (torch.cumsum(correct, dim=0) / Ns).float()
        AP.append(torch.sum(P * correct) / torch.sum(correct))
    mAP = torch.mean(torch.Tensor(AP))
    return mAP


def choose_gpu(i_gpu):
    """choose current CUDA device"""
    torch.cuda.device(i_gpu).__enter__()
    cudnn.benchmark = True


def feed_random_seed(seed=np.random.randint(1, 10000)):
    """feed random seed"""
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
