import urllib.request, concurrent.futures, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / 'public'
sources={'hero':'photo-1539109136881-3be0616acf4b','dress':'photo-1515372039744-b8f02a3ae446','pink':'photo-1483985988355-763728e1935b','women':'photo-1483985988355-763728e1935b','linen':'photo-1534528741775-53994a69daeb','street':'photo-1483985988355-763728e1935b','bag':'photo-1584917865442-de89df76afd3','jewel':'photo-1611652022419-a9419f74343d','shoes':'photo-1543163521-1bf539c55dd2','beauty':'photo-1596462502278-27bfdc403348','ethnic':'photo-1610030469983-98e550d6193c','top':'photo-1551803091-e20673f15770','portrait':'photo-1531123897727-8f129e1688ce'}
def fetch(item):
 name,photo=item
 target=root/'images'/f'{name}.jpg'
 target.parent.mkdir(parents=True,exist_ok=True)
 if target.exists(): return name+' cached'
 urllib.request.urlretrieve('https://images.unsplash.com/'+photo+'?auto=format&fit=crop&w=1200&q=85',target)
 return name+' OK'
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for result in ex.map(fetch,sources.items()): print(result)

(root/"videos").mkdir(exist_ok=True)
video=root/"videos"/"fashion.mp4"
if not video.exists(): urllib.request.urlretrieve("https://assets.mixkit.co/videos/52281/52281-720.mp4",video)
