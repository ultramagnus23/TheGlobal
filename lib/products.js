export const ROOMS = ['Bathroom','Kitchen','Living room','Bedroom','Balcony & terrace','Outdoor & garden','Whole house'];

export const DEFAULTS = [
{b:'astral',n:'CPVC Pro hot & cold pipe',t:'Water supply',s:'15mm to 50mm',d:'Rated for continuous hot water, the default for internal supply lines in a home.',r:['Bathroom','Kitchen','Whole house'],img:''},
{b:'astral',n:'Aquasafe UPVC plumbing',t:'Water supply',s:'20mm to 110mm',d:'Cold water lines for long horizontal runs and terrace to tank feeds.',r:['Whole house','Balcony & terrace','Outdoor & garden'],img:''},
{b:'astral',n:'SWR drainage system',t:'Drainage',s:'75mm to 160mm',d:'Soil, waste and rainwater removal with ring fit joints that survive a building settling.',r:['Bathroom','Kitchen','Balcony & terrace','Whole house'],img:''},
{b:'astral',n:'Underground drainage pipe',t:'Drainage',s:'110mm to 400mm',d:'Buried sewer and stormwater lines out to the municipal connection.',r:['Outdoor & garden','Whole house'],img:''},
{b:'astral',n:'Rainwater drainage system',t:'Drainage',s:'75mm to 110mm',d:'Roof outlets, downtakes and gutters sized for a monsoon burst.',r:['Balcony & terrace','Outdoor & garden'],img:''},
{b:'astral',n:'Aquarius water tank',t:'Storage',s:'500L to 5000L',d:'Multi layer tanks with a UV stable outer skin, terrace or plinth mounted.',r:['Balcony & terrace','Whole house'],img:''},
{b:'astral',n:'Bore well column pipe',t:'Storage',s:'32mm to 100mm',d:'Threaded column pipes for submersible pumps, tested for deep set installs.',r:['Outdoor & garden','Whole house'],img:''},
{b:'astral',n:'Flexible garden hose',t:'Outdoor',s:'12mm to 25mm',d:'Reinforced hose for landscaping, washdown and general site use.',r:['Outdoor & garden'],img:''},
{b:'astral',n:'Solvent cement & primer',t:'Adhesives',s:'50ml to 5L',d:'Joint solvents and sealants matched to each pipe system.',r:['Whole house','Bathroom','Kitchen'],img:''},
{b:'astral',n:'Fire sprinkler CPVC',t:'Fire safety',s:'20mm to 80mm',d:'Listed sprinkler piping for residential and light hazard commercial floors.',r:['Whole house'],img:''},
{b:'astral',n:'Valves & brass fittings',t:'Fittings',s:'15mm to 50mm',d:'Ball valves, elbows, tees and transitions across the CPVC and UPVC ranges.',r:['Bathroom','Kitchen','Whole house'],img:''},
{b:'somany',n:'Large format glazed vitrified tile',t:'Floor tile',s:'800x1600mm',d:'Fewer joints across an open floor, so the room reads as one surface.',r:['Living room','Bedroom','Whole house'],img:''},
{b:'somany',n:'Anti skid bathroom floor tile',t:'Floor tile',s:'300x300mm',d:'Textured slip resistant body for wet floors, with a matching wall series.',r:['Bathroom'],img:''},
{b:'somany',n:'Wood finish plank tile',t:'Floor tile',s:'200x1200mm',d:'The warmth of timber with the maintenance of ceramic.',r:['Bedroom','Living room'],img:''},
{b:'somany',n:'Heavy duty parking tile',t:'Floor tile',s:'400x400mm',d:'Thick body tiles rated for vehicle load, driveways and open terraces.',r:['Outdoor & garden','Balcony & terrace'],img:''},
{b:'somany',n:'Balcony & deck tile',t:'Floor tile',s:'600x600mm',d:'Matt anti skid finish that stays cool enough to walk on in May.',r:['Balcony & terrace','Outdoor & garden'],img:''},
{b:'somany',n:'Kitchen wall & backsplash tile',t:'Wall tile',s:'300x600mm',d:'Glazed wall tiles that clean up after oil and steam without dulling.',r:['Kitchen'],img:''},
{b:'somany',n:'Facade & feature slab',t:'Wall tile',s:'800x2400mm',d:'Large slabs for feature walls, elevations and reception counters.',r:['Living room','Outdoor & garden'],img:''},
{b:'somany',n:'Wall hung WC & concealed cistern',t:'Sanitaryware',s:'Full range',d:'Frees the floor and makes cleaning a bathroom considerably quicker.',r:['Bathroom'],img:''},
{b:'somany',n:'Wash basin & counter top',t:'Sanitaryware',s:'Full range',d:'Table top, under counter and pedestal basins across finishes.',r:['Bathroom'],img:''},
{b:'somany',n:'Faucets & shower systems',t:'Bath fittings',s:'Full range',d:'Single lever mixers, diverters and overheads in one matched finish family.',r:['Bathroom','Kitchen'],img:''},
{b:'somany',n:'Kitchen sink & pull out mixer',t:'Bath fittings',s:'Single & double bowl',d:'Stainless sinks sized for Indian utensil loads.',r:['Kitchen'],img:''},
{b:'somany',n:'Tile adhesive & grout',t:'Adhesives',s:'20kg bags',d:'Polymer adhesives and stain resistant grout matched to format and substrate.',r:['Whole house','Bathroom','Kitchen'],img:''}
];

const KEY = 'tg_products_v1';

export function loadProducts() {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const j = JSON.parse(raw);
      if (Array.isArray(j) && j.length) return j;
    }
  } catch (e) {}
  return DEFAULTS.map((p) => ({ ...p }));
}

export function saveProducts(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      msg: e && e.name === 'QuotaExceededError'
        ? 'Browser storage is full. Use smaller images or fewer products, then export a backup.'
        : 'This browser is blocking local storage, so changes will not survive a refresh. Export a backup instead.'
    };
  }
}
