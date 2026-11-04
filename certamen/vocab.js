/* ============================================================================
   VOCAB — woordenlijsten voor Certamen.
   VOCAB_LA = Latijn, VOCAB_EL = Grieks (zelfde vorm als voorheen: {f,la,nl,pos};
   bij Grieks staat het lemma ook onder "la"). Sinds 2026-11-04 geen eigen kopie
   meer: de data staat centraal in assets/vocab/ (KTVocab), gedeeld met Ludus,
   Agora en Verba. Wijzig woorden daar. Wordt vóór core.js geladen.
   ============================================================================ */
const VOCAB_LA = KTVocab.certamenLA();
const VOCAB_EL = KTVocab.certamenEL();
