/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT
 *  This is the only file you need to edit to update the website.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  How to edit safely
 *  • Every value is plain text inside quotes: 'like this'. If your text contains
 *    an apostrophe, use a typographic one (’) or wrap the text in "double quotes".
 *  • Lists use square brackets [ ... ] and every entry is separated by a comma.
 *  • *Asterisks* around words render them in italics (useful for case names).
 *  • Leave a link as '' (empty) if you do not have an authentic URL yet — the
 *    site will simply show the entry without a link.
 *  • After editing, run `npm run build` locally (or just push to GitHub): the
 *    deployment workflow validates this file and stops if something is wrong.
 *
 *  Dates use the ISO format 'YYYY-MM' or 'YYYY-MM-DD' so entries sort correctly;
 *  the human-readable label shown on the page is set separately.
 */

export default {
  site: {
    url: 'https://mdsahilahmedchoudhury.github.io/',
    // Shown in the footer as "Last updated …"
    updated: 'November 2026',
  },

  person: {
    name: 'Md Sahil Ahmed Choudhury',
    // How the name breaks across lines in the large heading on the opening screen.
    nameLines: ['Md Sahil Ahmed', 'Choudhury'],
    monogram: 'S',
    tagline: 'Law, Policy & Technology',
    headline: 'Reading *law* where policy, commerce and technology meet.',
    intro:
      'A law student at the National Law University of Meghalaya exploring the intersection of legal practice, technology, policy and emerging regulatory frameworks.',
    email: 'mdsahil.25@nlumeg.ac.in',
    linkedin: 'https://www.linkedin.com/in/sahil-ahmed-choudhury-6a486234a',
    cv: {
      // The original CV, unchanged. Replace the PDF in assets/documents/ to update it.
      file: 'assets/documents/CV-MdSahilAhmedChoudhury.pdf',
      downloadName: 'CV-MdSahilAhmedChoudhury.pdf',
    },
    // Optional portrait for the opening screen. Add an image to assets/img/ and set, e.g.:
    // portrait: { src: 'assets/img/portrait.jpg', alt: 'Portrait of Md Sahil Ahmed Choudhury' },
    portrait: null,
    interests: [
      'Technology Law',
      'Data Privacy & Protection',
      'Corporate & Commercial Law',
      'Intellectual Property Rights',
      'Legal Research & Technology Governance',
    ],
  },

  about: {
    statement: 'An interdisciplinary training in policy and law, *tested in practice*.',
    paragraphs: [
      'I am a second-year student of the B.A. (Policy Science) LL.B. (Hons.) programme at the National Law University of Meghalaya, where the study of public policy runs alongside the study of law.',
      'My internships have spanned commercial and corporate work — drafting and reviewing agreements, corporate due diligence and a cross-border trademark clearance search — together with legal research for a District Legal Services Authority, market-intelligence research at TechNext.ai, and court reporting and editorial work at The Assam Tribune.',
      'I am currently a Research Assistant on the Legal Headnote Generation Project at IIT Guwahati’s Centre for Linguistic Science and Technology. I am particularly drawn to technology governance and the regulatory questions that emerging technologies raise for data privacy, corporate law and intellectual property.',
    ],
    facts: [
      { label: 'Programme', value: 'B.A. (Policy Science) LL.B. (Hons.)' },
      { label: 'University', value: 'National Law University of Meghalaya' },
      { label: 'Batch', value: '2025 – 2030 · Second year' },
      { label: 'CGPA', value: '8.5 / 10' },
      { label: 'Currently', value: 'Research Assistant, IIT Guwahati (CLST)' },
    ],
  },

  /**
   * EXPERIENCE — newest first. `id` must be unique (lowercase, no spaces).
   * `highlights` are revealed when a visitor expands the entry.
   */
  experience: [
    {
      id: 'solvlegal',
      organisation: 'SolvLegal Law Offices LLP',
      role: 'Legal Intern',
      period: 'June 2026',
      date: '2026-06',
      area: 'Corporate & Commercial',
      summary:
        'Commercial drafting, corporate due diligence, merger research and a cross-border trademark clearance search.',
      highlights: [
        'Assisted with drafting and reviewing commercial agreements, including non-disclosure, employment, SaaS and share subscription agreements.',
        'Conducted corporate due diligence by verifying shareholding structures, share certificates and corporate records.',
        'Researched the fast-track merger framework under the Companies Act, 2013, assessing its implications for mergers between holding companies and subsidiaries, startup restructurings and reduced NCLT involvement.',
        'Assisted with a cross-border trademark clearance search across five Nice Classes for a client’s proposed rebranding, assessing opposition, infringement and passing-off risks under the UK Trade Marks Act, 1994.',
        'Reviewed a manuscript on technology governance analysing directors’ duties and corporate governance principles across Australia, the UK, the EU and the US.',
      ],
      tags: ['Commercial agreements', 'Due diligence', 'Companies Act, 2013', 'Trademark clearance', 'Technology governance'],
    },
    {
      id: 'technext',
      organisation: 'TechNext.ai',
      role: 'Research Assistant',
      period: 'March 2026',
      date: '2026-03',
      area: 'Research & Market Intelligence',
      summary:
        'LLM-assisted, public-source research converting unstructured data into verified market-intelligence datasets.',
      highlights: [
        'Conducted LLM-assisted, public-source research under a Senior Researcher, converting large volumes of unstructured data into verified market-intelligence datasets.',
        'Screened 100+ US buy-side firms and 120+ individuals for a quantum computing project by verifying recent corporate mandates and public commentary on professional platforms.',
        'Validated 100+ French SMEs participating in international trade shows against corporate databases, delivering structured datasets for international market research.',
      ],
      tags: ['LLM-assisted research', 'Market intelligence', 'Structured datasets'],
    },
    {
      id: 'dlsa',
      organisation: 'District Legal Services Authority',
      role: 'Legal Intern',
      period: 'February 2026',
      date: '2026-02',
      area: 'Criminal Law & Legal Aid',
      summary:
        'Criminal-law research, case briefs in a PMLA matter, and observation of trials before criminal courts.',
      highlights: [
        'Researched the admissibility of evidence of past sexual history under Sections 53A and 146 of the Indian Evidence Act, 1872, in POCSO litigation.',
        'Analysed provisions of the NDPS Act, 1985 and the Indian Penal Code, 1860, and related case law, and prepared case briefs for the PMLA matter concerning the late singer Zubeen Garg.',
        'Observed criminal trials before the Chief Judicial Magistrate, the Special POCSO Court and the Sessions Court, documenting procedural compliance and witness examination.',
      ],
      tags: ['POCSO', 'NDPS Act', 'PMLA', 'Case briefs', 'Trial observation'],
    },
    {
      id: 'assam-tribune',
      organisation: 'The Assam Tribune',
      role: 'Legal & Editorial Intern',
      period: 'February 2026',
      date: '2026-02',
      area: 'Legal Journalism',
      summary:
        'Court reporting on the Zubeen Garg proceedings, accessibility research and editorial work.',
      highlights: [
        'Conducted court reporting and on-site interviews on the PMLA and criminal proceedings in the Zubeen Garg case for digital legal coverage.',
        'Surveyed ICT accessibility across three inclusive and special education institutions in Guwahati and prepared a report on the integration of assistive technologies.',
        'Transcribed an interview with MP Gaurav Gogoi on regional electoral sentiment and political trends in Assam.',
      ],
      tags: ['Court reporting', 'Interviews', 'ICT accessibility', 'Editorial research'],
    },
    {
      id: 'cry',
      organisation: 'Child Rights and You (CRY)',
      role: 'Legal Intern',
      period: 'January 2026',
      date: '2026-01',
      area: 'Child Rights & Policy',
      summary:
        'Comparative field research, a 100+ participant awareness survey on child-rights statutes, and STEM-education reporting.',
      highlights: [
        'Interviewed stakeholders and prepared a comparative report on the developmental impact of Square Panda modules among Anganwadi children in Madhya Pradesh, comparing exposed and non-exposed groups.',
        'Administered an awareness survey of 100+ participants and analysed public understanding of statutes including the POCSO Act, 2012 and the Juvenile Justice Act, 2015.',
        'Prepared a report on a regional webinar on the introduction of STEM kits and DIY modules in schools across Northeast India.',
      ],
      tags: ['Comparative research', 'Awareness survey', 'POCSO Act, 2012', 'Juvenile Justice Act, 2015'],
    },
  ],

  /**
   * RESEARCH & PROJECTS — add new projects to this list.
   * status: 'ongoing' or 'completed'. Do not describe outcomes that are not public.
   */
  research: [
    {
      id: 'iitg-headnotes',
      status: 'ongoing',
      title: 'Legal Headnote Generation Project',
      institution: 'IIT Guwahati',
      unit: 'Centre for Linguistic Science and Technology (CLST)',
      role: 'Research Assistant',
      supervisor: 'Dr. Sanasam Ranbir Singh',
      period: 'October 2026 – Present',
      start: '2026-10',
      // Optional prose description. Leave '' until the project has public details to share.
      description: '',
      link: '',
      // Optional reference note shown beside the project (general context, not project findings).
      glossary: {
        term: 'head·note',
        partOfSpeech: 'noun',
        definition:
          'A brief summary of the points of law decided in a case, printed at the head of its law report.',
      },
    },
  ],

  /**
   * PUBLICATIONS & WRITING
   * type: e.g. 'Legal journalism', 'Article', 'Research paper', 'Book chapter', 'Blog post'.
   * url: the authentic link to the piece, or '' if none is available.
   */
  publications: [
    {
      title: 'Zubeen Garg case: Shyamkanu’s account unfrozen; Siddhartha’s flat remains sealed',
      outlet: 'The Assam Tribune',
      type: 'Legal journalism',
      date: '2026-03-02',
      dateLabel: '2 March 2026',
      url: 'https://assamtribune.com/guwahati/zubeen-garg-case-shyamkanus-account-unfrozen-siddharthas-flat-remains-sealed-1608980',
    },
    {
      title: 'Zubeen Garg case: Court reserves order on Siddharth Sarma’s flat, Singapore files',
      outlet: 'The Assam Tribune',
      type: 'Legal journalism',
      date: '2026-02-16',
      dateLabel: '16 February 2026',
      url: 'https://assamtribune.com/zubeen-garg-case-court-reserves-order-on-siddharth-sarmas-flat-singapore-files',
    },
    {
      title: 'Court allows document inspection, reserves orders on key petitions in Zubeen Garg Case',
      outlet: 'The Assam Tribune',
      type: 'Legal journalism',
      date: '2026-02-13',
      dateLabel: '13 February 2026',
      url: 'https://assamtribune.com/assam/court-allows-document-inspection-reserves-orders-on-key-petitions-in-zubeen-garg-case-1607418',
    },
  ],

  education: [
    {
      institution: 'National Law University of Meghalaya',
      degree: 'B.A. (Policy Science) LL.B. (Hons.)',
      period: '2025 – 2030',
      startYear: 2025,
      endYear: 2030,
      // Which year of the programme you are in (used for the programme timeline).
      currentYear: 2,
      grade: 'CGPA 8.5 / 10',
      // Optional small note under the CGPA, e.g. 'End of Trimester IV'. Leave '' for none.
      gradeNote: '',
    },
  ],

  /**
   * MOOTS & ACHIEVEMENTS — `kind` sets the icon: 'Moot court', 'Moot court research' or 'Competition'.
   */
  achievements: [
    {
      title: 'Researcher',
      event: 'The NUALS Moot, Third Edition (2026) — International Taxation',
      host: 'The National University of Advanced Legal Studies (NUALS), Kochi',
      kind: 'Moot court research',
    },
    {
      title: 'Semi-finalists',
      event: '2nd Intra Moot Court Competition',
      host: 'National Law University of Meghalaya',
      kind: 'Moot court',
    },
    {
      title: 'First Position',
      event: 'NEP Awareness Poster-Making Competition',
      host: 'National Law University of Meghalaya',
      kind: 'Competition',
    },
  ],

  /**
   * SKILLS — `ref` (optional) links a skill to the experience entry (by id)
   * where it was applied; visitors can click through to that entry.
   */
  skills: [
    {
      group: 'Legal Research',
      items: [{ name: 'SCC Online' }, { name: 'Manupatra' }, { name: 'JSTOR' }, { name: 'eCourts Services' }],
    },
    {
      group: 'Legal Skills',
      items: [
        { name: 'Contract Drafting', ref: 'solvlegal' },
        { name: 'Contract Review', ref: 'solvlegal' },
        { name: 'Corporate Due Diligence', ref: 'solvlegal' },
        { name: 'Trademark Clearance', ref: 'solvlegal' },
        { name: 'Legal Journalism', ref: 'assam-tribune' },
      ],
    },
    {
      group: 'Technical Skills',
      items: [{ name: 'LLM-assisted Web Development' }, { name: 'GitHub & Open-Source Repositories' }],
    },
    {
      group: 'Areas of Interest',
      items: [
        { name: 'Technology Law' },
        { name: 'Data Privacy & Protection' },
        { name: 'Corporate & Commercial Law' },
        { name: 'Intellectual Property' },
      ],
    },
  ],

  contact: {
    heading: 'Let’s *correspond*.',
    text: 'For internship opportunities, research collaboration, or a conversation about technology law, data privacy, corporate law or intellectual property, I would be glad to hear from you.',
  },
};
