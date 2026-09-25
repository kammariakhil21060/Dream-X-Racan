import urllib.request,re,pathlib
root=pathlib.Path(__file__).resolve().parent.parent/'public'/'fonts'
root.mkdir(exist_ok=True)
css=[]
for query,name in [('DM+Sans:wght@400;500;600;700','Racan Sans'),('Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400','Racan Serif')]:
 text=urllib.request.urlopen('https://fonts.googleapis.com/css2?family='+query+'&display=swap').read().decode()
 for i,url in enumerate(dict.fromkeys(re.findall(r'url\((https[^)]+)\)',text))):
  filename=name.lower().replace(' ','-')+'-'+str(i)+'.woff2'
  urllib.request.urlretrieve(url,root/filename)
  text=text.replace(url,'/fonts/'+filename)
 text=re.sub(r"font-family: '[^']+'", "font-family: '"+name+"'",text)
 css.append(text)
(root/'fonts.css').write_text('\n'.join(css))
print('Fonts downloaded locally')
for family in ['dmsans','cormorantgaramond']:
 urllib.request.urlretrieve('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt',root/(family+'-OFL.txt'))
