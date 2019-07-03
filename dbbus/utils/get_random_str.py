import uuid
import hashlib
 
def get_random_str():
    #获取uuid的随机数
    uuid_val = uuid.uuid4()
    #获取uuid的随机数字符串
    uuid_str = str(uuid_val).encode('utf-8')
    #获取md5实例
    md5 = hashlib.md5()
    #拿取uuid的md5摘要
    md5.update(uuid_str)
    #返回固定长度的字符串
    return md5.hexdigest()
