/* Vaste plekken van de dagelijkse veldacties per regio: [x, y, soort]. Gekozen met een controle op bereikbaarheid
   (open tegel met vier vrije buren, niet op een weg, minstens 8 tegels uit elkaar en 2 tegels van personen, deuren en
   versperringen). Zie castra-field.js. Opnieuw te genereren met de BFS-controle uit CASTRA_HEROUM.md (veldacties). */
const CASTRA_FPOS = {
  latium:[[43,41,"saxum"],[46,3,"arbor"],[27,18,"vestigia"],[38,22,"ara"],[45,15,"tentorium"],[7,9,"saxum"],[18,4,"arbor"],[12,30,"vestigia"],[9,37,"ara"],[4,34,"tentorium"]],
  graecia:[[50,7,"saxum"],[25,39,"arbor"],[42,23,"vestigia"],[3,41,"ara"],[17,42,"tentorium"],[19,30,"saxum"],[56,14,"arbor"],[57,23,"vestigia"],[60,38,"ara"],[60,9,"tentorium"]],
  troia:[[18,29,"saxum"],[55,13,"arbor"],[58,29,"vestigia"],[20,9,"ara"],[46,40,"tentorium"],[40,36,"saxum"],[7,31,"arbor"],[45,6,"vestigia"],[13,19,"ara"],[47,12,"tentorium"]],
  gallia:[[46,7,"saxum"],[9,4,"arbor"],[42,31,"vestigia"],[46,44,"ara"],[45,14,"tentorium"],[59,38,"saxum"],[47,22,"arbor"],[22,3,"vestigia"],[40,10,"ara"],[53,6,"tentorium"]],
  aegyptus:[[26,41,"saxum"],[52,12,"arbor"],[40,38,"vestigia"],[27,12,"ara"],[17,20,"tentorium"],[21,5,"saxum"],[60,18,"arbor"],[8,43,"vestigia"],[36,10,"ara"],[46,5,"tentorium"]],
  persis:[[29,13,"saxum"],[19,44,"arbor"],[24,4,"vestigia"],[48,40,"ara"],[45,18,"tentorium"],[55,10,"saxum"],[41,10,"arbor"],[57,18,"vestigia"],[3,9,"ara"],[3,30,"tentorium"]],
  africa:[[57,34,"saxum"],[47,42,"arbor"],[44,33,"vestigia"],[12,29,"ara"],[56,27,"tentorium"],[40,6,"saxum"],[21,28,"arbor"],[9,41,"vestigia"],[56,13,"ara"],[21,14,"tentorium"]],
  roma:[[28,6,"saxum"],[8,30,"arbor"],[57,50,"vestigia"],[24,21,"ara"],[48,9,"tentorium"],[8,7,"saxum"],[47,22,"arbor"],[43,46,"vestigia"],[4,36,"ara"],[53,45,"tentorium"]],
  laconia:[[46,42,"saxum"],[54,35,"arbor"],[50,17,"vestigia"],[10,27,"ara"],[37,42,"tentorium"],[35,19,"saxum"],[46,8,"arbor"],[7,40,"vestigia"],[40,5,"ara"],[19,33,"tentorium"]],
  germania:[[50,9,"saxum"],[20,38,"arbor"],[22,7,"vestigia"],[42,13,"ara"],[5,3,"tentorium"],[7,12,"saxum"],[5,18,"arbor"],[38,6,"vestigia"],[7,39,"ara"],[11,20,"tentorium"]],
  themiscyra:[[12,29,"saxum"],[22,5,"arbor"],[6,13,"vestigia"],[50,20,"ara"],[28,8,"tentorium"],[38,39,"saxum"],[14,39,"arbor"],[60,35,"vestigia"],[36,8,"ara"],[10,18,"tentorium"]],
};
