import { useState, useMemo, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient.js';
import { Search, Plus, Pencil, Trash2, X, Phone, Mail, ShieldCheck, Users, LayoutGrid, MapPin, Settings2, Camera, Printer, Check, FileText } from 'lucide-react';

const SOCOTEC_LOGO = "data:image/png;base64,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";

/* ---------------------------------------------------------------
   DONNEES — extraites du fichier Trombinoscope_Charente-Limousin_2025_v2_92.xlsm
   (onglets "Trombinoscope agence Limousin", "Competences BRIVE", "Competences LIMOGES")
--------------------------------------------------------------- */

const AGENCES = [
  { id: "direction", nom: "Direction", rail: "#1e3a5f" },
  { id: "brive", nom: "Brive la Gaillarde", rail: "#0EA5C7" },
  { id: "limoges", nom: "Limoges", rail: "#2563EB" },
];

const INITIAL_PERSONNES = [
  { id: "p0", prenom: "Jérôme", nom: "Lafon", poste: "Directeur d'agence Limousin", telephone: "06 24 47 32 61", email: "jerome.lafon@socotec.com", agenceId: "direction", matricule: "", ville: "", specialites: "Electricité, Levage, Foudre, Photovoltaïque, Portes et portails, Machines, E.P.I", photoUrl: null },
  { id: "p1", prenom: "Frédéric", nom: "Caetano", poste: "Technicien d'affaires", telephone: "06 24 47 32 97", email: "frederic.caetano@socotec.com", agenceId: "brive", matricule: "11630", ville: "Nespouls (19)", specialites: "Electricité, Gaz, Aération, Racks, Grandes cuisine, Levage, Porte et portails", photoUrl: null },
  { id: "p2", prenom: "Cyril", nom: "Roche", poste: "Technicien d'inspection", telephone: "06 24 47 32 59", email: "cyril.roche@socotec.com", agenceId: "brive", matricule: "20899", ville: "Jugeals-Nazareth (19)", specialites: "Electricité, Moyen de secours, Gaz, Grandes cuisine", photoUrl: null },
  { id: "p3", prenom: "Jean-Marie", nom: "Caliste", poste: "Technicien d'affaires", telephone: "06 71 98 25 01", email: "jean-marie.caliste@socotec.com", agenceId: "brive", matricule: "25545", ville: "Cressensac (46)", specialites: "Electricité, Gaz, Thermique, Efficacité énergétique, Climatisation", photoUrl: null },
  { id: "p4", prenom: "Adrien", nom: "Soulier", poste: "Vérificateur technique", telephone: "06 43 14 77 30", email: "adrien.soulier@socotec.com", agenceId: "brive", matricule: "20964", ville: "Brive-la-Gaillarde (19)", specialites: "Electricité, Gaz, Levage, EDT, Machines", photoUrl: null },
  { id: "p5", prenom: "Grégory", nom: "Sanches", poste: "Technicien d'inspection", telephone: "06 24 20 76 62", email: "gregory.sanches@socotec.com", agenceId: "brive", matricule: "29717", ville: "Brive-la-Gaillarde (19)", specialites: "Electricité, Levage, Gaz", photoUrl: null },
  { id: "p6", prenom: "Nicolas", nom: "Delmas", poste: "Vérificateur technique", telephone: "07 86 58 55 32", email: "nicolas.delmas1@socotec.com", agenceId: "brive", matricule: "20890", ville: "Saint-Aulaire (19)", specialites: "Electricité, Levage, Gaz", photoUrl: null },
  { id: "p7", prenom: "Frédéric", nom: "Bonneval", poste: "Vérificateur technique", telephone: "06 40 87 42 18", email: "frederic.bonneval@socotec.com", agenceId: "brive", matricule: "33078", ville: "Brive-la-Gaillarde (19)", specialites: "", photoUrl: null },
  { id: "p8", prenom: "Joël", nom: "Jouanny", poste: "Technicien d'affaires", telephone: "06 24 47 32 90", email: "joel.jouanny@socotec.com", agenceId: "limoges", matricule: "0C709", ville: "Limoges (87)", specialites: "Electricité, Ascenseurs, Gaz, Grandes cuisine, Porte et portail, S.S.I, Désenfumage", photoUrl: null },
  { id: "p9", prenom: "Médéric", nom: "Razes", poste: "Technicien d'inspection", telephone: "06 21 17 57 45", email: "mederic.razes@socotec.com", agenceId: "limoges", matricule: "21750", ville: "Limoges (87)", specialites: "Electricité, Gaz, Grandes cuisines", photoUrl: null },
  { id: "p10", prenom: "Christophe", nom: "Surel", poste: "Vérificateur technique", telephone: "06 30 65 34 78", email: "christophe.surel@socotec.com", agenceId: "limoges", matricule: "23343", ville: "Limoges (87)", specialites: "Electricité", photoUrl: null },
  { id: "p11", prenom: "Corentin", nom: "Boutet", poste: "Vérification technique", telephone: "06 16 32 41 79", email: "corentin.boutet@socotec.com", agenceId: "limoges", matricule: "29169", ville: "Limoges (87)", specialites: "Electricité", photoUrl: null },
  { id: "p12", prenom: "Antoine", nom: "Carlos", poste: "Vérification technique", telephone: "07 77 86 63 16", email: "antoine.carlos@socotec.com", agenceId: "limoges", matricule: "30185", ville: "Limoges (87)", specialites: "Electricité", photoUrl: null },
  { id: "p13", prenom: "Jean-Philippe", nom: "Carpe", poste: "Technicien d'affaires", telephone: "06 33 25 36 75", email: "jean-philippe.carpe@socotec.com", agenceId: "limoges", matricule: "33131", ville: "Limoges (87)", specialites: "", photoUrl: null },
  { id: "p14", prenom: "Fabien", nom: "Bauger", poste: "Technicien d'inspection", telephone: "06 19 30 17 03", email: "fabien.bauger@socotec.com", agenceId: "limoges", matricule: "20248", ville: "Limoges (87)", specialites: "", photoUrl: null },
  { id: "p15", prenom: "Loïc", nom: "Serre", poste: "Technicien d'inspection", telephone: "06 61 40 83 56", email: "loic.serre@socotec.com", agenceId: "limoges", matricule: "34958", ville: "Limoges (87)", specialites: "", photoUrl: null },
];

const QUALIF_CATEGORIES = [
  { code: "ELE-REG", libelle: "Électricité réglementaire", color: "#F5A623" },
  { code: "ELE-ATX", libelle: "Électricité ATEX", color: "#F5A623" },
  { code: "ELE-CEM", libelle: "Courants faibles / CEM", color: "#F5A623" },
  { code: "ELE-TIR", libelle: "Thermographie infrarouge", color: "#F5A623" },
  { code: "ELE-AST", libelle: "Électricité assistance", color: "#F5A623" },
  { code: "ELE-IGH", libelle: "Électricité IGH", color: "#F5A623" },
  { code: "ELEC-CTC", libelle: "Électricité construction", color: "#F5A623" },
  { code: "ELE-FOU", libelle: "Électricité foudre", color: "#F5A623" },
  { code: "ELE-TAX", libelle: "Aides & taxes énergie (TIRUERT/ADVENIR)", color: "#F5A623" },
  { code: "ELE-PTV", libelle: "Électricité photovoltaïque", color: "#F5A623" },
  { code: "THE-ENR", libelle: "Énergies renouvelables", color: "#F5A623" },
  { code: "ELM-LEV", libelle: "Électromécanique - Levage", color: "#7CB342" },
  { code: "ELM-MAC", libelle: "Électromécanique - Machines", color: "#7CB342" },
  { code: "ELM-ECH", libelle: "Électromécanique - Échafaudage", color: "#7CB342" },
  { code: "ELM-TM", libelle: "Électromécanique - Ascenseurs", color: "#7CB342" },
  { code: "ELM-EXP", libelle: "Électromécanique - Exploitation ascenseurs", color: "#7CB342" },
  { code: "ELM-ESC", libelle: "Électromécanique - Escaliers mécaniques", color: "#7CB342" },
  { code: "ELM-IGH", libelle: "Électromécanique - Ascenseurs IGH", color: "#7CB342" },
  { code: "ELM-PPB", libelle: "Portes et portails", color: "#8E44AD" },
  { code: "ELM-ESX", libelle: "Équipements sportifs", color: "#7CB342" },
  { code: "EDX-EDL", libelle: "Équipements de loisirs", color: "#2E86C1" },
  { code: "EDX-ADJ", libelle: "Aires de jeux", color: "#2E86C1" },
  { code: "EDX-CDH", libelle: "Protection contre les chutes de hauteur", color: "#2E86C1" },
  { code: "EDX-RAC", libelle: "Racks de stockage", color: "#2E86C1" },
  { code: "SEC-EXP", libelle: "Sécurité incendie en exploitation", color: "#E74C3C" },
  { code: "SSI-EXP", libelle: "SSI en exploitation", color: "#E74C3C" },
  { code: "DEF-EXP", libelle: "Désenfumage en exploitation", color: "#E74C3C" },
  { code: "DEF-IGH", libelle: "Désenfumage IGH", color: "#E74C3C" },
  { code: "HYC-EXP", libelle: "Installations hydrauliques complexes", color: "#E74C3C" },
  { code: "EAE-EXP", libelle: "Extinction automatique à eau", color: "#E74C3C" },
  { code: "POT-CAL", libelle: "Potentiel calorifique IGH", color: "#E74C3C" },
  { code: "FLU-MED", libelle: "Fluides médicaux", color: "#E74C3C" },
  { code: "THE-GAZ", libelle: "Thermique - Gaz / Cuisson", color: "#D4AC0D" },
  { code: "THE-ITH", libelle: "Chaudières", color: "#D4AC0D" },
  { code: "THE-CEE", libelle: "Certificat économie d'énergie", color: "#D4AC0D" },
  { code: "THE-BAT", libelle: "Thermique bâtiment", color: "#D4AC0D" },
  { code: "THE-ICL", libelle: "Inspection climatisation", color: "#D4AC0D" },
  { code: "THE-DIS", libelle: "Disconnecteurs", color: "#D4AC0D" },
  { code: "SST-AEA", libelle: "Aération des locaux de travail", color: "#5DADE2" },
  { code: "PRE-EES", libelle: "Pression - équipements en service", color: "#E74C3C" },
  { code: "GST-MAT", libelle: "Gestion du matériel", color: "#16A085" },
  { code: "EVA-TECH", libelle: "Évaluation technique transverse", color: "#8B5CF6" },
];

const INITIAL_QUALIF_ITEMS = [
  { id: "q1", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "1", libelle: "Périodique", color: "#4CAF50" },
  { id: "q2", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "2", libelle: "Périodique ERP 1er", color: "#4CAF50" },
  { id: "q3", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "3.1", libelle: "Initiale Bleu", color: "#4CAF50" },
  { id: "q4", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "3.2", libelle: "Initiale Jaune", color: "#4CAF50" },
  { id: "q5", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "1", libelle: "Périodique HT", color: "#4CAF50" },
  { id: "q6", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "3.2", libelle: "Initiale HT 13-100", color: "#4CAF50" },
  { id: "q7", cat: "ELE-REG", catLabel: "Électricité réglementaire", numero: "3.3", libelle: "Initiale HT 13-200", color: "#4CAF50" },
  { id: "q8", cat: "ELE-ATX", catLabel: "Électricité ATEX", numero: "2", libelle: "ATEX", color: "#4CAF50" },
  { id: "q9", cat: "ELE-CEM", catLabel: "Courants faibles / CEM", numero: "1", libelle: "Eval Général", color: "#4CAF50" },
  { id: "q10", cat: "ELE-TIR", catLabel: "Thermographie infrarouge", numero: "1", libelle: "Thermo", color: "#4CAF50" },
  { id: "q11", cat: "ELE-TIR", catLabel: "Thermographie infrarouge", numero: "3", libelle: "Thermo Q19", color: "#4CAF50" },
  { id: "q12", cat: "ELE-AST", catLabel: "Électricité assistance", numero: "3", libelle: "Diag Elec.", color: "#4CAF50" },
  { id: "q13", cat: "ELE-IGH", catLabel: "Électricité IGH", numero: "", libelle: "IGH", color: "#4CAF50" },
  { id: "q14", cat: "ELEC-CTC", catLabel: "Électricité construction", numero: "", libelle: "Construction", color: "#4CAF50" },
  { id: "q15", cat: "ELE-FOU", catLabel: "Électricité foudre", numero: "1", libelle: "VP hors ICPE", color: "#4CAF50" },
  { id: "q16", cat: "ELE-FOU", catLabel: "Électricité foudre", numero: "2", libelle: "VP et VC en ICPE", color: "#4CAF50" },
  { id: "q17", cat: "ELE-FOU", catLabel: "Électricité foudre", numero: "3", libelle: "ARF + ET", color: "#4CAF50" },
  { id: "q18", cat: "ELE-TAX", catLabel: "Aides & taxes énergie (TIRUERT/ADVENIR)", numero: "2", libelle: "TIRUERT / ADVENIR", color: "#4CAF50" },
  { id: "q19", cat: "ELE-PTV", catLabel: "Électricité photovoltaïque", numero: "2", libelle: "Phot. Conf.", color: "#4CAF50" },
  { id: "q20", cat: "THE-ENR", catLabel: "Énergies renouvelables", numero: "3", libelle: "Attestation ENR (S21)", color: "#4CAF50" },
  { id: "q21", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.1", libelle: "Chariot - transpalette", color: "#F97316" },
  { id: "q22", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.2", libelle: "Pont roulant - palan", color: "#F97316" },
  { id: "q23", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.6", libelle: "Grue mobile", color: "#F97316" },
  { id: "q24", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.7", libelle: "Grue à tour", color: "#F97316" },
  { id: "q25", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.3", libelle: "Engins chantier", color: "#F97316" },
  { id: "q26", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "1.4", libelle: "Elev. vehicules", color: "#F97316" },
  { id: "q27", cat: "ELM-LEV", catLabel: "Électromécanique - Levage", numero: "2", libelle: "Mise en service", color: "#F97316" },
  { id: "q28", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.1", libelle: "Compacteurs", color: "#F97316" },
  { id: "q29", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.2", libelle: "BOM", color: "#F97316" },
  { id: "q30", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.3", libelle: "Presse plieuse", color: "#F97316" },
  { id: "q31", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.5", libelle: "Massicot", color: "#F97316" },
  { id: "q32", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.6", libelle: "Centrifugeuse", color: "#F97316" },
  { id: "q33", cat: "ELM-MAC", catLabel: "Électromécanique - Machines", numero: "1.7", libelle: "Terrassement", color: "#F97316" },
  { id: "q34", cat: "ELM-ECH", catLabel: "Électromécanique - Échafaudage", numero: "1", libelle: "VGP Mobile", color: "#F97316" },
  { id: "q35", cat: "ELM-ECH", catLabel: "Électromécanique - Échafaudage", numero: "2", libelle: "VGP Fixe", color: "#F97316" },
  { id: "q36", cat: "ELM-ECH", catLabel: "Électromécanique - Échafaudage", numero: "3", libelle: "Remise en Service", color: "#F97316" },
  { id: "q37", cat: "ELM-TM", catLabel: "Électromécanique - Ascenseurs", numero: "1", libelle: "Ascenseurs VGP", color: "#F97316" },
  { id: "q38", cat: "ELM-TM", catLabel: "Électromécanique - Ascenseurs", numero: "2", libelle: "Ascenseurs CTQ", color: "#F97316" },
  { id: "q39", cat: "ELM-TM", catLabel: "Électromécanique - Ascenseurs", numero: "3", libelle: "Ascenseurs CE", color: "#F97316" },
  { id: "q40", cat: "ELM-EXP", catLabel: "Électromécanique - Exploitation ascenseurs", numero: "2", libelle: "Ascenseurs VRE", color: "#F97316" },
  { id: "q41", cat: "ELM-ESC", catLabel: "Électromécanique - Escaliers mécaniques", numero: "2", libelle: "Escalier Mécaniques", color: "#F97316" },
  { id: "q42", cat: "ELM-IGH", catLabel: "Électromécanique - Ascenseurs IGH", numero: "", libelle: "Ascenseurs IGH", color: "#F97316" },
  { id: "q43", cat: "ELM-PPB", catLabel: "Portes et portails", numero: "1", libelle: "Portes et Portail", color: "#F97316" },
  { id: "q44", cat: "ELM-PPB", catLabel: "Portes et portails", numero: "3", libelle: "Conformité", color: "#F97316" },
  { id: "q45", cat: "ELM-ESX", catLabel: "Équipements sportifs", numero: "2", libelle: "Equip Sportifs", color: "#F97316" },
  { id: "q46", cat: "EDX-EDL", catLabel: "Équipements de loisirs", numero: "1", libelle: "Equip Escalade", color: "#2E86C1" },
  { id: "q47", cat: "EDX-ADJ", catLabel: "Aires de jeux", numero: "2", libelle: "Air de Jeux", color: "#2E86C1" },
  { id: "q48", cat: "EDX-CDH", catLabel: "Protection contre les chutes de hauteur", numero: "1", libelle: "EPI - Harnais", color: "#2E86C1" },
  { id: "q49", cat: "EDX-RAC", catLabel: "Racks de stockage", numero: "1", libelle: "Rack Stockage", color: "#2E86C1" },
  { id: "q50", cat: "EDX-CDH", catLabel: "Protection contre les chutes de hauteur", numero: "3", libelle: "Ligne Vie", color: "#2E86C1" },
  { id: "q51", cat: "SEC-EXP", catLabel: "Sécurité incendie en exploitation", numero: "1", libelle: "Sécu. Exploitation", color: "#E74C3C" },
  { id: "q52", cat: "SEC-EXP", catLabel: "Sécurité incendie en exploitation", numero: "3", libelle: "Désenfumage", color: "#E74C3C" },
  { id: "q53", cat: "SSI-EXP", catLabel: "SSI en exploitation", numero: "2", libelle: "SSI complexe", color: "#E74C3C" },
  { id: "q54", cat: "SSI-EXP", catLabel: "SSI en exploitation", numero: "3", libelle: "Triennal SSI", color: "#E74C3C" },
  { id: "q55", cat: "DEF-EXP", catLabel: "Désenfumage en exploitation", numero: "2", libelle: "Exploitation Désen.", color: "#E74C3C" },
  { id: "q56", cat: "DEF-EXP", catLabel: "Désenfumage en exploitation", numero: "3", libelle: "Triennal Désen.", color: "#E74C3C" },
  { id: "q57", cat: "DEF-IGH", catLabel: "Désenfumage IGH", numero: "3", libelle: "Dés. En IGH", color: "#E74C3C" },
  { id: "q58", cat: "HYC-EXP", catLabel: "Installations hydrauliques complexes", numero: "1", libelle: "Sprinklage", color: "#E74C3C" },
  { id: "q59", cat: "HYC-EXP", catLabel: "Installations hydrauliques complexes", numero: "2", libelle: "Sprinklage", color: "#E74C3C" },
  { id: "q60", cat: "EAE-EXP", catLabel: "Extinction automatique à eau", numero: "4", libelle: "Sprinklage", color: "#E74C3C" },
  { id: "q61", cat: "POT-CAL", catLabel: "Potentiel calorifique IGH", numero: "3", libelle: "Potentiel Cal. IGH", color: "#E74C3C" },
  { id: "q62", cat: "FLU-MED", catLabel: "Fluides médicaux", numero: "3", libelle: "Fluides médicaux", color: "#E74C3C" },
  { id: "q63", cat: "THE-ENR", catLabel: "Énergies renouvelables", numero: "3", libelle: "Filiere photovoltaique", color: "#4CAF50" },
  { id: "q64", cat: "THE-GAZ", catLabel: "Thermique - Gaz / Cuisson", numero: "1", libelle: "Gaz - Cuisson", color: "#EAB308" },
  { id: "q65", cat: "THE-GAZ", catLabel: "Thermique - Gaz / Cuisson", numero: "2", libelle: "Thermique", color: "#EAB308" },
  { id: "q66", cat: "THE-GAZ", catLabel: "Thermique - Gaz / Cuisson", numero: "3", libelle: "Fluides médicaux", color: "#EAB308" },
  { id: "q67", cat: "THE-ITH", catLabel: "Chaudières", numero: "2", libelle: "Chaudières", color: "#EAB308" },
  { id: "q68", cat: "THE-CEE", catLabel: "Certificat économie d'énergie", numero: "2", libelle: "Isol Eau Chaude", color: "#EAB308" },
  { id: "q69", cat: "THE-BAT", catLabel: "Thermique bâtiment", numero: "2", libelle: "Thermique Bâtiment", color: "#EAB308" },
  { id: "q70", cat: "THE-ICL", catLabel: "Inspection climatisation", numero: "3", libelle: "Climatisation", color: "#EAB308" },
  { id: "q71", cat: "THE-DIS", catLabel: "Disconnecteurs", numero: "4", libelle: "Disconnecteurs", color: "#EAB308" },
  { id: "q72", cat: "SST-AEA", catLabel: "Aération des locaux de travail", numero: "", libelle: "Aération", color: "#5DADE2" },
  { id: "q73", cat: "PRE-EES", catLabel: "Pression - équipements en service", numero: "1", libelle: "Pression hors ASAP", color: "#E74C3C" },
  { id: "q74", cat: "GST-MAT", catLabel: "Gestion du matériel", numero: "", libelle: "Gestion du matériel", color: "#16A085" },
  { id: "q75", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Eqt - Machines", color: "#8B5CF6" },
  { id: "q76", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Eqt de Loisirs", color: "#8B5CF6" },
  { id: "q77", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Rack de stockage", color: "#8B5CF6" },
  { id: "q78", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Portes et portails", color: "#8B5CF6" },
  { id: "q79", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "EPI Levage", color: "#8B5CF6" },
  { id: "q80", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Incendie", color: "#8B5CF6" },
  { id: "q81", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Pression hors ASAP", color: "#8B5CF6" },
  { id: "q82", cat: "EVA-TECH", catLabel: "Évaluation technique transverse", numero: "", libelle: "Gaz-Thermique", color: "#8B5CF6" },
];

const INITIAL_PQ = {
  p0: [],
  p1: ["q1", "q2", "q3", "q4", "q5", "q6", "q10", "q11", "q12", "q13", "q18", "q21", "q22", "q25", "q26", "q28", "q30", "q31", "q33", "q43", "q49", "q64", "q65", "q72"],
  p2: ["q1", "q2", "q3", "q4", "q5", "q18", "q51", "q53", "q54", "q55", "q56", "q64", "q80"],
  p3: ["q1", "q2", "q64", "q65", "q66", "q67", "q69", "q70", "q71", "q82"],
  p4: ["q1", "q2", "q3", "q4", "q5", "q8", "q21", "q22", "q25", "q26", "q28", "q30", "q31", "q33", "q43", "q48", "q64"],
  p5: ["q1", "q2", "q21", "q22", "q26", "q34", "q43", "q48", "q64"],
  p6: ["q1", "q2", "q3", "q4", "q5", "q19", "q20", "q21", "q22", "q25", "q26", "q27", "q33", "q34", "q43", "q48", "q50", "q64", "q79"],
  p7: ["q1", "q2", "q37", "q38", "q40", "q41", "q43", "q64"],
  p8: ["q1", "q2", "q3", "q4", "q5", "q9", "q37", "q38", "q40", "q41", "q43", "q51", "q53", "q55", "q64", "q65"],
  p9: ["q1", "q2", "q3", "q4", "q5", "q6", "q9", "q19", "q20", "q51", "q53", "q55", "q64", "q80"],
  p10: ["q1", "q2", "q3", "q21", "q22", "q26", "q48", "q64"],
  p11: ["q1", "q2", "q51", "q54", "q56", "q64", "q74", "q79"],
  p12: ["q1", "q2", "q21", "q22", "q26", "q48", "q64"],
  p13: ["q1", "q2", "q3", "q4", "q5", "q6", "q10", "q11", "q64", "q72"],
  p14: ["q1", "q2", "q8", "q21", "q22", "q26", "q48", "q70"],
  p15: [],
};

const AVATAR_PALETTE = ["#1e3a5f", "#0EA5C7", "#2563EB", "#F5A623", "#3FA796", "#8B5CF6", "#E5484D"];
const hashColor = (s) => AVATAR_PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length];
const initials = (p) => `${p.prenom?.[0] ?? ""}${p.nom?.[0] ?? ""}`.toUpperCase();

function emptyPersonne() {
  return { id: null, prenom: "", nom: "", poste: "", telephone: "", email: "", agenceId: "brive", matricule: "", ville: "", specialites: "", photoUrl: null };
}

/* ---------------------------------------------------------------
   COMPOSANT PRINCIPAL
--------------------------------------------------------------- */

// Ordre d'affichage des couleurs (catégories)
/* ---------------------------------------------------------------
   SUPABASE — normalisation + upload photo
--------------------------------------------------------------- */
const normalizePersonne = (p) => ({
  ...p,
  agenceId:    p.agence_id  ?? p.agenceId  ?? '',
  photoUrl:    p.photo_url  ?? p.photoUrl  ?? null,
  specialites: p.specialites ?? '',
});

const normalizeItem = (it) => ({
  ...it,
  catLabel: it.cat_label || it.catLabel || '',
  cat:      it.cat       || 'custom',
});
async function uploadPhoto(personneId, base64DataUrl) {
  const blob = await (await fetch(base64DataUrl)).blob();
  const path = `${personneId}.jpg`;
  const { error } = await supabase.storage.from('photos').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}
const COLOR_ORDER = {
  "#4CAF50": 0,  // Électricité — vert
  "#F97316": 1,  // Électromécanique — orange
  "#EAB308": 2,  // Thermique — jaune
  "#E74C3C": 3,  // Sécurité incendie — rouge
  "#2E86C1": 4,  // Protection/EDX — bleu
  "#5DADE2": 5,  // Aération — bleu clair
  "#16A085": 6,  // Gestion matériel — émeraude
  "#8B5CF6": 99, // EVA-TECH — violet (dernier)
};

const INITIAL_ORDERED_IDS = [...INITIAL_QUALIF_ITEMS]
  .sort((a, b) => (COLOR_ORDER[a.color] ?? 50) - (COLOR_ORDER[b.color] ?? 50))
  .map((it) => it.id);

export default function App() {
  const [loading, setLoading]         = useState(true);
  const [saving,  setSaving]          = useState(false);
  const [lastSaved, setLastSaved]     = useState(null);
  const [personnes, setPersonnes]     = useState([]);
  const [pq, setPq]                   = useState({});
  const [qualifItems, setQualifItems] = useState([]);
  const [orderedItemIds, setOrderedItemIds] = useState([]);
  const [qualifSearch, setQualifSearch] = useState("");
  const [view, setView]               = useState("trombi");
  const [agenceFilter, setAgenceFilter] = useState("toutes");
  const [search, setSearch]           = useState("");
  const [adminMode, setAdminMode]     = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingPersonne, setEditingPersonne] = useState(null);
  const [addingItem,     setAddingItem]      = useState(false);
  const [colorPickerFor, setColorPickerFor]  = useState(null);
  const [editingItem,    setEditingItem]     = useState(null);

  const bpq = (rows) => { const m={}; (rows||[]).forEach(r=>{ if(!m[r.personne_id])m[r.personne_id]=[]; m[r.personne_id].push(r.item_id); }); return m; };

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [{data:p, error:ep},{data:i, error:ei},{data:q, error:eq}] = await Promise.all([
          supabase.from('personnes').select('*'),
          supabase.from('qualif_items').select('*').order('position'),
          supabase.from('personne_qualifications').select('*'),
        ]);
        if (ep || ei || eq) {
          setError(`Erreur Supabase : ${(ep||ei||eq).message}`);
          setLoading(false);
          return;
        }
        setPersonnes((p||[]).map(normalizePersonne));
        setQualifItems((i||[]).map(normalizeItem));
        setOrderedItemIds((i||[]).map(it=>it.id));
        setPq(bpq(q));
        setLoading(false);
      } catch(e) {
        setError(`Erreur de connexion : ${e.message}`);
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    const ch = supabase.channel('trombi-rt')
      .on('postgres_changes',{event:'*',schema:'public',table:'personnes'},async()=>{const{data}=await supabase.from('personnes').select('*');setPersonnes((data||[]).map(normalizePersonne));})
      .on('postgres_changes',{event:'*',schema:'public',table:'qualif_items'},async()=>{const{data}=await supabase.from('qualif_items').select('*').order('position');setQualifItems((data||[]).map(normalizeItem));setOrderedItemIds((data||[]).map(it=>it.id));})
      .on('postgres_changes',{event:'*',schema:'public',table:'personne_qualifications'},async()=>{const{data}=await supabase.from('personne_qualifications').select('*');setPq(bpq(data));})
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  async function rafraichir() {
    setLoading(true);
    const [{data:p},{data:i},{data:q}] = await Promise.all([supabase.from('personnes').select('*'),supabase.from('qualif_items').select('*').order('position'),supabase.from('personne_qualifications').select('*')]);
    setPersonnes((p||[]).map(normalizePersonne)); setQualifItems((i||[]).map(normalizeItem)); setOrderedItemIds((i||[]).map(it=>it.id)); setPq(bpq(q)); setLoading(false);
  }

  const filteredPersonnes = useMemo(() => personnes.filter(p => {
    const ma = agenceFilter==="toutes" || p.agenceId===agenceFilter;
    const q = search.trim().toLowerCase();
    return ma && (!q||`${p.prenom} ${p.nom} ${p.poste}`.toLowerCase().includes(q));
  }), [personnes,agenceFilter,search]);

  function markSaved() { setLastSaved(new Date()); setSaving(false); }

  async function savePersonne(data) {
    setSaving(true);
    const norm={...data,agence_id:data.agenceId||data.agence_id||'brive'};
    const{photoUrl,agenceId,...dbData}=norm;
    if(data.id&&personnes.find(p=>p.id===data.id)){setPersonnes(prev=>prev.map(p=>p.id===data.id?{...p,...norm}:p));await supabase.from('personnes').update(dbData).eq('id',data.id);}
    else{const id=data.id||`p${Date.now()}`;const np={...norm,id};const{photoUrl:_,agenceId:__,...ins}=np;setPersonnes(prev=>[...prev,np]);setPq(prev=>({...prev,[id]:[]}));await supabase.from('personnes').insert(ins);}
    markSaved();setEditingPersonne(null);
  }
  async function deletePersonne(id){setPersonnes(prev=>prev.filter(p=>p.id!==id));setPq(prev=>{const n={...prev};delete n[id];return n;});setSaving(true);await supabase.from('personnes').delete().eq('id',id);markSaved();}
  async function updatePersonPhoto(id,b64){setSaving(true);try{const url=await uploadPhoto(id,b64);await supabase.from('personnes').update({photo_url:url}).eq('id',id);setPersonnes(prev=>prev.map(p=>p.id===id?{...p,photo_url:url,photoUrl:url}:p));}catch(e){console.error(e);}markSaved();}
  async function toggleItem(pid,iid){const held=(pq[pid]??[]).includes(iid);setPq(prev=>({...prev,[pid]:held?(prev[pid]??[]).filter(x=>x!==iid):[...(prev[pid]??[]),iid]}));setSaving(true);if(held)await supabase.from('personne_qualifications').delete().match({personne_id:pid,item_id:iid});else await supabase.from('personne_qualifications').insert({personne_id:pid,item_id:iid});markSaved();}
  async function addQualifItem(catLabel,numero,libelle,color,insertAfterColor){
    const id=`q${Date.now()}`;const position=orderedItemIds.length;
    const ni={id,cat:'custom',cat_label:catLabel,catLabel,numero,libelle,color,position};
    setQualifItems(prev=>[...prev,ni]);
    setOrderedItemIds(prev=>{const iMap=Object.fromEntries([...qualifItems,ni].map(it=>[it.id,it]));const lastIdx=insertAfterColor?prev.reduce((b,iid,i)=>iMap[iid]?.color===insertAfterColor?i:b,-1):-1;const next=[...prev];next.splice(lastIdx>=0?lastIdx+1:next.length,0,id);return next;});
    setSaving(true);await supabase.from('qualif_items').insert({id,cat:'custom',cat_label:catLabel,numero,libelle,color,position});markSaved();setAddingItem(false);
  }
  async function deleteQualifItem(itemId){setQualifItems(prev=>prev.filter(it=>it.id!==itemId));setOrderedItemIds(prev=>prev.filter(id=>id!==itemId));setPq(prev=>{const n={};for(const pid in prev)n[pid]=prev[pid].filter(id=>id!==itemId);return n;});setSaving(true);await supabase.from('qualif_items').delete().eq('id',itemId);markSaved();}
  async function changeItemColor(itemId,color){setQualifItems(prev=>prev.map(it=>it.id===itemId?{...it,color}:it));setColorPickerFor(null);setSaving(true);await supabase.from('qualif_items').update({color}).eq('id',itemId);markSaved();}
  async function renameQualifItem(itemId,{cat,catLabel,numero,libelle,color}){setQualifItems(prev=>prev.map(it=>it.id===itemId?{...it,cat:cat||it.cat,catLabel,cat_label:catLabel,numero,libelle,color:color||it.color}:it));setEditingItem(null);setSaving(true);await supabase.from('qualif_items').update({cat:cat||'custom',cat_label:catLabel,numero,libelle,color}).eq('id',itemId);markSaved();}
  async function moveItemBefore(dragId,targetId){const next=orderedItemIds.filter(id=>id!==dragId);const idx=next.indexOf(targetId);next.splice(idx<0?next.length:idx,0,dragId);setOrderedItemIds(next);setSaving(true);await Promise.all(next.map((id,pos)=>supabase.from('qualif_items').update({position:pos}).eq('id',id)));markSaved();}
  async function moveCatBefore(dragColor,targetColor){const iMap=Object.fromEntries(qualifItems.map(it=>[it.id,it]));const prev=[...orderedItemIds];const dIds=prev.filter(id=>iMap[id]?.color===dragColor);const rest=prev.filter(id=>iMap[id]?.color!==dragColor);const idx=rest.findIndex(id=>iMap[id]?.color===targetColor);rest.splice(idx<0?rest.length:idx,0,...dIds);setOrderedItemIds(rest);setSaving(true);await Promise.all(rest.map((id,pos)=>supabase.from('qualif_items').update({position:pos}).eq('id',id)));markSaved();}

  const agencesAffichees = (view === "qualifs" || view === "impression") ? AGENCES.filter((a) => a.id !== "direction") : AGENCES;

  // Impression : orientation selon l'onglet, toutes les agences affichées, couleurs préservées
  function handlePrint() {
    const orientation = view === "trombi" ? "landscape" : "portrait";
    const prev = agenceFilter;
    // Afficher toutes les agences avant d'imprimer
    setAgenceFilter("toutes");
    const s = document.createElement("style");
    s.id = "__print_page__";
    s.textContent = `@media print { @page { size: A3 ${orientation}; margin: 5mm; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }`;
    document.head.appendChild(s);
    setTimeout(() => {
      window.print();
      setTimeout(() => { s.remove(); setAgenceFilter(prev); }, 300);
    }, 150);
  }


  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#f1f5f9" }}>
      <img src={SOCOTEC_LOGO} alt="Socotec" style={{ height: 64, width: "auto" }} />
      <p style={{ color: "#64748b", fontSize: 15, fontWeight: 600 }}>Chargement des données…</p>
      <div style={{ width: 36, height: 36, border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#fef2f2", padding: 32 }}>
      <img src={SOCOTEC_LOGO} alt="Socotec" style={{ height: 48, width: "auto" }} />
      <h2 style={{ color: "#dc2626", fontSize: 18, fontWeight: 700, margin: 0 }}>Erreur de connexion à la base de données</h2>
      <p style={{ color: "#7f1d1d", fontSize: 14, maxWidth: 480, textAlign: "center", background: "#fee2e2", padding: "12px 20px", borderRadius: 12, fontFamily: "monospace" }}>{error}</p>
      <p style={{ color: "#64748b", fontSize: 13 }}>Vérifiez les variables d'environnement Supabase dans Vercel (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY)</p>
      <button onClick={() => { setError(null); setLoading(true); }} style={{ padding: "10px 20px", borderRadius: 8, background: "#1e3a5f", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-3 sm:p-6 print:p-0">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }

          /* Trombinoscope : paysage A3, TOUT en une seule page, pas de saut */
          .trombi-view { zoom: 0.68; transform-origin: top left; }
          .trombi-agency-page { page-break-after: auto !important; break-after: auto !important; page-break-before: auto !important; }
          .trombi-view .trombi-rail  { display: none !important; }
          .trombi-view .trombi-card  { padding: 5px !important; }
          .trombi-view .trombi-photo { width: 50px !important; height: 50px !important; font-size: 14px !important; }
          .trombi-view .trombi-name  { font-size: 8px !important; margin-top: 3px !important; }
          .trombi-view .trombi-sub   { font-size: 7px !important; }
          .trombi-view .trombi-spec  { display: none !important; }

          /* Qualifications : portrait A3, TOUT en une seule page, pas de saut */
          .impression-page { page-break-after: auto !important; break-after: auto !important; page-break-before: auto !important; }
          .qualifs-print-wrapper { zoom: 0.70; transform-origin: top left; }
          .qualifs-print-wrapper table  { font-size: 6.5px !important; }
          .qualifs-print-wrapper tr     { height: 11px !important; }
          .qualifs-print-wrapper td,
          .qualifs-print-wrapper th     { padding: 0 3px !important; line-height: 1 !important; }
        }
        .print-only { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* HEADER */}
      <div className="no-print px-2">
        <header
          className="text-white rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}
        >
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <img src={SOCOTEC_LOGO} alt="Socotec" className="h-11 w-auto shrink-0" />
              <div>
                <p className="text-[11px] tracking-[0.25em] text-cyan-200 font-semibold uppercase">Socotec</p>
                <h1 className="text-2xl font-extrabold tracking-tight uppercase">Agence Limousin</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Indicateur sauvegarde */}
              {adminMode && (
                <span className="text-xs text-white/60 flex items-center gap-1.5">
                  {saving ? (
                    <>
                      <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                      Sauvegarde…
                    </>
                  ) : lastSaved ? (
                    <>
                      <Check size={12} className="text-green-300" />
                      Sauvegardé {lastSaved.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </>
                  ) : null}
                </span>
              )}
              {/* Rafraîchir */}
              <button
                onClick={rafraichir}
                title="Recharger les données depuis le stockage partagé"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                Rafraîchir
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition"
              >
                <Printer size={16} /> Imprimer
              </button>
              <button
                onClick={() => (adminMode ? setAdminMode(false) : setShowPasswordModal(true))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  adminMode ? "bg-amber-400 text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Settings2 size={16} />
                {adminMode ? "Mode édition actif" : "Activer l'édition"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <TabButton active={view === "trombi"} onClick={() => setView("trombi")} icon={<LayoutGrid size={16} />} label="Trombinoscope" />
            <TabButton active={view === "impression"} onClick={() => setView("impression")} icon={<ShieldCheck size={16} />} label="Qualifications" />
            <TabButton active={view === "qualifs"} onClick={() => setView("qualifs")} icon={<FileText size={16} />} label="Résumé" />
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="bg-black/15 border-t border-white/10">
          <div className="py-3 px-2 flex items-center gap-3 flex-wrap">
            {["toutes", ...agencesAffichees.map((a) => a.id)].map((id) => {
              const label = id === "toutes" ? "Toutes les agences" : AGENCES.find((a) => a.id === id)?.nom;
              return (
                <button
                  key={id}
                  onClick={() => setAgenceFilter(id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                    agenceFilter === id ? "bg-cyan-400 border-cyan-400 text-slate-900" : "border-white/20 text-white/80 hover:border-white/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {view === "trombi" && (
              <div className="ml-auto relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un nom, un poste…"
                  className="bg-white/10 placeholder-white/40 text-white text-sm pl-9 pr-3 py-1.5 rounded-lg outline-none focus:bg-white/20 w-64"
                />
              </div>
            )}

            {(view === "trombi" || view === "impression") && adminMode && (
              <button
                onClick={() => setEditingPersonne(emptyPersonne())}
                className="flex items-center gap-1.5 bg-cyan-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-cyan-300"
              >
                <Plus size={14} /> Ajouter un technicien
              </button>
            )}
          </div>
        </div>
        </header>
      </div>

      {/* En-tête imprimable uniquement */}
      <div className="print-only px-2 pt-2 pb-3">
        <div className="flex items-center gap-3">
          <img src={SOCOTEC_LOGO} alt="Socotec" className="h-8 w-auto" />
          <div>
            <h1 className="text-lg font-extrabold uppercase" style={{ color: "#1e3a5f" }}>Agence Socotec Limousin — {view === "trombi" ? "Trombinoscope" : "Qualifications"}</h1>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <main className="px-2 py-6 print:px-0 print:py-0">
        {view === "trombi" ? (
          <TrombinoscopeView
            agences={agencesAffichees}
            personnes={filteredPersonnes}
            adminMode={adminMode}
            onEdit={setEditingPersonne}
            onDelete={deletePersonne}
            onPhotoChange={updatePersonPhoto}
          />
        ) : view === "qualifs" ? (
          <QualificationsView
            agences={agencesAffichees}
            personnes={personnes}
            items={qualifItems}
            pq={pq}
            adminMode={adminMode}
            orderedItemIds={orderedItemIds}
            qualifSearch={qualifSearch}
            setQualifSearch={setQualifSearch}
            onToggle={toggleItem}
            onAddItem={() => setAddingItem(true)}
            onDeleteItem={deleteQualifItem}
            onPickColor={setColorPickerFor}
            onEditItem={setEditingItem}
            onMoveItemBefore={moveItemBefore}
            onMoveCatBefore={moveCatBefore}
          />
        ) : (
          <div className="qualifs-print-wrapper">
            <ImpressionView
              agences={agencesAffichees}
              personnes={personnes}
              items={qualifItems}
              pq={pq}
              orderedItemIds={orderedItemIds}
              agenceFilter={agenceFilter}
              adminMode={adminMode}
              onToggle={toggleItem}
              onAddItem={() => setAddingItem(true)}
              onDeleteItem={deleteQualifItem}
              onPickColor={setColorPickerFor}
              onEditItem={setEditingItem}
              onEdit={setEditingPersonne}
              onDelete={deletePersonne}
              onPhotoChange={updatePersonPhoto}
            />
          </div>
        )}
      </main>

      <footer className="no-print px-2 pb-10 text-xs text-slate-400">
        Données extraites du fichier Excel source · les photos restent à ajouter via le mode édition · maquette en mémoire, à connecter à une base pour la persistance.
      </footer>

      {editingPersonne && (
        <PersonneModal
          personne={editingPersonne}
          onClose={() => setEditingPersonne(null)}
          onSave={savePersonne}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          items={qualifItems}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => renameQualifItem(editingItem.id, updates)}
        />
      )}

      {addingItem && (
        <AddItemModal
          items={qualifItems}
          orderedItemIds={orderedItemIds}
          onClose={() => setAddingItem(false)}
          onSave={(catLabel, numero, libelle, color, insertAfterColor) => addQualifItem(catLabel, numero, libelle, color, insertAfterColor)}
        />
      )}

      {colorPickerFor && (
        <ColorPickerModal
          item={qualifItems.find((it) => it.id === colorPickerFor)}
          onClose={() => setColorPickerFor(null)}
          onSave={(color) => changeItemColor(colorPickerFor, color)}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setAdminMode(true);
            setShowPasswordModal(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SOUS-COMPOSANTS
--------------------------------------------------------------- */

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={active ? { color: "#1e3a5f" } : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition ${
        active ? "bg-slate-100" : "text-white/70 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Avatar({ personne, size = 64 }) {
  if (personne.photoUrl) {
    return (
      <img
        src={personne.photoUrl}
        alt={`${personne.prenom} ${personne.nom}`}
        style={{ width: size, height: size }}
        className="trombi-photo rounded-full object-cover border-2 border-white shadow"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, background: hashColor(personne.nom + personne.prenom) }}
      className="trombi-photo rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow"
    >
      <span style={{ fontSize: size * 0.34 }}>{initials(personne)}</span>
    </div>
  );
}

const CROP_SIZE = 280;

function CropModal({ src, onClose, onSave }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const imgRef = useRef(null);

  const baseScale = naturalSize
    ? Math.max(CROP_SIZE / naturalSize.w, CROP_SIZE / naturalSize.h)
    : 1;
  const currentScale = baseScale * zoom;
  const imgW = naturalSize ? naturalSize.w * currentScale : CROP_SIZE;
  const imgH = naturalSize ? naturalSize.h * currentScale : CROP_SIZE;

  function startDrag(clientX, clientY) {
    setDragging(true);
    setDragStart({ x: clientX - pos.x, y: clientY - pos.y });
  }
  function moveDrag(clientX, clientY) {
    if (!dragging || !dragStart) return;
    setPos({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  }
  function endDrag() { setDragging(false); }

  function handleSave() {
    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const dx = CROP_SIZE / 2 + pos.x - imgW / 2;
    const dy = CROP_SIZE / 2 + pos.y - imgH / 2;
    ctx.drawImage(imgRef.current, dx, dy, imgW, imgH);
    onSave(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={18} /></button>
        <h3 className="font-bold text-base mb-1" style={{ color: "#1e3a5f" }}>Ajuster la photo</h3>
        <p className="text-xs text-slate-400 mb-4">Glissez pour repositionner · utilisez le curseur pour zoomer</p>

        {/* Zone de recadrage */}
        <div
          style={{
            width: CROP_SIZE, height: CROP_SIZE, borderRadius: "50%",
            overflow: "hidden", margin: "0 auto",
            cursor: dragging ? "grabbing" : "grab",
            border: "3px solid #2563eb", position: "relative",
            background: "#f1f5f9", userSelect: "none", touchAction: "none",
          }}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
          onTouchMove={(e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
          onTouchEnd={endDrag}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={(e) => setNaturalSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
            style={{
              position: "absolute",
              width: imgW, height: imgH,
              left: CROP_SIZE / 2 + pos.x - imgW / 2,
              top: CROP_SIZE / 2 + pos.y - imgH / 2,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Curseur zoom */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Zoom</span>
            <span className="text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range" min="1" max="4" step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-blue-700"
          />
          <div className="flex justify-between text-[10px] text-slate-300 mt-0.5">
            <span>1×</span><span>4×</span>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-950">Valider</button>
        </div>
      </div>
    </div>
  );
}

function AvatarUpload({ personne, size = 64, editable, onChange }) {
  const [cropSrc, setCropSrc] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!editable) return <Avatar personne={personne} size={size} />;

  return (
    <>
      <label
        className="relative cursor-pointer group/avatar block rounded-full"
        style={{ width: size, height: size }}
        title="Cliquer pour changer la photo"
      >
        <Avatar personne={personne} size={size} />
        <span className="absolute inset-0 rounded-full bg-black/0 group-hover/avatar:bg-black/45 transition flex items-center justify-center opacity-0 group-hover/avatar:opacity-100">
          <Camera size={Math.max(14, size * 0.32)} className="text-white" />
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      {cropSrc && (
        <CropModal
          src={cropSrc}
          onClose={() => setCropSrc(null)}
          onSave={(url) => { onChange(url); setCropSrc(null); }}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------------
   VUE IMPRESSION A3 — format fidèle au tableau Excel d'origine
   (code catégorie vertical | intitulé mission | cellule colorée par technicien)
--------------------------------------------------------------- */
function ImpressionView({ agences, personnes, items, pq, orderedItemIds, agenceFilter, adminMode, onToggle, onAddItem, onDeleteItem, onPickColor, onEditItem, onEdit, onDelete, onPhotoChange }) {
  const itemMap = useMemo(() => Object.fromEntries(items.map((it) => [it.id, it])), [items]);

  const orderedItems = useMemo(() =>
    orderedItemIds.map((id) => itemMap[id]).filter(Boolean),
    [orderedItemIds, itemMap]
  );

  // Groupes consécutifs par couleur
  const groups = useMemo(() => {
    const result = [];
    let cur = null;
    for (const item of orderedItems) {
      if (!cur || cur.color !== item.color) {
        cur = { color: item.color, catLabel: item.catLabel, items: [] };
        result.push(cur);
      }
      cur.items.push(item);
    }
    return result;
  }, [orderedItems]);

  const printAgences = agences
    .filter((a) => a.id !== "direction")
    .filter((a) => !agenceFilter || agenceFilter === "toutes" || agenceFilter === a.id);

  const cellStyle = (color) => ({
    background: color,
    color: "white",
    fontSize: "8.5px",
    fontWeight: "700",
    padding: "4px 6px",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
    width: "100%",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Barre d'outils mode édition */}
      {adminMode && (
        <div className="no-print flex items-center gap-3 flex-wrap">
          <button onClick={onAddItem} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "white", background: "#06b6d4" }}>
            <Plus size={14} /> Ajouter une ligne mission
          </button>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Cliquez sur une cellule pour cocher / décocher · sur le rond pour changer la couleur</span>
        </div>
      )}

      {/* Bouton imprimer */}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <button
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "white", background: "linear-gradient(135deg,#1e3a5f,#2563eb)" }}
        >
          <Printer size={16} /> Imprimer en A3
        </button>
      </div>

      {printAgences.map((agence) => {
        const listeBrute = personnes.filter((p) => p.agenceId === agence.id || p.agence_id === agence.id);
        const liste = [...listeBrute].sort((a, b) => {
          const ma = a.matricule || ''; const mb = b.matricule || '';
          const na = parseInt(ma); const nb = parseInt(mb);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return ma.localeCompare(mb);
        });
        return (
          <div
            key={agence.id}
            className="impression-page"
            style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            {/* Header + Tableau dans le même conteneur scrollable → alignement garanti */}
            <div style={{ overflowX: "auto" }}>
              {/* En-tête agence — même largeur que le tableau */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", minWidth: "max-content" }}>
                <img src={SOCOTEC_LOGO} alt="Socotec" style={{ height: 38, width: "auto" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(186,230,253,0.9)" }}>Socotec — Agence Limousin</p>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, textTransform: "uppercase", color: "white", letterSpacing: "0.03em" }}>{agence.nom} — Tableau des qualifications</h2>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                  {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                </p>
              </div>

            {/* Tableau */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
                {/* En-tête techniciens */}
                <thead>
                  <tr>
                    <th style={{ width: 52, minWidth: 52, background: "#f8fafc", borderBottom: "2px solid #e2e8f0", borderRight: "2px solid #cbd5e1", padding: "4px 2px", fontSize: "7px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Code</th>
                    <th style={{ minWidth: 140, background: "#f8fafc", borderBottom: "2px solid #e2e8f0", borderRight: "2px solid #e2e8f0", padding: "6px 10px", textAlign: "left", fontSize: "8px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Mission</th>
                    {liste.map((p) => (
                      <th key={p.id} style={{ minWidth: 120, background: "#f8fafc", borderBottom: "2px solid #e2e8f0", borderRight: "1px solid #e2e8f0", padding: "8px 4px", textAlign: "center", verticalAlign: "bottom" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}>
                          {/* Boutons admin sur le technicien */}
                          {adminMode && (
                            <div className="no-print" style={{ position: "absolute", top: -4, right: -4, display: "flex", gap: 2 }}>
                              <button onClick={() => onEdit(p)} style={{ width: 18, height: 18, borderRadius: 4, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Pencil size={10} />
                              </button>
                              <button onClick={() => onDelete(p.id)} style={{ width: 18, height: 18, borderRadius: 4, border: "1px solid #fecaca", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}
                          {p.photo_url || p.photoUrl ? (
                            <img src={p.photo_url || p.photoUrl} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }} />
                          ) : (
                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: hashColor(p.nom + p.prenom), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16 }}>
                              {initials(p)}
                            </div>
                          )}
                          <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "9.5px", lineHeight: 1.2, textAlign: "center" }}>
                            {p.prenom}<br />{p.nom}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: "8px" }}>{p.matricule}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Corps */}
                <tbody>
                  {groups.map((group) =>
                    group.items.map((item, itemIdx) => (
                      <tr key={item.id} style={{ borderBottom: itemIdx === group.items.length - 1 ? "2px solid " + group.color + "50" : "1px solid #f1f5f9" }}>
                        {itemIdx === 0 && (
                          <td rowSpan={group.items.length} style={{ background: group.color + "18", borderRight: "2px solid " + group.color + "60", padding: "2px 3px", verticalAlign: "middle", textAlign: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "7px", fontWeight: 800, color: group.color, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
                            {group.items[0]?.cat && group.items[0].cat !== "custom" ? group.items[0].cat : group.catLabel}
                          </td>
                        )}
                        {/* Intitulé mission */}
                        <td style={{ padding: "3px 10px", borderRight: "2px solid #e2e8f0", color: "#334155", fontSize: "9px", background: "#fafafa", height: 22 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {/* Rond couleur cliquable en mode édition */}
                            <button
                              onClick={() => adminMode && onPickColor(item.id)}
                              disabled={!adminMode}
                              style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, border: "none", cursor: adminMode ? "pointer" : "default", flexShrink: 0, padding: 0 }}
                            />
                            <span>
                              <span style={{ color: "#94a3b8", marginRight: 4, fontSize: "8.5px" }}>{item.numero}</span>
                              {item.libelle}
                            </span>
                            {/* Crayon renommage en mode édition */}
                            {adminMode && (
                              <button className="no-print" onClick={() => onEditItem(item)} title="Renommer" style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", padding: 0, flexShrink: 0 }}>
                                <Pencil size={10} />
                              </button>
                            )}
                            {/* Bouton suppression en mode édition */}
                            {adminMode && (
                              <button className="no-print" onClick={() => onDeleteItem(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", padding: 0, flexShrink: 0 }}>
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </td>
                        {/* Cellules techniciens — cliquables en mode édition */}
                        {liste.map((p) => {
                          const held = (pq[p.id] ?? []).includes(item.id);
                          return (
                            <td
                              key={p.id}
                              onClick={() => adminMode && onToggle(p.id, item.id)}
                              style={{
                                borderRight: "1px solid #e2e8f0",
                                padding: 0,
                                textAlign: "center",
                                verticalAlign: "middle",
                                height: 22,
                                cursor: adminMode ? "pointer" : "default",
                                transition: "opacity 0.1s",
                              }}
                              onMouseEnter={(e) => { if (adminMode) e.currentTarget.style.opacity = "0.75"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                            >
                              {held ? (
                                <div style={cellStyle(item.color)}>
                                  {item.numero} {item.libelle}
                                </div>
                              ) : adminMode ? (
                                <div style={{ height: 22, background: "#f8fafc" }} />
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>{/* fin du conteneur scrollable header+table */}
          </div>
        );
      })}
    </div>
  );
}

function TrombinoscopeView({ agences, personnes, adminMode, onEdit, onDelete, onPhotoChange }) {
  return (
    <div className="space-y-10 print:space-y-2 trombi-view">
      {agences.map((agence) => {
        const listeBrute = personnes.filter((p) => p.agenceId === agence.id);
        if (listeBrute.length === 0) return null;
        const liste = [...listeBrute].sort((a, b) => {
          const ma = a.matricule || ''; const mb = b.matricule || '';
          const na = parseInt(ma); const nb = parseInt(mb);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return ma.localeCompare(mb);
        });
        return (
          <section key={agence.id} className="trombi-agency-page flex gap-0 print:block print:bg-white">
            <div
              className="trombi-rail hidden sm:flex items-center justify-center w-12 rounded-l-2xl text-white font-extrabold uppercase tracking-widest text-sm shrink-0"
              style={{ background: agence.rail, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {agence.nom}
            </div>
            <div className="flex-1 bg-white rounded-2xl sm:rounded-l-none rounded-r-2xl border border-slate-200 p-6 print:p-2 print:border-none print:rounded-none">
              <div className="flex items-center justify-between mb-5 print:mb-3">
                <h2 className="text-xl font-bold print:block" style={{ color: agence.rail }}>{agence.nom} — Trombinoscope</h2>
                {agence.id !== "direction" && (
                  <span className="ml-auto text-xs font-semibold text-slate-400 flex items-center gap-1 no-print">
                    <Users size={14} /> {liste.length} technicien{liste.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-5 gap-4 print:gap-2">
                {liste.map((p) => (
                  <PersonCard key={p.id} personne={p} adminMode={adminMode} onEdit={onEdit} onDelete={onDelete} onPhotoChange={onPhotoChange} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PersonCard({ personne, adminMode, onEdit, onDelete, onPhotoChange }) {
  return (
    <div className="trombi-card group relative border border-slate-200 rounded-xl p-5 print:p-2 flex flex-col items-center text-center hover:shadow-md transition bg-slate-50/50">
      {adminMode && (
        <div className="absolute top-2 right-2 flex gap-1 no-print">
          <button onClick={() => onEdit(personne)} className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(personne.id)} className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={13} />
          </button>
        </div>
      )}
      <AvatarUpload personne={personne} size={180} editable={adminMode} onChange={(url) => onPhotoChange(personne.id, url)} />
      <p className="trombi-name mt-4 font-bold text-base text-slate-800">{personne.prenom} {personne.nom}</p>
      <p className="trombi-sub text-sm text-cyan-700 font-medium mt-0.5">{personne.poste}</p>
      {personne.ville && (
        <p className="trombi-sub text-xs text-slate-400 flex items-center gap-1 mt-1.5">
          <MapPin size={12} /> {personne.ville}
        </p>
      )}
      {personne.specialites && (
        <p className="trombi-spec text-xs text-slate-500 mt-2.5 leading-relaxed">{personne.specialites}</p>
      )}
      <div className="mt-3.5 space-y-1.5 w-full">
        {personne.telephone && (
          <a href={`tel:${personne.telephone.replace(/\s/g, "")}`} className="trombi-sub flex items-center justify-center gap-1.5 text-sm text-slate-600 hover:text-cyan-700">
            <Phone size={13} /> {personne.telephone}
          </a>
        )}
        {personne.email && (
          <a href={`mailto:${personne.email}`} className="trombi-sub flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-cyan-700 truncate">
            <Mail size={13} /> <span className="truncate">{personne.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function QualificationsView({ agences, personnes, items, pq, adminMode, orderedItemIds, qualifSearch, setQualifSearch, onToggle, onAddItem, onDeleteItem, onPickColor, onEditItem, onMoveItemBefore, onMoveCatBefore }) {
  const [dragItem, setDragItem] = useState(null);    // id de l'item en cours de drag
  const [dragCat,  setDragCat]  = useState(null);    // color du groupe en drag
  const [overItem, setOverItem] = useState(null);
  const [overCat,  setOverCat]  = useState(null);

  const itemMap = useMemo(() => Object.fromEntries(items.map((it) => [it.id, it])), [items]);

  // Items dans l'ordre custom
  const orderedItems = useMemo(() =>
    orderedItemIds.map((id) => itemMap[id]).filter(Boolean),
    [orderedItemIds, itemMap]
  );

  // Groupes consécutifs par couleur
  const groups = useMemo(() => {
    const result = [];
    let cur = null;
    for (const item of orderedItems) {
      if (!cur || cur.color !== item.color) {
        cur = { color: item.color, catLabel: item.catLabel, items: [] };
        result.push(cur);
      }
      cur.items.push(item);
    }
    return result;
  }, [orderedItems]);

  // Filtrage par recherche
  const q = qualifSearch.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((it) => `${it.catLabel} ${it.numero} ${it.libelle}`.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [groups, q]);

  // Techniciens qualifiés sur au moins une mission filtrée (par agence)
  function qualifiedPersonnes(liste) {
    if (!q) return liste;
    const matchIds = new Set(filteredGroups.flatMap((g) => g.items.map((it) => it.id)));
    return liste.filter((p) => (pq[p.id] ?? []).some((id) => matchIds.has(id)));
  }

  // --- Drag handlers ITEMS ---
  function itemDragStart(e, id) { setDragItem(id); e.dataTransfer.effectAllowed = "move"; }
  function itemDragOver(e, id)  { e.preventDefault(); if (id !== dragItem) setOverItem(id); }
  function itemDrop(id) {
    if (dragItem && dragItem !== id) onMoveItemBefore(dragItem, id);
    setDragItem(null); setOverItem(null);
  }

  // --- Drag handlers CATÉGORIES ---
  function catDragStart(e, color) { setDragCat(color); e.dataTransfer.effectAllowed = "move"; }
  function catDragOver(e, color)  { e.preventDefault(); if (color !== dragCat) setOverCat(color); }
  function catDrop(color) {
    if (dragCat && dragCat !== color) onMoveCatBefore(dragCat, color);
    setDragCat(null); setOverCat(null);
  }

  return (
    <div className="space-y-10 print:space-y-3">
      {/* Barre de recherche + bouton ajout */}
      <div className="flex items-center gap-3 flex-wrap no-print">
        <div className="relative flex-1 min-w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={qualifSearch}
            onChange={(e) => setQualifSearch(e.target.value)}
            placeholder="Rechercher une mission… (affiche uniquement les techniciens habilités)"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-cyan-400"
          />
          {qualifSearch && (
            <button onClick={() => setQualifSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X size={14} />
            </button>
          )}
        </div>
        {adminMode && (
          <button onClick={onAddItem} className="flex items-center gap-1.5 bg-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-cyan-600 shrink-0">
            <Plus size={14} /> Ajouter une ligne mission
          </button>
        )}
      </div>

      {agences.map((agence) => {
        const allListe = personnes.filter((p) => p.agenceId === agence.id);
        const liste = qualifiedPersonnes(allListe);
        if (liste.length === 0 && q) return null;
        if (allListe.length === 0) return null;
        const displayListe = q ? liste : allListe;
        return (
          <section key={agence.id} className="bg-white rounded-2xl border border-slate-200 print:break-inside-avoid">
            <div className="px-5 py-3 print:py-1.5 text-white font-extrabold uppercase tracking-wide text-base rounded-t-2xl" style={{ background: agence.rail }}>
              {agence.nom}
            </div>
            <div className="overflow-auto max-h-[72vh] rounded-b-2xl print:max-h-none print:overflow-visible">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-slate-500 px-4 py-3 sticky top-0 left-0 z-20 bg-white w-52 border-b border-slate-200">Mission</th>
                    {displayListe.map((p) => (
                      <th key={p.id} className="px-3 py-6 min-w-[170px] sticky top-0 z-10 bg-white border-b border-slate-200">
                        <div className="flex flex-col items-center gap-3">
                          <Avatar personne={p} size={90} />
                          <span className="font-bold text-base text-slate-700 leading-tight text-center">{p.prenom} {p.nom}</span>
                          <span className="text-sm text-slate-400">{p.matricule}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((group) => (
                    <>
                      {/* Ligne d'en-tête de catégorie draggable */}
                      <tr
                        key={`cat-${group.color}`}
                        draggable={adminMode}
                        onDragStart={adminMode ? (e) => catDragStart(e, group.color) : undefined}
                        onDragOver={adminMode ? (e) => catDragOver(e, group.color) : undefined}
                        onDrop={adminMode ? () => catDrop(group.color) : undefined}
                        onDragEnd={() => { setDragCat(null); setOverCat(null); }}
                        className={`border-t-4 border-slate-200 ${overCat === group.color ? "bg-blue-50" : ""}`}
                      >
                        <td
                          colSpan={displayListe.length + 1}
                          className="px-4 py-1.5 sticky left-0"
                          style={{ background: group.color + "18" }}
                        >
                          <div className="flex items-center gap-2">
                            {adminMode && <span className="text-slate-400 cursor-grab text-base select-none" title="Glisser pour déplacer ce groupe">⠿</span>}
                            <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ background: group.color }} />
                            <span className="font-bold text-xs tracking-wide uppercase" style={{ color: group.color }}>{group.catLabel}</span>
                          </div>
                        </td>
                      </tr>

                      {/* Lignes missions */}
                      {group.items.map((item) => (
                        <tr
                          key={item.id}
                          draggable={adminMode}
                          onDragStart={adminMode ? (e) => itemDragStart(e, item.id) : undefined}
                          onDragOver={adminMode ? (e) => itemDragOver(e, item.id) : undefined}
                          onDrop={adminMode ? () => itemDrop(item.id) : undefined}
                          onDragEnd={() => { setDragItem(null); setOverItem(null); }}
                          className={`border-t border-slate-100 ${overItem === item.id ? "bg-cyan-50" : ""} ${dragItem === item.id ? "opacity-40" : ""}`}
                        >
                          <td className="px-4 py-2 print:px-2 print:py-0.5 sticky left-0 bg-white">
                            <div className="flex items-center gap-2">
                              {adminMode && <span className="text-slate-300 cursor-grab text-base select-none shrink-0" title="Glisser pour déplacer cette ligne">⠿</span>}
                              <button
                                onClick={() => adminMode && onPickColor(item.id)}
                                disabled={!adminMode}
                                title={adminMode ? "Changer la couleur" : undefined}
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ background: item.color, cursor: adminMode ? "pointer" : "default" }}
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-700 text-sm leading-tight">{item.numero} {item.libelle}</p>
                              </div>
                              {adminMode && (
                                <button onClick={() => onEditItem(item)} title="Renommer cette mission" className="no-print shrink-0 text-slate-300 hover:text-blue-500">
                                  <Pencil size={12} />
                                </button>
                              )}
                              {adminMode && (
                                <button onClick={() => onDeleteItem(item.id)} className="no-print ml-auto shrink-0 text-slate-300 hover:text-red-500">
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                          {displayListe.map((p) => {
                            const held = (pq[p.id] ?? []).includes(item.id);
                            return (
                              <td
                                key={p.id}
                                onClick={() => adminMode && onToggle(p.id, item.id)}
                                className={`text-center px-2 py-2 ${adminMode ? "cursor-pointer hover:bg-slate-50" : ""}`}
                              >
                                {held ? (
                                  <span className="inline-flex w-6 h-6 rounded-full items-center justify-center mx-auto" style={{ background: item.color + "25", color: item.color }}>
                                    <Check size={13} strokeWidth={3} />
                                  </span>
                                ) : (
                                  <span className="text-slate-300 text-base">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {adminMode && (
        <p className="text-xs text-slate-400 text-center no-print">
          ⠿ Glissez les rangées ou les en-têtes de catégorie pour les réordonner · cliquez sur le rond de couleur pour reclasser · cliquez sur une case pour cocher/décocher
        </p>
      )}
    </div>
  );
}

function PersonneModal({ personne, onClose, onSave }) {
  const [form, setForm] = useState({
    ...personne,
    agenceId: personne.agenceId || personne.agence_id || "brive",
    specialites: personne.specialites || "",
    telephone: personne.telephone || "",
    email: personne.email || "",
    matricule: personne.matricule || "",
    ville: personne.ville || "",
    poste: personne.poste || "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photoUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
        <h3 className="font-bold text-lg mb-4" style={{ color: "#1e3a5f" }}>{personne.id ? "Modifier" : "Ajouter"} une personne</h3>

        <div className="flex items-center gap-4 mb-4">
          <Avatar personne={form} size={56} />
          <label className="flex items-center gap-2 text-xs font-semibold text-cyan-700 border border-cyan-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-cyan-50">
            <Camera size={14} /> Choisir une photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" value={form.prenom} onChange={set("prenom")} />
          <Field label="Nom" value={form.nom} onChange={set("nom")} />
          <Field label="Poste" value={form.poste} onChange={set("poste")} full />
          <Field label="Téléphone" value={form.telephone} onChange={set("telephone")} />
          <Field label="Email" value={form.email} onChange={set("email")} />
          <Field label="Matricule" value={form.matricule} onChange={set("matricule")} />
          <Field label="Ville" value={form.ville} onChange={set("ville")} />
          <Field label="Spécialités" value={form.specialites} onChange={set("specialites")} full />
          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-500">Agence</label>
            <select value={form.agenceId || form.agence_id || "brive"} onChange={set("agenceId")} className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm">
              {AGENCES.map((a) => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => onSave(form)}
          className="w-full mt-5 bg-blue-900 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-950"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <input value={value} onChange={onChange} className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
    </div>
  );
}

const COLOR_PALETTE = ["#4CAF50", "#F97316", "#EAB308", "#E74C3C", "#2E86C1", "#5DADE2", "#16A085", "#8B5CF6", "#8E44AD", "#D4AC0D"];

function ColorSwatchPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: c, outline: value === c ? "2px solid #1e3a5f" : "none", outlineOffset: "2px" }}
          title={c}
        >
          {value === c && <Check size={14} className="text-white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

function AddItemModal({ items, orderedItemIds, onClose, onSave }) {
  // Catégories existantes dans l'ordre d'affichage (par couleur)
  const existingCats = useMemo(() => {
    const seen = new Set(); const cats = [];
    orderedItemIds.forEach((id) => {
      const it = items.find((x) => x.id === id);
      if (it && !seen.has(it.color)) { seen.add(it.color); cats.push({ color: it.color, catLabel: it.catLabel || it.cat_label || "" }); }
    });
    return cats;
  }, [items, orderedItemIds]);

  const [selectedCat, setSelectedCat] = useState("existing-0");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [numero,   setNumero]   = useState("");
  const [libelle,  setLibelle]  = useState("");
  const [color,    setColor]    = useState(COLOR_PALETTE[0]);

  const isNew = selectedCat === "__new__";
  const activeCat = isNew ? { catLabel: newCatLabel, color } : existingCats[parseInt(selectedCat.replace("existing-",""))] || existingCats[0];

  function submit() {
    if (!libelle.trim()) return;
    const cl = isNew ? newCatLabel.trim() : activeCat?.catLabel || "";
    if (!cl) return;
    onSave(cl, numero.trim(), libelle.trim(), isNew ? color : activeCat.color, isNew ? null : activeCat.color);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={18} /></button>
        <h3 className="font-bold text-base mb-4" style={{ color: "#1e3a5f" }}>Nouvelle ligne mission</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Catégorie</label>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} autoFocus
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm">
              {existingCats.map((c, i) => (
                <option key={i} value={`existing-${i}`}>{c.catLabel}</option>
              ))}
              <option value="__new__">➕ Nouvelle catégorie…</option>
            </select>
          </div>
          {isNew && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-500">Nom de la nouvelle catégorie</label>
                <input value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="ex : Hydraulique spécial"
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Couleur de la catégorie</label>
                <ColorSwatchPicker value={color} onChange={setColor} />
              </div>
            </>
          )}
          {!isNew && activeCat && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: activeCat.color }} />
              La mission sera ajoutée dans la catégorie <strong className="text-slate-700 ml-1">{activeCat.catLabel}</strong>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500">Numéro (optionnel)</label>
            <input value={numero} onChange={(e) => setNumero(e.target.value)}
              placeholder="ex : 1, 2, 3.1…"
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Intitulé de la mission</label>
            <input value={libelle} onChange={(e) => setLibelle(e.target.value)}
              placeholder="ex : Périodique"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <button onClick={submit} disabled={!libelle.trim() || (isNew && !newCatLabel.trim())}
          className="w-full mt-5 bg-blue-900 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-950 disabled:opacity-40 disabled:cursor-not-allowed">
          Ajouter la mission
        </button>
      </div>
    </div>
  );
}

function EditItemModal({ item, items, onClose, onSave }) {
  // Catégories existantes
  const existingCats = useMemo(() => {
    const seen = new Set(); const cats = [];
    items.forEach((it) => {
      if (!seen.has(it.color)) { seen.add(it.color); cats.push({ color: it.color, catLabel: it.catLabel || it.cat_label || "", cat: it.cat || "" }); }
    });
    return cats;
  }, [items]);

  const currentCatIdx = existingCats.findIndex((c) => c.color === item.color);
  const [selectedCat, setSelectedCat] = useState(currentCatIdx >= 0 ? `existing-${currentCatIdx}` : "existing-0");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [numero,   setNumero]   = useState(item.numero   || "");
  const [libelle,  setLibelle]  = useState(item.libelle  || "");
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0]);

  const isNew = selectedCat === "__new__";
  const activeCat = isNew ? { catLabel: newCatLabel, color: newColor, cat: "" } : existingCats[parseInt(selectedCat.replace("existing-",""))] || existingCats[0];

  function submit() {
    if (!libelle.trim()) return;
    onSave({ cat: activeCat?.cat || "custom", catLabel: isNew ? newCatLabel.trim() : activeCat?.catLabel || "", numero: numero.trim(), libelle: libelle.trim(), color: isNew ? newColor : activeCat?.color || item.color });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={18} /></button>
        <h3 className="font-bold text-base mb-4" style={{ color: "#1e3a5f" }}>Modifier la mission</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Catégorie</label>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} autoFocus
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm">
              {existingCats.map((c, i) => (
                <option key={i} value={`existing-${i}`}>{c.catLabel}</option>
              ))}
              <option value="__new__">➕ Nouvelle catégorie…</option>
            </select>
          </div>
          {isNew && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-500">Nom de la nouvelle catégorie</label>
                <input value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} placeholder="Nouvelle catégorie"
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Couleur</label>
                <ColorSwatchPicker value={newColor} onChange={setNewColor} />
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500">Numéro</label>
            <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="1, 2, 3.1…"
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Intitulé de la mission</label>
            <input value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Périodique"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
          <button onClick={submit} disabled={!libelle.trim() || (isNew && !newCatLabel.trim())}
            className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-950 disabled:opacity-40">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorPickerModal({ item, onClose, onSave }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
        <p className="text-xs text-slate-400">{item.catLabel}</p>
        <h3 className="font-bold text-base mb-4" style={{ color: "#1e3a5f" }}>{item.numero} {item.libelle}</h3>
        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nouvelle couleur</label>
        <ColorSwatchPicker value={item.color} onChange={onSave} />
        <p className="text-xs text-slate-400 mt-4">Cette ligne se rangera automatiquement avec les autres missions de la couleur choisie.</p>
      </div>
    </div>
  );
}

const EDIT_PASSWORD = "socotec";

function PasswordModal({ onClose, onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit() {
    if (value === EDIT_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <Settings2 size={18} style={{ color: "#1e3a5f" }} />
          <h3 className="font-bold text-lg" style={{ color: "#1e3a5f" }}>Mode édition</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Saisissez le mot de passe pour activer l'édition.</p>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
          placeholder="Mot de passe"
          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${
            error ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-cyan-400"
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1.5">Mot de passe incorrect.</p>}

        <button
          onClick={submit}
          className="w-full mt-5 bg-blue-900 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-950"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
