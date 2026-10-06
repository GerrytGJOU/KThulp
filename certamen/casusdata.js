/* CASUSDATA — woordenlijsten + paradigma's voor naamvallen in Certamen (casusquiz.js).
   Gegenereerd/gekopieerd uit de Casus Trainers (latijn/casus/index.html: WORDLIST +
   buildForms; grieks/casus/index.html: WORDS). Wijzig je daar iets aan de
   paradigma's, spiegel het dan hier. */
"use strict";
const CQ_LA_WORDS = [
  // ── 1e DECLINATIE (10 woorden) ──
  {id:'vita',     nom:'vita',     gen:'vitae',    geslacht:'f',vert:'leven',             dec:1},
  {id:'causa',    nom:'causa',    gen:'causae',   geslacht:'f',vert:'oorzaak',            dec:1},
  {id:'terra',    nom:'terra',    gen:'terrae',   geslacht:'f',vert:'aarde, land',        dec:1},
  {id:'fortuna',  nom:'fortuna',  gen:'fortunae', geslacht:'f',vert:'lot; geluk',         dec:1},
  {id:'natura',   nom:'natura',   gen:'naturae',  geslacht:'f',vert:'natuur',             dec:1},
  {id:'cura',     nom:'cura',     gen:'curae',    geslacht:'f',vert:'zorg',               dec:1},
  {id:'via',      nom:'via',      gen:'viae',     geslacht:'f',vert:'weg, route',         dec:1},
  {id:'fama',     nom:'fama',     gen:'famae',    geslacht:'f',vert:'reputatie; gerucht', dec:1},
  {id:'poena',    nom:'poena',    gen:'poenae',   geslacht:'f',vert:'straf, boete',       dec:1},
  {id:'femina',   nom:'femina',   gen:'feminae',  geslacht:'f',vert:'vrouw',              dec:1},
  // ── 2e DECLINATIE (12 woorden) ──
  // -us m: vocativus wijkt af (hasVoc:true)
  {id:'animus',   nom:'animus',   gen:'animi',    geslacht:'m',vert:'geest; moed',        dec:2,hasVoc:true},
  {id:'locus',    nom:'locus',    gen:'loci',     geslacht:'m',vert:'plaats',             dec:2,hasVoc:true},
  {id:'populus',  nom:'populus',  gen:'populi',   geslacht:'m',vert:'volk',               dec:2,hasVoc:true},
  {id:'annus',    nom:'annus',    gen:'anni',     geslacht:'m',vert:'jaar',               dec:2,hasVoc:true},
  {id:'amicus',   nom:'amicus',   gen:'amici',    geslacht:'m',vert:'vriend',             dec:2,hasVoc:true},
  {id:'servus',   nom:'servus',   gen:'servi',    geslacht:'m',vert:'slaaf',              dec:2,hasVoc:true},
  // -um n: vocativus = nominativus
  {id:'bellum',   nom:'bellum',   gen:'belli',    geslacht:'n',vert:'oorlog',             dec:2,hasVoc:false},
  {id:'regnum',   nom:'regnum',   gen:'regni',    geslacht:'n',vert:'koningschap; rijk',  dec:2,hasVoc:false},
  {id:'periculum',nom:'periculum',gen:'periculi', geslacht:'n',vert:'gevaar',             dec:2,hasVoc:false},
  // overige 2e dec: vocativus = nominativus
  {id:'vir',      nom:'vir',      gen:'viri',     geslacht:'m',vert:'man',                dec:2,hasVoc:false},
  {id:'deus',     nom:'deus',     gen:'dei',      geslacht:'m',vert:'god',                dec:2,hasVoc:false},
  {id:'puer',     nom:'puer',     gen:'pueri',    geslacht:'m',vert:'jongen; slaaf',      dec:2,hasVoc:false},
  // ── 3e DECLINATIE (12 woorden) ──
  {id:'rex',      nom:'rex',      gen:'regis',    geslacht:'m',vert:'koning',             dec:3},
  {id:'pars',     nom:'pars',     gen:'partis',   geslacht:'f',vert:'deel',               dec:3},
  {id:'homo',     nom:'homo',     gen:'hominis',  geslacht:'m',vert:'mens',               dec:3},
  {id:'corpus',   nom:'corpus',   gen:'corporis', geslacht:'n',vert:'lichaam',            dec:3},
  {id:'urbs',     nom:'urbs',     gen:'urbis',    geslacht:'f',vert:'stad',               dec:3},
  {id:'tempus',   nom:'tempus',   gen:'temporis', geslacht:'n',vert:'tijd',               dec:3},
  {id:'virtus',   nom:'virtus',   gen:'virtutis', geslacht:'f',vert:'moed; kwaliteit',    dec:3},
  {id:'pater',    nom:'pater',    gen:'patris',   geslacht:'m',vert:'vader',              dec:3},
  {id:'mors',     nom:'mors',     gen:'mortis',   geslacht:'f',vert:'dood',               dec:3},
  {id:'nomen',    nom:'nomen',    gen:'nominis',  geslacht:'n',vert:'naam',               dec:3},
  {id:'lex',      nom:'lex',      gen:'legis',    geslacht:'f',vert:'wet',                dec:3},
  {id:'dux',      nom:'dux',      gen:'ducis',    geslacht:'m',vert:'leider, aanvoerder', dec:3},
  {id:'mater',    nom:'mater',    gen:'matris',   geslacht:'f',vert:'moeder',             dec:3},
  {id:'flumen',   nom:'flumen',   gen:'fluminis', geslacht:'n',vert:'rivier',             dec:3},
  // ── 4e DECLINATIE (8 woorden) ──
  // -us m/f
  {id:'manus',    nom:'manus',    gen:'manus',    geslacht:'f',vert:'hand; groep',        dec:4},
  {id:'exercitus',nom:'exercitus',gen:'exercitus',geslacht:'m',vert:'leger',              dec:4},
  {id:'senatus',  nom:'senatus',  gen:'senatus',  geslacht:'m',vert:'senaat',             dec:4},
  {id:'metus',    nom:'metus',    gen:'metus',    geslacht:'m',vert:'angst, vrees',       dec:4},
  {id:'impetus',  nom:'impetus',  gen:'impetus',  geslacht:'m',vert:'aanval; vaart',      dec:4},
  {id:'usus',     nom:'usus',     gen:'usus',     geslacht:'m',vert:'gebruik, nut',       dec:4},
  // -u n
  {id:'genu',     nom:'genu',     gen:'genus',    geslacht:'n',vert:'knie',               dec:4},
  {id:'cornu',    nom:'cornu',    gen:'cornus',   geslacht:'n',vert:'hoorn; vleugel (leger)', dec:4},
  // ── 5e DECLINATIE (5 woorden) ──
  {id:'res',      nom:'res',      gen:'rei',      geslacht:'f',vert:'zaak, ding',         dec:5},
  {id:'dies',     nom:'dies',     gen:'diei',     geslacht:'m',vert:'dag',                dec:5},
  {id:'fides',    nom:'fides',    gen:'fidei',    geslacht:'f',vert:'trouw; vertrouwen',  dec:5},
  {id:'spes',     nom:'spes',     gen:'spei',     geslacht:'f',vert:'hoop',               dec:5},
  {id:'acies',    nom:'acies',    gen:'aciei',    geslacht:'f',vert:'slaglinie; scherpte', dec:5},
];
function cqLaBuildForms(w){
  const sg={},pl={};
  if(w.dec===1){
    const st=w.nom.replace(/a$/,'');
    sg.nom=w.nom;sg.gen=st+'ae';sg.dat=st+'ae';sg.acc=st+'am';sg.abl=st+'a';sg.voc=w.nom;
    pl.nom=st+'ae';pl.gen=st+'arum';pl.dat=st+'is';pl.acc=st+'as';pl.abl=st+'is';pl.voc=st+'ae';
  } else if(w.dec===2&&w.geslacht==='n'){
    const st=w.nom.replace(/um$/,'');
    sg.nom=w.nom;sg.gen=st+'i';sg.dat=st+'o';sg.acc=w.nom;sg.abl=st+'o';sg.voc=w.nom;
    pl.nom=st+'a';pl.gen=st+'orum';pl.dat=st+'is';pl.acc=st+'a';pl.abl=st+'is';pl.voc=st+'a';
  } else if(w.dec===2&&w.id==='vir'){
    sg.nom='vir';sg.gen='viri';sg.dat='viro';sg.acc='virum';sg.abl='viro';sg.voc='vir';
    pl.nom='viri';pl.gen='virorum';pl.dat='viris';pl.acc='viros';pl.abl='viris';pl.voc='viri';
  } else if(w.dec===2&&w.id==='puer'){
    // puer behoudt de -e- in de stam (puer/pueri); vocativus = nominativus
    sg.nom='puer';sg.gen='pueri';sg.dat='puero';sg.acc='puerum';sg.abl='puero';sg.voc='puer';
    pl.nom='pueri';pl.gen='puerorum';pl.dat='pueris';pl.acc='pueros';pl.abl='pueris';pl.voc='pueri';
  } else if(w.dec===2){
    const st=w.nom.endsWith('us')?w.nom.replace(/us$/,''):w.nom;
    const voc=w.id==='deus'?'deus':st+'e';
    sg.nom=w.nom;sg.gen=st+'i';sg.dat=st+'o';sg.acc=st+'um';sg.abl=st+'o';sg.voc=voc;
    pl.nom=st+'i';pl.gen=st+'orum';pl.dat=st+'is';pl.acc=st+'os';pl.abl=st+'is';pl.voc=st+'i';
  } else if(w.dec===3&&w.geslacht==='n'){
    const st=w.gen.replace(/is$/,'');
    // cons-stam neutra: nom/acc pl = stam + -a; flumen toegevoegd
    const consNeutra=new Set(['corpus','tempus','nomen','flumen']);
    const plNA=consNeutra.has(w.id)?st+'a':st+'ia';
    sg.nom=w.nom;sg.gen=w.gen;sg.dat=st+'i';sg.acc=w.nom;sg.abl=st+'e';sg.voc=w.nom;
    pl.nom=plNA;pl.gen=st+'um';pl.dat=st+'ibus';pl.acc=plNA;pl.abl=st+'ibus';pl.voc=plNA;
  } else if(w.dec===3){
    const st=w.gen.replace(/is$/,'');
    const isIStem=new Set(['pars','urbs','virtus','mors','lex']).has(w.id);
    sg.nom=w.nom;sg.gen=w.gen;sg.dat=st+'i';sg.acc=st+'em';sg.abl=st+'e';sg.voc=w.nom;
    pl.nom=st+'es';pl.gen=isIStem?st+'ium':st+'um';pl.dat=st+'ibus';pl.acc=st+'es';pl.abl=st+'ibus';pl.voc=st+'es';
  } else if(w.dec===4&&w.geslacht==='n'){
    // -u neutrum: genu, cornu
    const st=w.nom; // 'genu' / 'cornu'
    const plSt=st.slice(0,-1); // 'gen' / 'corn' — voor -ibus
    sg.nom=st;sg.gen=st+'s';sg.dat=st;sg.acc=st;sg.abl=st;sg.voc=st;
    pl.nom=st+'a';pl.gen=st+'um';pl.dat=plSt+'ibus';pl.acc=st+'a';pl.abl=plSt+'ibus';pl.voc=st+'a';
  } else if(w.dec===4){
    const st=w.nom.replace(/us$/,'');
    sg.nom=w.nom;sg.gen=w.nom;sg.dat=st+'ui';sg.acc=st+'um';sg.abl=st+'u';sg.voc=w.nom;
    pl.nom=w.nom;pl.gen=st+'uum';pl.dat=st+'ibus';pl.acc=st+'us';pl.abl=st+'ibus';pl.voc=w.nom;
  } else if(w.dec===5){
    const st=w.nom.replace(/es$/,'');
    sg.nom=w.nom;sg.gen=w.gen;sg.dat=st+'ei';sg.acc=st+'em';sg.abl=st+'e';sg.voc=w.nom;
    pl.nom=w.nom;pl.gen=st+'erum';pl.dat=st+'ebus';pl.acc=st+'es';pl.abl=st+'ebus';pl.voc=w.nom;
  }
  return {sg,pl};
}
const CQ_EL_WORDS = [
  // ── EERSTE DECLINATIE -α lang (A1) ──
  {
    id:"A1_thea", gr:"θεά", tr:"thea", nl:"godin", genus:"f", decl:1, type:"A1",
    label:"1e declinatie -ᾱ (θεά)",
    forms:{
      nom_sg:"θεά", acc_sg:"θεάν", gen_sg:"θεᾶς", dat_sg:"θεᾷ", voc_sg:"θεά",
      nom_pl:"θεαί", acc_pl:"θεάς", gen_pl:"θεῶν", dat_pl:"θεαῖς"
    }
  },
  {
    id:"A1_chora", gr:"χώρα", tr:"chōra", nl:"land, gebied", genus:"f", decl:1, type:"A1",
    label:"1e declinatie -ᾱ (χώρα)",
    forms:{
      nom_sg:"χώρα", acc_sg:"χώρᾱν", gen_sg:"χώρας", dat_sg:"χώρᾳ", voc_sg:"χώρα",
      nom_pl:"χῶραι", acc_pl:"χώρας", gen_pl:"χωρῶν", dat_pl:"χώραις"
    }
  },
  {
    id:"A1_nike", gr:"νίκη", tr:"nikē", nl:"overwinning", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (νίκη)",
    forms:{
      nom_sg:"νίκη", acc_sg:"νίκην", gen_sg:"νίκης", dat_sg:"νίκῃ", voc_sg:"νίκη",
      nom_pl:"νῖκαι", acc_pl:"νίκας", gen_pl:"νικῶν", dat_pl:"νίκαις"
    }
  },
  // ── EERSTE DECLINATIE -η (A2) ──
  {
    id:"A2_psyche", gr:"ψυχή", tr:"psychē", nl:"ziel, adem, leven", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (ψυχή)",
    forms:{
      nom_sg:"ψυχή", acc_sg:"ψυχήν", gen_sg:"ψυχῆς", dat_sg:"ψυχῇ", voc_sg:"ψυχή",
      nom_pl:"ψυχαί", acc_pl:"ψυχάς", gen_pl:"ψυχῶν", dat_pl:"ψυχαῖς"
    }
  },
  {
    id:"A2_arche", gr:"ἀρχή", tr:"archē", nl:"begin, heerschappij, ambt", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (ἀρχή)",
    forms:{
      nom_sg:"ἀρχή", acc_sg:"ἀρχήν", gen_sg:"ἀρχῆς", dat_sg:"ἀρχῇ", voc_sg:"ἀρχή",
      nom_pl:"ἀρχαί", acc_pl:"ἀρχάς", gen_pl:"ἀρχῶν", dat_pl:"ἀρχαῖς"
    }
  },
  {
    id:"A1_hemera", gr:"ἡμέρα", tr:"hēmera", nl:"dag", genus:"f", decl:1, type:"A1",
    label:"1e declinatie -ᾱ (ἡμέρα, na ρ)",
    forms:{
      nom_sg:"ἡμέρα", acc_sg:"ἡμέραν", gen_sg:"ἡμέρας", dat_sg:"ἡμέρᾳ", voc_sg:"ἡμέρα",
      nom_pl:"ἡμέραι", acc_pl:"ἡμέρας", gen_pl:"ἡμερῶν", dat_pl:"ἡμέραις"
    }
  },
  {
    id:"A2_arete", gr:"ἀρετή", tr:"aretē", nl:"voortreffelijkheid, deugd", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (ἀρετή)",
    forms:{
      nom_sg:"ἀρετή", acc_sg:"ἀρετήν", gen_sg:"ἀρετῆς", dat_sg:"ἀρετῇ", voc_sg:"ἀρετή",
      nom_pl:"ἀρεταί", acc_pl:"ἀρετάς", gen_pl:"ἀρετῶν", dat_pl:"ἀρεταῖς"
    }
  },
  {
    id:"A2_ge", gr:"γῆ", tr:"gē", nl:"aarde, land, grond", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (γῆ)",
    forms:{
      nom_sg:"γῆ", acc_sg:"γῆν", gen_sg:"γῆς", dat_sg:"γῇ", voc_sg:"γῆ",
      nom_pl:"—", acc_pl:"—", gen_pl:"—", dat_pl:"—"
    }
  },
  // ── EERSTE DECLINATIE -ας (A3, masculinum) ──
  {
    id:"A3_neanias", gr:"νεανίας", tr:"neanias", nl:"jongeling, jongeman", genus:"m", decl:1, type:"A3",
    label:"1e declinatie -ᾱς (νεανίας, m)",
    forms:{
      nom_sg:"νεανίας", acc_sg:"νεανίᾱν", gen_sg:"νεανίου", dat_sg:"νεανίᾳ", voc_sg:"νεανία",
      nom_pl:"νεανίαι", acc_pl:"νεανίας", gen_pl:"νεανιῶν", dat_pl:"νεανίαις"
    }
  },
  {
    id:"A3_stratiotes", gr:"στρατιώτης", tr:"stratiōtēs", nl:"soldaat", genus:"m", decl:1, type:"A3",
    label:"1e declinatie -ης (στρατιώτης, m)",
    forms:{
      nom_sg:"στρατιώτης", acc_sg:"στρατιώτην", gen_sg:"στρατιώτου", dat_sg:"στρατιώτῃ", voc_sg:"στρατιῶτα",
      nom_pl:"στρατιῶται", acc_pl:"στρατιώτας", gen_pl:"στρατιωτῶν", dat_pl:"στρατιώταις"
    }
  },
  {
    id:"A3_poietes", gr:"ποιητής", tr:"poiētēs", nl:"dichter, maker", genus:"m", decl:1, type:"A3",
    label:"1e declinatie -ης (ποιητής, m)",
    forms:{
      nom_sg:"ποιητής", acc_sg:"ποιητήν", gen_sg:"ποιητοῦ", dat_sg:"ποιητῇ", voc_sg:"ποιητά",
      nom_pl:"ποιηταί", acc_pl:"ποιητάς", gen_pl:"ποιητῶν", dat_pl:"ποιηταῖς"
    }
  },
  // ── TWEEDE DECLINATIE -ος (B1) ──
  {
    id:"B1_logos", gr:"λόγος", tr:"logos", nl:"woord, redevoering, rede", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (λόγος, m)",
    forms:{
      nom_sg:"λόγος", acc_sg:"λόγον", gen_sg:"λόγου", dat_sg:"λόγῳ", voc_sg:"λόγε",
      nom_pl:"λόγοι", acc_pl:"λόγους", gen_pl:"λόγων", dat_pl:"λόγοις"
    }
  },
  {
    id:"B1_anthropos", gr:"ἄνθρωπος", tr:"anthrōpos", nl:"mens", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (ἄνθρωπος, m)",
    forms:{
      nom_sg:"ἄνθρωπος", acc_sg:"ἄνθρωπον", gen_sg:"ἀνθρώπου", dat_sg:"ἀνθρώπῳ", voc_sg:"ἄνθρωπε",
      nom_pl:"ἄνθρωποι", acc_pl:"ἀνθρώπους", gen_pl:"ἀνθρώπων", dat_pl:"ἀνθρώποις"
    }
  },
  {
    id:"B1_theos", gr:"θεός", tr:"theos", nl:"god", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (θεός, m/f)",
    forms:{
      nom_sg:"θεός", acc_sg:"θεόν", gen_sg:"θεοῦ", dat_sg:"θεῷ", voc_sg:"θεέ",
      nom_pl:"θεοί", acc_pl:"θεούς", gen_pl:"θεῶν", dat_pl:"θεοῖς"
    }
  },
  {
    id:"B1_polemos", gr:"πόλεμος", tr:"polemos", nl:"oorlog", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (πόλεμος, m)",
    forms:{
      nom_sg:"πόλεμος", acc_sg:"πόλεμον", gen_sg:"πολέμου", dat_sg:"πολέμῳ", voc_sg:"πόλεμε",
      nom_pl:"πόλεμοι", acc_pl:"πολέμους", gen_pl:"πολέμων", dat_pl:"πολέμοις"
    }
  },
  {
    id:"B1_nomos", gr:"νόμος", tr:"nomos", nl:"wet, gewoonte", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (νόμος, m)",
    forms:{
      nom_sg:"νόμος", acc_sg:"νόμον", gen_sg:"νόμου", dat_sg:"νόμῳ", voc_sg:"νόμε",
      nom_pl:"νόμοι", acc_pl:"νόμους", gen_pl:"νόμων", dat_pl:"νόμοις"
    }
  },
  {
    id:"B1_demos", gr:"δῆμος", tr:"dēmos", nl:"(gewone) volk, district", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (δῆμος, m)",
    forms:{
      nom_sg:"δῆμος", acc_sg:"δῆμον", gen_sg:"δήμου", dat_sg:"δήμῳ", voc_sg:"δῆμε",
      nom_pl:"δῆμοι", acc_pl:"δήμους", gen_pl:"δήμων", dat_pl:"δήμοις"
    }
  },
  {
    id:"B1_doulos", gr:"δοῦλος", tr:"doulos", nl:"slaaf", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (δοῦλος, m)",
    forms:{
      nom_sg:"δοῦλος", acc_sg:"δοῦλον", gen_sg:"δούλου", dat_sg:"δούλῳ", voc_sg:"δοῦλε",
      nom_pl:"δοῦλοι", acc_pl:"δούλους", gen_pl:"δούλων", dat_pl:"δούλοις"
    }
  },
  {
    id:"B1_oikos", gr:"οἶκος", tr:"oikos", nl:"huis, woning, familie", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (οἶκος, m)",
    forms:{
      nom_sg:"οἶκος", acc_sg:"οἶκον", gen_sg:"οἴκου", dat_sg:"οἴκῳ", voc_sg:"οἶκε",
      nom_pl:"οἶκοι", acc_pl:"οἴκους", gen_pl:"οἴκων", dat_pl:"οἴκοις"
    }
  },
  // ── TWEEDE DECLINATIE -ον (B2, neutrum) ──
  {
    id:"B2_ergon", gr:"ἔργον", tr:"ergon", nl:"werk, daad, prestatie", genus:"n", decl:2, type:"B2",
    label:"2e declinatie -ον (ἔργον, n)",
    forms:{
      nom_sg:"ἔργον", acc_sg:"ἔργον", gen_sg:"ἔργου", dat_sg:"ἔργῳ", voc_sg:"ἔργον",
      nom_pl:"ἔργα", acc_pl:"ἔργα", gen_pl:"ἔργων", dat_pl:"ἔργοις"
    }
  },
  {
    id:"B2_doron", gr:"δῶρον", tr:"dōron", nl:"geschenk, gave", genus:"n", decl:2, type:"B2",
    label:"2e declinatie -ον (δῶρον, n)",
    forms:{
      nom_sg:"δῶρον", acc_sg:"δῶρον", gen_sg:"δώρου", dat_sg:"δώρῳ", voc_sg:"δῶρον",
      nom_pl:"δῶρα", acc_pl:"δῶρα", gen_pl:"δώρων", dat_pl:"δώροις"
    }
  },
  {
    id:"B2_pragma", gr:"πρᾶγμα", tr:"pragma", nl:"ding, zaak", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -μα (πρᾶγμα, n)",
    forms:{
      nom_sg:"πρᾶγμα", acc_sg:"πρᾶγμα", gen_sg:"πράγματος", dat_sg:"πράγματι", voc_sg:"πρᾶγμα",
      nom_pl:"πράγματα", acc_pl:"πράγματα", gen_pl:"πραγμάτων", dat_pl:"πράγμασι(ν)"
    }
  },
  {
    id:"B2_soma", gr:"σῶμα", tr:"sōma", nl:"lichaam", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -μα (σῶμα, n)",
    forms:{
      nom_sg:"σῶμα", acc_sg:"σῶμα", gen_sg:"σώματος", dat_sg:"σώματι", voc_sg:"σῶμα",
      nom_pl:"σώματα", acc_pl:"σώματα", gen_pl:"σωμάτων", dat_pl:"σώμασι(ν)"
    }
  },
  {
    id:"B2_onoma", gr:"ὄνομα", tr:"onoma", nl:"naam, roem", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -μα (ὄνομα, n)",
    forms:{
      nom_sg:"ὄνομα", acc_sg:"ὄνομα", gen_sg:"ὀνόματος", dat_sg:"ὀνόματι", voc_sg:"ὄνομα",
      nom_pl:"ὀνόματα", acc_pl:"ὀνόματα", gen_pl:"ὀνομάτων", dat_pl:"ὀνόμασι(ν)"
    }
  },
  {
    id:"B2_pneuma", gr:"πνεῦμα", tr:"pneuma", nl:"wind, adem, geest", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -μα (πνεῦμα, n)",
    forms:{
      nom_sg:"πνεῦμα", acc_sg:"πνεῦμα", gen_sg:"πνεύματος", dat_sg:"πνεύματι", voc_sg:"πνεῦμα",
      nom_pl:"πνεύματα", acc_pl:"πνεύματα", gen_pl:"πνευμάτων", dat_pl:"πνεύμασι(ν)"
    }
  },
  // ── DERDE DECLINATIE consonantstam (C1) ──
  {
    id:"C1_aner", gr:"ἀνήρ", tr:"anēr", nl:"man, echtgenoot", genus:"m", decl:3, type:"C1",
    label:"3e declinatie (ἀνήρ, m)",
    forms:{
      nom_sg:"ἀνήρ", acc_sg:"ἄνδρα", gen_sg:"ἀνδρός", dat_sg:"ἀνδρί", voc_sg:"ἄνερ",
      nom_pl:"ἄνδρες", acc_pl:"ἄνδρας", gen_pl:"ἀνδρῶν", dat_pl:"ἀνδράσι(ν)"
    }
  },
  {
    id:"C1_pater", gr:"πατήρ", tr:"patēr", nl:"vader", genus:"m", decl:3, type:"C1",
    label:"3e declinatie (πατήρ, m)",
    forms:{
      nom_sg:"πατήρ", acc_sg:"πατέρα", gen_sg:"πατρός", dat_sg:"πατρί", voc_sg:"πάτερ",
      nom_pl:"πατέρες", acc_pl:"πατέρας", gen_pl:"πατέρων", dat_pl:"πατράσι(ν)"
    }
  },
  {
    id:"C1_meter", gr:"μήτηρ", tr:"mētēr", nl:"moeder", genus:"f", decl:3, type:"C1",
    label:"3e declinatie (μήτηρ, f)",
    forms:{
      nom_sg:"μήτηρ", acc_sg:"μητέρα", gen_sg:"μητρός", dat_sg:"μητρί", voc_sg:"μῆτερ",
      nom_pl:"μητέρες", acc_pl:"μητέρας", gen_pl:"μητέρων", dat_pl:"μητράσι(ν)"
    }
  },
  {
    id:"C1_cheir", gr:"χείρ", tr:"cheir", nl:"hand", genus:"f", decl:3, type:"C1",
    label:"3e declinatie (χείρ, f)",
    forms:{
      nom_sg:"χείρ", acc_sg:"χεῖρα", gen_sg:"χειρός", dat_sg:"χειρί", voc_sg:"χείρ",
      nom_pl:"χεῖρες", acc_pl:"χεῖρας", gen_pl:"χειρῶν", dat_pl:"χερσί(ν)"
    }
  },
  {
    id:"C1_nyx", gr:"νύξ", tr:"nyx", nl:"nacht", genus:"f", decl:3, type:"C1",
    label:"3e declinatie (νύξ, f)",
    forms:{
      nom_sg:"νύξ", acc_sg:"νύκτα", gen_sg:"νυκτός", dat_sg:"νυκτί", voc_sg:"νύξ",
      nom_pl:"νύκτες", acc_pl:"νύκτας", gen_pl:"νυκτῶν", dat_pl:"νυξί(ν)"
    }
  },
  {
    id:"C1_pous", gr:"πούς", tr:"pous", nl:"voet", genus:"m", decl:3, type:"C1",
    label:"3e declinatie (πούς, m)",
    forms:{
      nom_sg:"πούς", acc_sg:"πόδα", gen_sg:"ποδός", dat_sg:"ποδί", voc_sg:"πούς",
      nom_pl:"πόδες", acc_pl:"πόδας", gen_pl:"ποδῶν", dat_pl:"ποσί(ν)"
    }
  },
  {
    id:"C1_agon", gr:"ἀγών", tr:"agōn", nl:"wedstrijd, strijd", genus:"m", decl:3, type:"C1",
    label:"3e declinatie -ων (ἀγών, m)",
    forms:{
      nom_sg:"ἀγών", acc_sg:"ἀγῶνα", gen_sg:"ἀγῶνος", dat_sg:"ἀγῶνι", voc_sg:"ἀγών",
      nom_pl:"ἀγῶνες", acc_pl:"ἀγῶνας", gen_pl:"ἀγώνων", dat_pl:"ἀγῶσι(ν)"
    }
  },
  {
    id:"C1_daimon", gr:"δαίμων", tr:"daimōn", nl:"geest, godheid", genus:"m", decl:3, type:"C1",
    label:"3e declinatie -ων (δαίμων, m/f)",
    forms:{
      nom_sg:"δαίμων", acc_sg:"δαίμονα", gen_sg:"δαίμονος", dat_sg:"δαίμονι", voc_sg:"δαῖμον",
      nom_pl:"δαίμονες", acc_pl:"δαίμονας", gen_pl:"δαιμόνων", dat_pl:"δαίμοσι(ν)"
    }
  },
  {
    id:"C1_hegemon", gr:"ἡγεμών", tr:"hēgemōn", nl:"leider, aanvoerder", genus:"m", decl:3, type:"C1",
    label:"3e declinatie -ών (ἡγεμών, m)",
    forms:{
      nom_sg:"ἡγεμών", acc_sg:"ἡγεμόνα", gen_sg:"ἡγεμόνος", dat_sg:"ἡγεμόνι", voc_sg:"ἡγεμών",
      nom_pl:"ἡγεμόνες", acc_pl:"ἡγεμόνας", gen_pl:"ἡγεμόνων", dat_pl:"ἡγεμόσι(ν)"
    }
  },
  {
    id:"C1_charis", gr:"χάρις", tr:"charis", nl:"gratie, gunst, dank", genus:"f", decl:3, type:"C1",
    label:"3e declinatie -ις (χάρις, f)",
    forms:{
      nom_sg:"χάρις", acc_sg:"χάριν", gen_sg:"χάριτος", dat_sg:"χάριτι", voc_sg:"χάρι",
      nom_pl:"χάριτες", acc_pl:"χάριτας", gen_pl:"χαρίτων", dat_pl:"χάρισι(ν)"
    }
  },
  {
    id:"C1_elpis", gr:"ἐλπίς", tr:"elpis", nl:"hoop, verwachting", genus:"f", decl:3, type:"C1",
    label:"3e declinatie -ίς (ἐλπίς, f)",
    forms:{
      nom_sg:"ἐλπίς", acc_sg:"ἐλπίδα", gen_sg:"ἐλπίδος", dat_sg:"ἐλπίδι", voc_sg:"ἐλπί",
      nom_pl:"ἐλπίδες", acc_pl:"ἐλπίδας", gen_pl:"ἐλπίδων", dat_pl:"ἐλπίσι(ν)"
    }
  },
  {
    id:"C1_thanatos", gr:"θάνατος", tr:"thanatos", nl:"dood", genus:"m", decl:2, type:"B1",
    label:"2e declinatie -ος (θάνατος, m)",
    forms:{
      nom_sg:"θάνατος", acc_sg:"θάνατον", gen_sg:"θανάτου", dat_sg:"θανάτῳ", voc_sg:"θάνατε",
      nom_pl:"θάνατοι", acc_pl:"θανάτους", gen_pl:"θανάτων", dat_pl:"θανάτοις"
    }
  },
  // ── DERDE DECLINATIE -ις/-εως (C2) ──
  {
    id:"C2_polis", gr:"πόλις", tr:"polis", nl:"stad, stadstaat", genus:"f", decl:3, type:"C2",
    label:"3e declinatie -ις/-εως (πόλις, f)",
    forms:{
      nom_sg:"πόλις", acc_sg:"πόλιν", gen_sg:"πόλεως", dat_sg:"πόλει", voc_sg:"πόλι",
      nom_pl:"πόλεις", acc_pl:"πόλεις", gen_pl:"πόλεων", dat_pl:"πόλεσι(ν)"
    }
  },
  {
    id:"C2_dynamis", gr:"δύναμις", tr:"dynamis", nl:"kracht, sterkte, macht", genus:"f", decl:3, type:"C2",
    label:"3e declinatie -ις/-εως (δύναμις, f)",
    forms:{
      nom_sg:"δύναμις", acc_sg:"δύναμιν", gen_sg:"δυνάμεως", dat_sg:"δυνάμει", voc_sg:"δύναμι",
      nom_pl:"δυνάμεις", acc_pl:"δυνάμεις", gen_pl:"δυνάμεων", dat_pl:"δυνάμεσι(ν)"
    }
  },
  {
    id:"C2_physis", gr:"φύσις", tr:"physis", nl:"natuur, aard", genus:"f", decl:3, type:"C2",
    label:"3e declinatie -ις/-εως (φύσις, f)",
    forms:{
      nom_sg:"φύσις", acc_sg:"φύσιν", gen_sg:"φύσεως", dat_sg:"φύσει", voc_sg:"φύσι",
      nom_pl:"φύσεις", acc_pl:"φύσεις", gen_pl:"φύσεων", dat_pl:"φύσεσι(ν)"
    }
  },
  {
    id:"C2_gnomis", gr:"γνώμη", tr:"gnōmē", nl:"gedachte, inzicht, mening", genus:"f", decl:1, type:"A2",
    label:"1e declinatie -η (γνώμη, f)",
    forms:{
      nom_sg:"γνώμη", acc_sg:"γνώμην", gen_sg:"γνώμης", dat_sg:"γνώμῃ", voc_sg:"γνώμη",
      nom_pl:"γνῶμαι", acc_pl:"γνώμας", gen_pl:"γνωμῶν", dat_pl:"γνώμαις"
    }
  },
  {
    id:"C2_pistis", gr:"πίστις", tr:"pistis", nl:"vertrouwen, geloof", genus:"f", decl:3, type:"C2",
    label:"3e declinatie -ις/-εως (πίστις, f)",
    forms:{
      nom_sg:"πίστις", acc_sg:"πίστιν", gen_sg:"πίστεως", dat_sg:"πίστει", voc_sg:"πίστι",
      nom_pl:"πίστεις", acc_pl:"πίστεις", gen_pl:"πίστεων", dat_pl:"πίστεσι(ν)"
    }
  },
  // ── DERDE DECLINATIE -εύς (C3) ──
  {
    id:"C3_basileus", gr:"βασιλεύς", tr:"basileus", nl:"koning", genus:"m", decl:3, type:"C3",
    label:"3e declinatie -εύς (βασιλεύς, m)",
    forms:{
      nom_sg:"βασιλεύς", acc_sg:"βασιλέᾱ", gen_sg:"βασιλέως", dat_sg:"βασιλεῖ", voc_sg:"βασιλεῦ",
      nom_pl:"βασιλεῖς", acc_pl:"βασιλέᾱς", gen_pl:"βασιλέων", dat_pl:"βασιλεῦσι(ν)"
    }
  },
  {
    id:"C3_hippeus", gr:"ἱππεύς", tr:"hippeus", nl:"ruiter", genus:"m", decl:3, type:"C3",
    label:"3e declinatie -εύς (ἱππεύς, m)",
    forms:{
      nom_sg:"ἱππεύς", acc_sg:"ἱππέᾱ", gen_sg:"ἱππέως", dat_sg:"ἱππεῖ", voc_sg:"ἱππεῦ",
      nom_pl:"ἱππεῖς", acc_pl:"ἱππέᾱς", gen_pl:"ἱππέων", dat_pl:"ἱππεῦσι(ν)"
    }
  },
  // ── DERDE DECLINATIE -ος (C_neuter) ──
  {
    id:"Cn_genos", gr:"γένος", tr:"genos", nl:"geslacht, afkomst, soort", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -ος/-ους (γένος, n)",
    forms:{
      nom_sg:"γένος", acc_sg:"γένος", gen_sg:"γένους", dat_sg:"γένει", voc_sg:"γένος",
      nom_pl:"γένη", acc_pl:"γένη", gen_pl:"γενῶν", dat_pl:"γένεσι(ν)"
    }
  },
  {
    id:"Cn_ethos", gr:"ἦθος", tr:"ēthos", nl:"karakter, aard, gewoonte", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -ος/-ους (ἦθος, n)",
    forms:{
      nom_sg:"ἦθος", acc_sg:"ἦθος", gen_sg:"ἤθους", dat_sg:"ἤθει", voc_sg:"ἦθος",
      nom_pl:"ἤθη", acc_pl:"ἤθη", gen_pl:"ἠθῶν", dat_pl:"ἤθεσι(ν)"
    }
  },
  {
    id:"Cn_eidos", gr:"εἶδος", tr:"eidos", nl:"vorm, gedaante, soort", genus:"n", decl:3, type:"C1",
    label:"3e declinatie -ος/-ους (εἶδος, n)",
    forms:{
      nom_sg:"εἶδος", acc_sg:"εἶδος", gen_sg:"εἴδους", dat_sg:"εἴδει", voc_sg:"εἶδος",
      nom_pl:"εἴδη", acc_pl:"εἴδη", gen_pl:"εἰδῶν", dat_pl:"εἴδεσι(ν)"
    }
  }
];
