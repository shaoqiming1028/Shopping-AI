import os
import argparse
import torch
import torch.optim as optim
from PIL import Image
from tensorboardX import SummaryWriter

from model import *
from utils import *
from DB import Database
import csv
import sys


def hashing_loss(b, cls, m, alpha):
    """
    compute hashing loss
    automatically consider all n^2 pairs
    """
    y = (cls.unsqueeze(0) != cls.unsqueeze(1)).float().view(-1)
    dist = ((b.unsqueeze(0) - b.unsqueeze(1)) ** 2).sum(dim=2).view(-1)
    loss = (1 - y) / 2 * dist + y / 2 * (m - dist).clamp(min=0)

    loss = loss.mean() + alpha * (b.abs() - 1).abs().sum(dim=1).mean() * 2

    return loss


def train(epoch, dataloader, net, optimizer, m, alpha):
    accum_loss = 0
    net.train()
    for i, (img, cls) in enumerate(dataloader):

        #img, cls = [Variable(x.cuda()) for x in (img, cls)]
        img, cls = [Variable(x) for x in (img, cls)]


        net.zero_grad()
        b = net(img)
        loss = hashing_loss(b, cls, m, alpha)

        loss.backward()
        optimizer.step()
        accum_loss += loss.data[0]

        print(f'[{epoch}][{i}/{len(dataloader)}] loss: {loss.data[0]:.4f}')
    return accum_loss / len(dataloader)


def test(epoch, dataloader, net, m, alpha):
    accum_loss = 0
    net.eval()
    for img, cls in dataloader:
        #img, cls = [Variable(x.cuda(), volatile=True) for x in (img, cls)]
        img, cls = [Variable(x, volatile=True) for x in (img, cls)]


        b = net(img)
        loss = hashing_loss(b, cls, m, alpha)
        accum_loss += loss.data[0]

    accum_loss /= len(dataloader)
    print(f'[{epoch}] val loss: {accum_loss:.4f}')
    return accum_loss


def main():
    parser = argparse.ArgumentParser(description='train DSH')
    parser.add_argument('--cifar', default='../dataset/cifar', help='path to cifar')
    parser.add_argument('--weights', default='', help="path to weight (to continue training)")
    parser.add_argument('--outf', default='checkpoints', help='folder to output model checkpoints')
    parser.add_argument('--checkpoint', type=int, default=2, help='checkpointing after batches')

    parser.add_argument('--batchSize', type=int, default=4, help='input batch size')
    parser.add_argument('--ngpu', type=int, default=0, help='which GPU to use')

    parser.add_argument('--binary_bits', type=int, default=12, help='length of hashing binary')
    parser.add_argument('--alpha', type=float, default=0.01, help='weighting of regularizer')

    parser.add_argument('--niter', type=int, default=1, help='number of epochs to train for')
    parser.add_argument('--lr', type=float, default=0.001, help='learning rate')

    parser.add_argument('--path',type=str, default='./b.jpg', help='../../XX.jpg')

    opt = parser.parse_args()
    print(opt)

    os.makedirs(opt.outf, exist_ok=True)
    # choose_gpu(opt.ngpu)
    feed_random_seed()
    train_loader, test_loader = init_cifar_dataloader(opt.cifar, opt.batchSize)
    logger = SummaryWriter()

    # setup net
    net = DSH(opt.binary_bits)
    resume_epoch = 0
    print(net)
    if opt.weights:
        print(f'loading weight form {opt.weights}')
        resume_epoch = int(os.path.basename(opt.weights)[:-4])
        net.load_state_dict(torch.load(opt.weights, map_location=lambda storage, location: storage))

    # net.cuda()

    # setup optimizer
    # optimizer = optim.Adam(net.parameters(), lr=opt.lr, weight_decay=0.004)
    optimizer = optim.SGD(net.parameters(), lr=1e-3, weight_decay=1e-4, momentum=0.9)

    for epoch in range(resume_epoch, opt.niter):
        train_loss = train(epoch, train_loader, net, optimizer, 2 * opt.binary_bits, opt.alpha)
        logger.add_scalar('train_loss', train_loss, epoch)

        test_loss = test(epoch, test_loader, net, 2 * opt.binary_bits, opt.alpha)
        logger.add_scalar('test_loss', test_loss, epoch)

        if epoch % opt.checkpoint == 0:
            # compute mAP by searching testset images from trainset
            trn_binary, trn_label = compute_result(train_loader, net)
            tst_binary, tst_label = compute_result(test_loader, net)
            mAP = compute_mAP(trn_binary, tst_binary, trn_label, tst_label)
            print(f'[{epoch}] retrieval mAP: {mAP:.4f}')
            logger.add_scalar('retrieval_mAP', mAP, epoch)

            # change the learning rate
            optimizer = optim.SGD(net.parameters(), lr=((1e-3)-epoch*(1e-4)), weight_decay=1e-4, momentum=0.9)
            print((1e-3)-epoch*(1e-4))

            # save checkpoints
            torch.save(net.state_dict(), os.path.join(opt.outf, f'{epoch:03d}.pth'))

    # image search
    train_tf = tfs.Compose([
        tfs.RandomResizedCrop(224),
        tfs.RandomHorizontalFlip(),
        tfs.ToTensor(),
        tfs.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # 使用 ImageNet 的均值和方差
    ])

    # read the csv and save the information
    net.eval()
    #db = Database()
    #print (str(db.data.img))


    # for img in range(len(db.data.img)):
    #     irm_image = Image.open(str(db.data.img))
    #     irm = train_tf(irm_image).unsqueeze(0)
    #     #irm += net(Variable(irm))
    #
    # print (irm)


    query_pic = Image.open(opt.path)
    query_pic = train_tf(query_pic).unsqueeze(0)
    #print (query_pic.size())
    outputs= net(Variable(query_pic))
    #print (outputs.data.cpu().numpy()[0])

    query_binary = (outputs[0] > 0.005).data.numpy()
    #query_binary = torch.from_numpy(query_binary)

    query_result = np.count_nonzero(query_binary != trn_binary, axis=1)
    sort_indices = np.argsort(query_result)
    # print(query_binary)
    #print (outputs[0])
    #print (trn_binary)
    #print (trn_label)
    # print (query_binary)
    #print (query_result)
    #print (sort_indices)

    #print ("---------************-------------")
    csv_file = csv.reader(open('data.csv','r'))
    ind_file = []

    for iter in csv_file:
        ind_file.append(iter)

    del ind_file[0]
    imlist = [ind_file[index][1] for i, index in enumerate(sort_indices[0:3])]
    #
    # imlist = []
    # for i,index in enumerate(sort_indices[0:3]):
    #     print (ind_file[index])

    print (imlist[0]+","+imlist[1]+","+imlist[2])


if __name__ == '__main__':
    main()
