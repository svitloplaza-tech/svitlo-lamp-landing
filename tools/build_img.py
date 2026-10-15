# Обробка фото виробника: обрізка англ. тексту/логотипу, видалення графіки, WebP
import cv2, numpy as np
from PIL import Image
S='tools/src-photos/'; O='public/assets/img/'
def save(arr_bgr,name,w=None,q=78):
    im=Image.fromarray(cv2.cvtColor(arr_bgr,cv2.COLOR_BGR2RGB))
    if w and im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(O+name+'.webp','WEBP',quality=q,method=6); print(name,im.size)
a=cv2.imread(S+'1.jpg'); save(a[0:560,:],'kitchen')
b=cv2.imread(S+'2.jpg'); hsv=cv2.cvtColor(b,cv2.COLOR_BGR2HSV)
m=cv2.inRange(hsv,(95,90,90),(125,255,255)); m=cv2.dilate(m,np.ones((5,5),np.uint8),2)
b=cv2.inpaint(b,m,6,cv2.INPAINT_TELEA); save(b[120:600,0:600],'sensor')
c=cv2.imread(S+'3.jpg')
for k,(x,y) in enumerate([(10,10),(270,10),(530,10),(10,322),(270,322)]): save(c[y:y+308,x:x+256],f'stairs-{k+1}')
d=cv2.imread(S+'4.jpg')
for t,(x,y) in zip([2700,3500,4500,5000,6500],[(18,430),(401,225),(18,225),(401,20),(18,20)]): save(d[y:y+200,x:x+380],f'temp-{t}')
