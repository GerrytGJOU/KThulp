/* Laadt de Castra-scripts in Node met een minimale DOM-stub (voor kalibratie en tests van het Colosseum).
   require("./castra-colo-node.js") geeft { ctx, errs, scripts, load } — load(extra) maakt een nieuwe, losse wereld
   (bijv. een tweede speler); extra = extra globals zoals { fbDB, setInterval }. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const scripts = ["castra.js"].concat([...html.matchAll(/<script src="(castra-[a-z-]+\.js)[^"]*"/g)].map(m=>m[1]));
function load(extra){
  const store = {};
  const stub = new Proxy(function(){}, { get:(t,k)=> k===Symbol.toPrimitive ? ()=>"" : stub, apply:()=>stub, set:()=>true });
  const ctx = Object.assign({ console, Math, Date, JSON, Object, Array, String, Number, Set, Map, Promise, setTimeout:()=>0, clearTimeout(){}, setInterval:()=>0, clearInterval(){},
    localStorage:{ getItem:k=>store[k]===undefined?null:store[k], setItem:(k,v)=>{store[k]=String(v);}, removeItem:k=>{delete store[k];} },
    location:{ search:"?dev", href:"" }, navigator:{ userAgent:"node" }, document:stub, Image:function(){ return stub; }, requestAnimationFrame:()=>0, addEventListener(){}, removeEventListener(){},
    el:()=>null, esc:s=>String(s), confirm:()=>true, H(){} }, extra||{});
  ctx.window = ctx; vm.createContext(ctx);
  const errs = [];
  vm.runInContext("var CASTRA_B=null; var SCREENS={}; var _screen=''; function go(n){ _screen=n; } function toast(){}", ctx);
  scripts.forEach(f=>{ try{ vm.runInContext(fs.readFileSync(path.join(dir,f),"utf8").replace(/^const |^let /gm, m=>"var "), ctx, { filename:f }); }catch(e){ errs.push(f+": "+e.message.split("\n")[0]); } });
  return { ctx, errs };
}
const base = load();
module.exports = { ctx:base.ctx, errs:base.errs, scripts, load };
if(require.main===module){ console.log("scripts:", scripts.length, "fouten:", base.errs); }
