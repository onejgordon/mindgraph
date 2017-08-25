import os



def on_dev_server():
    if 'Development' == os.environ['SERVER_SOFTWARE'][:11]:
        return True
    else:
        return False
