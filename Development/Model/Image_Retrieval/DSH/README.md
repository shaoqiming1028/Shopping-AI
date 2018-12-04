# DSH Pytorch model for image retrieval
Thank you for the original resource from [DSH-pytorch](https://github.com/weixu000/DSH-pytorch)

PyTorch implementation of paper [Deep Supervised Hashing for Fast Image Retrieval](https://www.cv-foundation.org/openaccess/content_cvpr_2016/papers/Liu_Deep_Supervised_Hashing_CVPR_2016_paper.pdf)

And thanks to [This repo on TensorFlow](https://github.com/yg33717/DSH_tensorflow)

### Changes

In our project, we changed the original network with **MobileNet** which was used in the last semester. And we used customized dataset that includes 28 different Coles products. The experiment is still in progress.

### How to Run

Run directly with CIFAR-10 dataset.
```
python main.py
```
Run with command line.
```
pyhon main.py -h
```

