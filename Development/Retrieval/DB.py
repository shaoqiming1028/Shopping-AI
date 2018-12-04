from __future__ import print_function

import pandas as pd
import os

DB_dir = 'images'
DB_csv = 'data_test.csv'

class Database(object):

  def __init__(self):
    self._gen_csv()

    # self.data = pd.read_csv(DB_csv,error_bad_lines=False)
    # self.data = pd.read_csv(DB_csv)
    # self.classes = set(self.data["cls"])

  def _gen_csv(self):
    if os.path.exists(DB_csv):
      return
    with open(DB_csv, 'w', encoding='UTF-8') as f:
      f.write("img,cls")
      for root, _, files in os.walk(DB_dir, topdown=False):
        root = root.replace('\r', '').replace('\n', '').replace('\t', '')
        cls = root.split('/')[-1]

        for name in files:
          if not name.endswith('.jpg'):
              if name == ".DS_Store":
                continue
              #print ("error!!!" + name)
              name = name.split(".")
              name[-1] = "jpg"

              name = str.join(".", name)
              #print (name)
              #print(count)

          img = os.path.join(root, name)
          f.write("\n{},{}".format(img, cls))


  # def __len__(self):
  #   return len(self.data)
  #
  # def get_class(self):
  #   return self.classes
  #
  # def get_data(self):
  #   return self.data


if __name__ == "__main__":
  db = Database()
  # data = db.get_data()
  # classes = db.get_class()
  #
  # print("DB length:", len(db))
  # print(classes)