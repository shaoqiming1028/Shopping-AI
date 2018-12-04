import numpy as np
import pandas as pd

# data_txt = np.loadtxt('rng_abc.txt')
# data_txtDF = pd.DataFrame(data_txt)
# data_txtDF.to_csv('rng_abc.csv',index=False)

res_dataset = np.loadtxt('/Users/mac/Downloads/MSEProject/Pytorch-dsh/evaluation/rng_abc.csv', dtype='float',delimiter=",",skiprows=0)
#res_dataset = res_dataset[1:]
print(res_dataset[0])