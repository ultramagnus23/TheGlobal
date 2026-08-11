'use client';
import { useEffect, useRef } from 'react';

export default function IndiaMap() {
  const ref = useRef(null);
  useEffect(() => {

  const root=ref.current; if(!root) return;
  const g=root.querySelector('#mapgrid'), r=root.querySelector('#routes'), n=root.querySelector('#nodes');
  if(!g) return;
  let s='';
  for(let x=20;x<600;x+=30) s+='<line class="grid-l" x1="'+x+'" y1="0" x2="'+x+'" y2="700"/>';
  for(let y=20;y<700;y+=30) s+='<line class="grid-l" x1="0" y1="'+y+'" x2="600" y2="'+y+'"/>';
  g.innerHTML=s;
  const hub={x:228,y:200,name:'Jaipur'};
  const cities=[
    {x:272,y:172,name:'Delhi'},{x:196,y:296,name:'Ahmedabad'},{x:196,y:392,name:'Mumbai'},
    {x:290,y:352,name:'Nagpur'},{x:270,y:440,name:'Hyderabad'},{x:322,y:512,name:'Chennai'},
    {x:276,y:530,name:'Bengaluru'},{x:262,y:588,name:'Kochi'},{x:322,y:216,name:'Lucknow'},
    {x:418,y:282,name:'Kolkata'},{x:498,y:206,name:'Guwahati'},{x:246,y:120,name:'Amritsar'},
    {x:236,y:250,name:'Indore'},{x:352,y:330,name:'Raipur'}
  ];
  let rp='',np='';
  cities.forEach((c,i)=>{
    const mx=(hub.x+c.x)/2 + (c.y-hub.y)*0.12, my=(hub.y+c.y)/2 - (c.x-hub.x)*0.12;
    rp+='<path class="route" style="animation-delay:'+(i*0.22)+'s" d="M'+hub.x+' '+hub.y+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+c.x+' '+c.y+'"/>';
    np+='<circle class="node" cx="'+c.x+'" cy="'+c.y+'" r="2.6"/><text x="'+(c.x+7)+'" y="'+(c.y+3)+'">'+c.name+'</text>';
  });
  r.innerHTML=rp;
  n.innerHTML=np+'<circle class="ring" cx="'+hub.x+'" cy="'+hub.y+'" r="7"/><circle class="hub" cx="'+hub.x+'" cy="'+hub.y+'" r="5"/><text x="'+(hub.x+10)+'" y="'+(hub.y+4)+'" style="fill:var(--clay-lift)">Jaipur HQ</text>';

  }, []);

  return (
    <div className="map reveal" ref={ref}>
      <svg viewBox="0 0 600 700" role="img" aria-label="Map of India showing dispatch routes from Jaipur">
        <g id="mapgrid" />
        <path className="land" d="M250 38 L288 52 L302 88 L352 96 L402 112 L432 142 L472 130 L508 150 L546 162 L556 196 L520 208 L506 242 L470 236 L454 214 L430 226 L410 266 L394 302 L380 332 L364 382 L344 442 L330 502 L314 562 L300 612 L290 656 L266 600 L250 540 L234 480 L214 430 L194 390 L174 350 L158 300 L150 258 L120 254 L100 224 L130 214 L150 194 L176 206 L190 168 L216 150 L226 108 Z" />
        <g id="routes" />
        <g id="nodes" />
      </svg>
    </div>
  );
}
