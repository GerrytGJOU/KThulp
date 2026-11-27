/* Itemcatalogus voor de Midden-aarde D&D-app (dnd/). Koppelt voorwerpnamen (Engels en Nederlands) aan een klein icoon in assets/items/.
   UMD: werkt in de browser (window.DNDItems) en in node (require('./items.js')). Geen afhankelijkheden.
   Volgorde = prioriteit: eerst de unieke voorwerpen met een eigen naam, dan de gewone groepen, dan per categorie een vangnet, tot slot "misc".
   Nieuwe groep toevoegen: node dnd/tools/items.js add <id> <categorie> <trefwoorden> <bestand>  (of handmatig in GROUPS, vóór de algemene groep).
   Trefwoorden zijn reguliere expressies zonder accenten en in kleine letters (de naam wordt eerst genormaliseerd: Lórien → lorien). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DNDItems = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var BASE = "assets/items/";
  /* [id, categorie, trefwoorden (regex-bron), bestand, uniek?] */
  var GROUPS = [
    /* --- unieke voorwerpen met een eigen naam --- */
    { id: "tent-cloth",    cat: "tool",     re: "tentdoek|waxed canvas|tent canvas|\btarp\b", file: "tent-cloth.webp", unique: true },
    { id: "saddlebags",    cat: "container",re: "zadeltas|saddle.?bags?", file: "saddlebags.webp", unique: true },
    { id: "rain-hood",     cat: "clothing", re: "regenkap|rain.?hood|oiled hood", file: "rain-hood.webp", unique: true },
    { id: "climbing-irons", cat: "tool",    re: "klimijzers?|climbing irons?|crampons?", file: "climbing-irons.webp", unique: true },
    { id: "grappling-hook", cat: "tool",    re: "^werphaak|^werpanker|^grappling hook", file: "grappling-hook.webp", unique: true },
    { id: "cloak-rivendell", cat: "clothing", re: "reismantel van rivendell|rivendell travell?ing cloak|cloak of rivendell", file: "cloak-rivendell.webp", unique: true },
    { id: "arrows-rivendell", cat: "weapon", re: "pijlen van rivendell|rivendell arrows|arrows of rivendell", file: "arrows-rivendell.webp", unique: true },
    { id: "healing-draught", cat: "drink",  re: "genezende drank|genezingsdrank|healing (potion|draught)|potion of healing", file: "healing-draught.webp", unique: true },
    { id: "rush-bracelet", cat: "clothing", re: "biezen armband|rush bracelet", file: "rush-bracelet.webp", unique: true },
    { id: "blackhewer",    cat: "weapon",   re: "blackhewer|naragfelak", file: "blackhewer.webp", unique: true },
    { id: "axe-dwarf-throwing", cat: "weapon", re: "werpbijl|dwar(f|ven) throwing axe", file: "axe-dwarf-throwing.webp", unique: true },
    { id: "ranger-token",  cat: "clothing", re: "wegteken|ranger.?token|way.?token", file: "ranger-token.webp", unique: true },
    { id: "watchstone-arnor", cat: "magic", re: "wachtsteen|watchstone|watch stone", file: "watchstone-arnor.webp", unique: true },
    { id: "honey-cakes",   cat: "food",     re: "honingkoek|honey.?cake", file: "honey-cakes.webp", unique: true },
    { id: "honey-crock",   cat: "food",     re: "\\bhoning\\b|honingkruik|honingpot|honey (jar|pot|crock)|(jar|pot|crock) of honey", file: "honey-crock.webp", unique: true },
    { id: "raven-feather", cat: "tool",     re: "raafveer|ravenveer|raven.?veer|raven.?feather", file: "raven-feather.webp", unique: true },
    { id: "athelas-vial",  cat: "drink",    re: "athelas.?aftreksel|flesje athelas|athelas (infusion|vial|draught)", file: "athelas-vial.webp", unique: true },
    { id: "herb-satchel",  cat: "container",re: "kruidentas|kruidenbuidel|kruidenzak|herb (satchel|pouch|bag)", file: "herb-satchel.webp", unique: true },
    { id: "whetstone",     cat: "tool",     re: "slijpsteen|whetstone|sharpening stone", file: "whetstone.webp", unique: true },
    { id: "arrow-cleft",   cat: "weapon",   re: "gekliefde pijl|cloven arrow|cleft arrow|split arrow", file: "arrow-cleft.webp", unique: true },
    { id: "dagger-adarion", cat: "weapon",  re: "adarion", file: "dagger-adarion.webp", unique: true },
    { id: "axe-runic",     cat: "weapon",   re: "runenbijl|runic axe|rune axe|dwarven axe|dwarf axe|erebor", file: "axe-runic.webp", unique: true },
    { id: "bow-elven",     cat: "weapon",   re: "boog van de oude oever|old bank bow|bow of the old|elven bow|elven.?boog|elvenboog", file: "bow-elven.webp", unique: true },
    { id: "sword-elven",   cat: "weapon",   re: "elven.?(short)?.?(sword|blade)|lichtlemmet|light.?blade|leaf.?blade|elven.?zwaard|elven.?lemmet", file: "sword-elven.webp", unique: true },
    { id: "cloak-elven",   cat: "clothing", re: "lorien|elven.?(cloak|mantel)|elven.?cape", file: "cloak-elven.webp", unique: true },
    { id: "armor-mithril", cat: "armor",    re: "mithril", file: "armor-mithril.webp", unique: true },
    { id: "rope-elven",    cat: "tool",     re: "hithlain|elven.?rope|elven.?touw|elventouw|silver rope|zilveren touw", file: "rope-elven.webp", unique: true },
    { id: "lembas",        cat: "food",     re: "lembas|waybread|reisbrood", file: "lembas.webp" },
    { id: "potion-flask",  cat: "drink",    re: "miruvor|cordial|potion|elixir|drankje|\\bvials?\\b|phial", file: "potion-flask.webp" },
    { id: "herb-bundle",   cat: "food",     re: "athelas|kingsfoil|koningsblad|mistletoe|maretak|\\bherbs?\\b|kruiden|\\bkruid\\b|bundel", file: "herb-bundle.webp" },
    { id: "ointment-jar",  cat: "container",re: "ointment|salve|zalf|balm|balsem|poultice", file: "ointment-jar.webp" },
    /* --- wapens --- */
    { id: "quiver-arrows", cat: "weapon",   re: "arrows?|pijlen|pijl\\b|bolts?|quiver|koker|ammunition|munitie", file: "quiver-arrows.webp" },
    { id: "crossbow",      cat: "weapon",   re: "crossbow|kruisboog", file: "crossbow.webp" },
    { id: "bow-long",      cat: "weapon",   re: "long.?bow|lange boog|langboog", file: "bow-long.webp" },
    { id: "bow-short",     cat: "weapon",   re: "jagersboog|hunting bow|short.?bow|korte boog|\\bbow\\b|\\bboog\\b|\\bbogen\\b", file: "bow-short.webp" },
    { id: "sling",         cat: "weapon",   re: "\\bsling\\b|slinger|katapult", file: "sling.webp" },
    { id: "sword-long",    cat: "weapon",   re: "long.?sword|langzwaard|bastard sword|greatsword|great sword|tweehander|claymore", file: "sword-long.webp" },
    { id: "dagger",        cat: "weapon",   re: "dagger|dolk|adarion|knife|\\bmes\\b|stiletto|\\bdirk\\b", file: "dagger.webp" },
    { id: "sword-simple",  cat: "weapon",   re: "sword|zwaard|scimitar|rapier|sabre|saber|cutlass|\\bblade\\b|lemmet|falchion", file: "sword-simple.webp" },
    { id: "axe-great",     cat: "weapon",   re: "great.?axe|battle.?axe|war.?axe|grote bijl|strijdbijl", file: "axe-great.webp" },
    { id: "axe-hand",      cat: "weapon",   re: "\\baxes?\\b|\\bbijlen?\\b|hatchet|handaxes?|\\bhand.?axes?\\b", file: "axe-hand.webp" },
    { id: "spear",         cat: "weapon",   re: "spear|speer|javelin|\\blance\\b|\\bpike\\b|glaive|halberd|trident|hellebaard", file: "spear.webp" },
    { id: "mace",          cat: "weapon",   re: "\\bmace\\b|war.?hammer|morning.?star|\\bflail\\b|\\bclub\\b|knots|\\bkolf\\b|\\bmaul\\b|hamer\\b", file: "mace.webp" },
    { id: "staff",         cat: "weapon",   re: "quarterstaff|\\bstaff\\b|\\bstaf\\b|walking stick|wandelstok|cudgel|\\bstok\\b", file: "staff.webp" },
    /* --- armor en kleding --- */
    { id: "shield-round",  cat: "armor",    re: "shield|schild|buckler", file: "shield-round.webp" },
    { id: "armor-mail",    cat: "armor",    re: "chain.?(mail|shirt)|ring.?mail|scale.?(mail|armou?r)|breastplate|half.?plate|\\bplate\\b|hauberk|brigandine|splint|maliekolder|maliën|malien|\\bmail\\b|hemd", file: "armor-mail.webp" },
    { id: "armor-leather", cat: "armor",    re: "leather.?armou?r|studded|hide.?armou?r|padded|leren harnas|lederen harnas|\\bleer\\b.*harnas|jerkin|\\barmou?r\\b|harnas", file: "armor-leather.webp" },
    { id: "helm",          cat: "armor",    re: "\\bhelm\\b|helmet|\\bhelmen\\b|iron cap|ijzeren muts", file: "helm.webp" },
    { id: "cloak",         cat: "clothing", re: "cloak|mantel|\\bcape\\b|mantle|\\bhood(ed)?\\b|capuchon", file: "cloak.webp" },
    { id: "boots",         cat: "clothing", re: "boots?|laarzen|laars|shoes|schoenen|sandals|sandalen", file: "boots.webp" },
    { id: "gloves",        cat: "clothing", re: "gloves?|handschoenen|gauntlets?|bracers?|vambraces?", file: "gloves.webp" },
    { id: "belt",          cat: "clothing", re: "\\bbelt\\b|gordel|\\briem\\b|\\bsash\\b", file: "belt.webp" },
    { id: "ring",          cat: "magic",    re: "\\brings?\\b|\\bring\\b|\\bringen\\b", file: "ring.webp" },
    { id: "amulet",        cat: "magic",    re: "amulet|pendant|necklace|ketting|hanger|brooch|broche|medallion|medaillon|holy symbol|heilig symbool|talisman", file: "amulet.webp" },
    { id: "clothes",       cat: "clothing", re: "clothes|clothing|kleding|\\bkleren\\b|tunic|tuniek|\\brobes?\\b|gewaad|\\bvest\\b|shirt|\\bhats?\\b|\\bhoed\\b|dress|trousers|broek|scarf|sjaal|\\bkap\\b|\\bcowl\\b|\\bsocks?\\b", file: "clothes.webp" },
    /* --- drank en eten --- */
    { id: "tankard",       cat: "drink",    re: "tankard|\\bmugs?\\b|\\bstein\\b|bierpul|\\bpul\\b|kroes|\\bale\\b.*cup", file: "tankard.webp" },
    { id: "wine-bottle",   cat: "drink",    re: "\\bwine\\b|wijn|\\bbottles?\\b|\\bfles\\b|\\bflessen\\b|brandy|spirits|jenever", file: "wine-bottle.webp" },
    { id: "beer-barrel",   cat: "drink",    re: "barrel|\\bkeg\\b|cask|vaatje|\\bvat\\b|\\bbier\\b|\\bbeer\\b|\\bale\\b|\\bmead\\b|\\bmede\\b|cider", file: "beer-barrel.webp" },
    { id: "bread",         cat: "food",     re: "bread|brood|honingkoek|honey.?cake|\\bkoek\\b|koeken|\\bcakes?\\b|biscuits?|\\bpie\\b|taart|\\bbun\\b|broodje", file: "bread.webp" },
    { id: "meat-cheese",   cat: "food",     re: "\\bham\\b|cheese|\\bkaas\\b|\\bmeat\\b|vlees|sausage|worst|\\bbacon\\b|jerky|\\bspek\\b", file: "meat-cheese.webp" },
    { id: "rations",       cat: "food",     re: "rations?|rantsoen|proviand|provisions|voorraad|porties|travel food|reisvoedsel|dried (fruit|meat)|gedroogd", file: "rations.webp" },
    /* --- uitrusting --- */
    { id: "healers-kit",   cat: "tool",     re: "healer|heler|bandage|first.?aid|verband|eerste hulp|medicine|medicijn", file: "healers-kit.webp" },
    { id: "herbalism-kit", cat: "tool",     re: "herbalism|kruidenkit|kruidenset|kruidenkundige", file: "herbalism-kit.webp" },
    { id: "oil-flask",     cat: "tool",     re: "\\boil\\b|\\bolie\\b|lamp.?oil", file: "oil-flask.webp" },
    { id: "tinderbox",     cat: "tool",     re: "tinder|vuursteen|\\bflint\\b|aansteker|fire.?starter", file: "tinderbox.webp" },
    { id: "torch",         cat: "tool",     re: "torch|fakkel", file: "torch.webp" },
    { id: "lantern",       cat: "tool",     re: "lantern|lantaarn|\\blamp\\b|hooded lamp", file: "lantern.webp" },
    { id: "candle",        cat: "tool",     re: "candle|kaars", file: "candle.webp" },
    { id: "waterskin",     cat: "tool",     re: "water.?skin|waterzak|veldfles|canteen|water.?flask|flask of water", file: "waterskin.webp" },
    { id: "mess-kit",      cat: "tool",     re: "mess|eetset|\\bpan\\b|cooking|kookpot|kookgerei|\\bplate\\b|\\bpot\\b", file: "mess-kit.webp" },
    { id: "bedroll",       cat: "tool",     re: "bed.?roll|slaapzak|\\bblankets?\\b|\\bdeken\\b|sleeping", file: "bedroll.webp" },
    { id: "tent",          cat: "tool",     re: "\\btent\\b|\\btarp\\b|zeil", file: "tent.webp" },
    { id: "rope",          cat: "tool",     re: "\\brope\\b|touw|\\bcord\\b|koord|hempen|grappling|enterhaak", file: "rope.webp" },
    { id: "backpack",      cat: "container",re: "back.?pack|rugzak|\\bpack\\b|knapsack|satchel|schoudertas|\\btas\\b", file: "backpack.webp" },
    { id: "coin-purse",    cat: "container",re: "purse|beurs|\\bpouch\\b|buidel|\\bcoins?\\b|munten|\\bgp\\b|goud\\b", file: "coin-purse.webp" },
    { id: "sack",          cat: "container",re: "\\bsack\\b|\\bzak\\b|\\bbag\\b|\\bzakje\\b", file: "sack.webp" },
    { id: "chest",         cat: "container",re: "chest|\\bkist\\b|koffer|trunk|casket", file: "chest.webp" },
    { id: "dice",          cat: "misc",     re: "\\bdice\\b|dobbelsteen|game set|gaming set|kaartspel|playing cards|\\bchess\\b|schaak", file: "dice.webp" },
    { id: "horn",          cat: "misc",     re: "\\bhorns?\\b|hoorn|bugle|signal horn", file: "horn.webp" },
    { id: "map-scroll",    cat: "misc",     re: "\\bmaps?\\b|\\bkaart\\b|\\bscrolls?\\b|perkament|parchment|\\bcharts?\\b", file: "map-scroll.webp" },
    { id: "letter",        cat: "misc",     re: "letter|\\bbrief\\b|\\bseal\\b|zegel|message|bericht|\\bnote\\b|document|credentials|introductiebrief", file: "letter.webp" },
    { id: "book",          cat: "misc",     re: "\\bbook\\b|\\bboek\\b|journal|dagboek|\\btome\\b|spellbook|grimoire|ledger|\\blore\\b", file: "book.webp" },
    { id: "key",           cat: "misc",     re: "\\bkeys?\\b|sleutel", file: "key.webp" },
    { id: "gem",           cat: "misc",     re: "\\bgems?\\b|jewel|juweel|edelsteen|crystal|kristal|diamond|\\bruby\\b|emerald|sapphire|amethyst|\\bpearl\\b|parel", file: "gem.webp" },
    { id: "pipe",          cat: "misc",     re: "\\bpipe\\b|pijp|pipeweed|pijpkruid|tobacco|tabak", file: "pipe.webp" },
    { id: "lute",          cat: "tool",     re: "\\blute\\b|luit|\\bharp\\b|harpe|\\blyre\\b|\\bviol\\b|fiddle|vedel|instrument|\\bdrum\\b|trom", file: "lute.webp" },
    { id: "flute",         cat: "tool",     re: "flute|fluit|whistle|panpipes?|reed pipe|schalmei|\\bpipes\\b", file: "flute.webp" },
    { id: "smith-tools",   cat: "tool",     re: "smith|smid|artisan|thieves|dieven|\\btools?\\b|gereedschap|\\bhammer\\b|\\btongs\\b", file: "smith-tools.webp" },
    { id: "pickaxe",       cat: "tool",     re: "pick.?axe|\\bpick\\b|houweel|mining|\\bmijn", file: "pickaxe.webp" },
    { id: "shovel",        cat: "tool",     re: "shovel|\\bspade\\b|schep", file: "shovel.webp" },
    { id: "crowbar",       cat: "tool",     re: "crowbar|breekijzer|koevoet", file: "crowbar.webp" },
    { id: "spyglass",      cat: "tool",     re: "spyglass|telescope|kijker|verrekijker", file: "spyglass.webp" }
  ];
  /* Vangnet per categorie: eerst een eigen herkenning op losse woorden, anders het standaardicoon van de categorie. */
  var CATS = {
    weapon:    { file: "fallback-weapon.webp",    re: "sickle|sikkel|whip|zweep|\\bnet\\b|blowgun|\\bdart|scythe|zeis|weapon|wapen|spike|knuppel|bijl|zwaard" },
    armor:     { file: "fallback-armor.webp",     re: "armou?r|harnas|\\bplate\\b|bescherm" },
    clothing:  { file: "fallback-clothing.webp",  re: "cloth|kleding|\\bhoed\\b|\\bcap\\b|muts|veil|sluier|\\bwrap\\b|jas\\b|\\bcoat\\b" },
    food:      { file: "fallback-food.webp",      re: "\\bfood\\b|\\beten\\b|fruit|apple|appel|\\bnuts?\\b|noot|\\beggs?\\b|\\bfish\\b|\\bvis\\b|soup|soep|honey|honing|\\bsweets?\\b|stew|stoof|meal|maaltijd|porridge|\\bpap\\b|vegetable|groente|spice|kruiderij|\\bsalt\\b|\\bzout\\b" },
    drink:     { file: "fallback-drink.webp",     re: "drink|drank|\\bwater\\b|\\bmilk\\b|melk|\\btea\\b|thee|\\bbrew\\b|juice|\\bsap\\b|\\bcup\\b|beker" },
    tool:      { file: "fallback-tool.webp",      re: "tools?|gereedschap|\\bkit\\b|\\bset\\b|\\bsaw\\b|zaag|needle|naald|chisel|beitel|\\bfile\\b|vijl|pliers|\\btang\\b|lockpick|fishing|hengel|compass|kompas|magnifying|vergrootglas|whetstone|slijpsteen|ladder|\\bpole\\b|\\bhook\\b|bucket|emmer|\\bink\\b|\\bquill\\b|\\binkt\\b|\\bchalk\\b|\\bsoap\\b|\\bzeep\\b|mirror|spiegel|\\bbell\\b|\\bbel\\b|manacles|handboeien|shackles|\\bchain\\b|ketting|\\bnails?\\b|spijker|hamer" },
    container: { file: "fallback-container.webp", re: "basket|\\bmand\\b|crate|\\bbox\\b|doos|\\bcase\\b|\\bjar\\b|potje|\\bvase\\b|\\bvaas\\b|\\bflask\\b|flesje|\\btube\\b|\\burn\\b|bowl|\\bkom\\b|sack|\\bbag\\b" },
    magic:     { file: "fallback-magic.webp",     re: "magisch|magic|enchanted|\\brunes?\\b|\\brunen\\b|\\bwand\\b|toverstaf|\\bfocus\\b|charm|relic|artefact|artifact|\\borb\\b|\\bscepter|sceptre|\\brod\\b" },
    misc:      { file: "fallback-misc.webp",      re: "" }
  };
  var CAT_ORDER = ["magic", "weapon", "armor", "clothing", "drink", "food", "container", "tool"];
  GROUPS.forEach(function (g) { g.rx = new RegExp(g.re); });
  Object.keys(CATS).forEach(function (k) { CATS[k].rx = CATS[k].re ? new RegExp(CATS[k].re) : null; });

  /* Naam → ontdaan van accenten, hoofdletters, hoeveelheden en de magische notitie ("Naam [magisch: effect]"). */
  function norm(name) {
    var s = String(name == null ? "" : name);
    var magic = /\[\s*magisch/i.test(s);
    s = s.replace(/\[[^\]]*\]/g, " ");
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) {}
    s = s.toLowerCase().replace(/[’`]/g, "'").replace(/'s\b/g, "").replace(/'/g, "");
    s = s.replace(/^\s*\d+([.,]\d+)?\s*(x|dagen|dag|days?|porties|portie|ft|feet|voet|stuks?|st)?\s+/, "");
    return { s: s.replace(/\s+/g, " ").trim(), magic: magic };
  }
  /* Zoek het icoon voor een voorwerpnaam. Geeft altijd een resultaat: {id, cat, file, src, kind:'unique'|'group'|'category'|'misc'}. */
  function match(name) {
    var n = norm(name), i, g;
    for (i = 0; i < GROUPS.length; i++) {
      g = GROUPS[i];
      if (g.rx.test(n.s)) return { id: g.id, cat: g.cat, file: g.file, src: BASE + g.file, kind: g.unique ? "unique" : "group", magic: n.magic };
    }
    for (i = 0; i < CAT_ORDER.length; i++) {
      var c = CATS[CAT_ORDER[i]];
      if (c.rx && c.rx.test(n.s)) return { id: "fallback-" + CAT_ORDER[i], cat: CAT_ORDER[i], file: c.file, src: BASE + c.file, kind: "category", magic: n.magic };
    }
    if (n.magic) return { id: "fallback-magic", cat: "magic", file: CATS.magic.file, src: BASE + CATS.magic.file, kind: "category", magic: true };
    return { id: "fallback-misc", cat: "misc", file: CATS.misc.file, src: BASE + CATS.misc.file, kind: "misc", magic: false };
  }
  function allFiles() {
    var f = GROUPS.map(function (g) { return g.file; });
    Object.keys(CATS).forEach(function (k) { f.push(CATS[k].file); });
    return f;
  }
  return { BASE: BASE, GROUPS: GROUPS, CATS: CATS, norm: norm, match: match, allFiles: allFiles };
}));
