import torch.nn as nn
import torch.nn.init as init


class DSH(nn.Module):
    def __init__(self, num_binary):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=5, padding=2),  # same padding
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),

            nn.Conv2d(32, 32, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.AvgPool2d(kernel_size=3, stride=2),

            nn.Conv2d(32, 64, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.AvgPool2d(kernel_size=3, stride=2),
        )
        self.fc = nn.Sequential(
            nn.Linear(46656, 500),
            nn.ReLU(inplace=True),

            nn.Linear(500, num_binary)
        )

        for m in self.modules():
            if m.__class__ == nn.Conv2d or m.__class__ == nn.Linear:
                init.xavier_normal(m.weight.data)
                m.bias.data.fill_(0)

    def forward(self, x):
        x = self.conv(x)
        # print(x.size())
        x = x.view(x.size(0), -1)
        # print(x.size())
        x = self.fc(x)

        return x
    # def __init__(self,num_binary):
    #     super().__init__()
    #
    #     # Normal convolution block followed by Batchnorm (CONV_3x3-->BN-->Relu)
    #     def conv_bn(inp, oup, stride):
    #         return nn.Sequential(
    #             nn.Conv2d(inp, oup, 3, stride, 1, bias=False),
    #             nn.BatchNorm2d(oup),
    #             nn.ReLU(inplace=True)
    #         )
    #
    #     # Depthwise convolution block (CONV_BLK_3x3-->BN-->Relu-->CONV_1x1-->BN-->Relu)
    #     def conv_dw(inp, oup, stride):
    #         return nn.Sequential(
    #             nn.Conv2d(inp, inp, 3, stride, 1, groups=inp, bias=False),
    #             nn.BatchNorm2d(inp),
    #             nn.ReLU(inplace=True),
    #
    #             nn.Conv2d(inp, oup, 1, 1, 0, bias=False),
    #             nn.BatchNorm2d(oup),
    #             nn.ReLU(inplace=True),
    #         )
    #
    #     self.model = nn.Sequential(
    #         conv_bn(3, 32, 2),
    #         conv_dw(32, 64, 1),
    #         conv_dw(64, 128, 2),
    #         conv_dw(128, 128, 1),
    #         conv_dw(128, 256, 2),
    #         conv_dw(256, 256, 1),
    #         conv_dw(256, 512, 2),
    #         conv_dw(512, 512, 1),
    #         conv_dw(512, 512, 1),
    #         conv_dw(512, 512, 1),
    #         conv_dw(512, 512, 1),
    #         conv_dw(512, 512, 1),
    #         conv_dw(512, 1024, 2),
    #         conv_dw(1024, 1024, 1),
    #         nn.AvgPool2d(7),
    #     )
    #     self.fc = nn.Linear(1024, num_binary)
    #
    # def forward(self, x):
    #     x = self.model(x)
    #     x = x.view(-1, 1024)
    #     x = self.fc(x)
    #     features = x
    #     result = features
    #     return result
    #     #return x