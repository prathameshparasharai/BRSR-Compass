import { useState, useMemo, useEffect } from "react";

// ─── HIERARCHICAL INDUSTRY CLASSIFICATION DATA (Section → Division) ───
const NIC_SECTIONS = [
  { code: "A", label: "Agriculture, Forestry & Fishing", gics: "30 - Consumer Staples", naics: "11", nace: "A",
    divisions: [
      { code: "01", label: "Crop & animal production, hunting", gics: "302020 - Food Products", gicsSub: "30202010 - Agricultural Products", naics: "111-112", nace: "01" },
      { code: "02", label: "Forestry & logging", gics: "151050 - Paper & Forest Products", gicsSub: "15105010 - Forest Products", naics: "113", nace: "02" },
      { code: "03", label: "Fishing & aquaculture", gics: "302020 - Food Products", gicsSub: "30202010 - Agricultural Products", naics: "114", nace: "03" },
    ]},
  { code: "B", label: "Mining & Quarrying", gics: "10 - Energy / 15 - Materials", naics: "21", nace: "B",
    divisions: [
      { code: "05", label: "Mining of coal & lignite", gics: "101020 - Oil, Gas & Consumable Fuels", gicsSub: "10102050 - Coal & Consumable Fuels", naics: "2121", nace: "05" },
      { code: "06", label: "Extraction of crude petroleum & natural gas", gics: "101020 - Oil, Gas & Consumable Fuels", gicsSub: "10102010 - Integrated Oil & Gas", naics: "2111", nace: "06" },
      { code: "07", label: "Mining of metal ores", gics: "151040 - Metals & Mining", gicsSub: "15104020 - Diversified Metals & Mining", naics: "2122", nace: "07" },
      { code: "08", label: "Other mining & quarrying", gics: "151040 - Metals & Mining", gicsSub: "15104050 - Steel", naics: "2123", nace: "08" },
    ]},
  { code: "C", label: "Manufacturing", gics: "20 - Industrials / 15 - Materials", naics: "31-33", nace: "C",
    divisions: [
      { code: "10", label: "Manufacture of food products", gics: "302020 - Food Products", gicsSub: "30202030 - Packaged Foods & Meats", naics: "311", nace: "10" },
      { code: "11", label: "Manufacture of beverages", gics: "302010 - Beverages", gicsSub: "30201030 - Soft Drinks", naics: "3121", nace: "11" },
      { code: "13", label: "Manufacture of textiles", gics: "252030 - Textiles, Apparel & Luxury", gicsSub: "25203010 - Apparel, Accessories & Luxury", naics: "313-314", nace: "13" },
      { code: "14", label: "Manufacture of wearing apparel", gics: "252030 - Textiles, Apparel & Luxury", gicsSub: "25203010 - Apparel, Accessories & Luxury", naics: "315", nace: "14" },
      { code: "17", label: "Manufacture of paper & paper products", gics: "151050 - Paper & Forest Products", gicsSub: "15105020 - Paper Products", naics: "322", nace: "17" },
      { code: "19", label: "Manufacture of coke & petroleum products", gics: "101020 - Oil, Gas & Consumable Fuels", gicsSub: "10102040 - Oil & Gas Refining & Marketing", naics: "324", nace: "19" },
      { code: "20", label: "Manufacture of chemicals & chemical products", gics: "151010 - Chemicals", gicsSub: "15101020 - Diversified Chemicals", naics: "325", nace: "20" },
      { code: "21", label: "Manufacture of pharmaceuticals", gics: "352020 - Pharmaceuticals", gicsSub: "35202010 - Pharmaceuticals", naics: "3254", nace: "21" },
      { code: "22", label: "Manufacture of rubber & plastics", gics: "151010 - Chemicals", gicsSub: "15101040 - Specialty Chemicals", naics: "326", nace: "22" },
      { code: "23", label: "Manufacture of non-metallic mineral products", gics: "151020 - Construction Materials", gicsSub: "15102010 - Construction Materials", naics: "327", nace: "23" },
      { code: "24", label: "Manufacture of basic metals", gics: "151040 - Metals & Mining", gicsSub: "15104050 - Steel", naics: "331", nace: "24" },
      { code: "25", label: "Manufacture of fabricated metal products", gics: "201040 - Machinery", gicsSub: "20104010 - Industrial Machinery", naics: "332", nace: "25" },
      { code: "26", label: "Manufacture of computer, electronic & optical", gics: "452020 - Technology Hardware", gicsSub: "45202030 - Electronic Equipment & Instruments", naics: "334", nace: "26" },
      { code: "27", label: "Manufacture of electrical equipment", gics: "201040 - Machinery", gicsSub: "20104020 - Electrical Components & Equipment", naics: "335", nace: "27" },
      { code: "28", label: "Manufacture of machinery & equipment n.e.c.", gics: "201040 - Machinery", gicsSub: "20104010 - Industrial Machinery", naics: "333", nace: "28" },
      { code: "29", label: "Manufacture of motor vehicles & trailers", gics: "251020 - Automobiles & Components", gicsSub: "25102010 - Automobile Manufacturers", naics: "3361-3363", nace: "29" },
      { code: "30", label: "Manufacture of other transport equipment", gics: "201010 - Aerospace & Defense", gicsSub: "20101010 - Aerospace & Defense", naics: "3364-3369", nace: "30" },
    ]},
  { code: "D", label: "Electricity, Gas, Steam & AC Supply", gics: "55 - Utilities", naics: "22", nace: "D",
    divisions: [
      { code: "35.1", label: "Electric power generation, transmission & distribution", gics: "551010 - Electric Utilities", gicsSub: "55101010 - Electric Utilities", naics: "2211", nace: "35.1" },
      { code: "35.2", label: "Manufacture & distribution of gas", gics: "551020 - Gas Utilities", gicsSub: "55102010 - Gas Utilities", naics: "2212", nace: "35.2" },
      { code: "35.3", label: "Steam & air conditioning supply", gics: "551030 - Multi-Utilities", gicsSub: "55103010 - Multi-Utilities", naics: "22133", nace: "35.3" },
    ]},
  { code: "E", label: "Water Supply, Sewerage, Waste Mgmt", gics: "55 - Utilities", naics: "22", nace: "E",
    divisions: [
      { code: "36", label: "Water collection, treatment & supply", gics: "551040 - Water Utilities", gicsSub: "55104010 - Water Utilities", naics: "2213", nace: "36" },
      { code: "37", label: "Sewerage", gics: "551040 - Water Utilities", gicsSub: "55104010 - Water Utilities", naics: "22132", nace: "37" },
      { code: "38", label: "Waste collection, treatment & disposal", gics: "201070 - Commercial Services & Supplies", gicsSub: "20107010 - Environmental & Facilities Services", naics: "5621-5622", nace: "38" },
      { code: "39", label: "Remediation & other waste management", gics: "201070 - Commercial Services & Supplies", gicsSub: "20107010 - Environmental & Facilities Services", naics: "5629", nace: "39" },
    ]},
  { code: "F", label: "Construction", gics: "20 - Industrials", naics: "23", nace: "F",
    divisions: [
      { code: "41", label: "Construction of buildings", gics: "201030 - Construction & Engineering", gicsSub: "20103010 - Construction & Engineering", naics: "236", nace: "41" },
      { code: "42", label: "Civil engineering", gics: "201030 - Construction & Engineering", gicsSub: "20103010 - Construction & Engineering", naics: "237", nace: "42" },
      { code: "43", label: "Specialized construction activities", gics: "201030 - Construction & Engineering", gicsSub: "20103010 - Construction & Engineering", naics: "238", nace: "43" },
    ]},
  { code: "G", label: "Wholesale & Retail Trade", gics: "25 - Consumer Discretionary / 30 - Consumer Staples", naics: "42-45", nace: "G",
    divisions: [
      { code: "45", label: "Wholesale & retail of motor vehicles", gics: "255040 - Specialty Retail", gicsSub: "25504040 - Automotive Retail", naics: "441", nace: "45" },
      { code: "46", label: "Wholesale trade (except vehicles)", gics: "201060 - Trading Companies & Distributors", gicsSub: "20106010 - Trading Companies & Distributors", naics: "423-425", nace: "46" },
      { code: "47", label: "Retail trade (except vehicles)", gics: "255030 - Multiline Retail", gicsSub: "25503020 - General Merchandise Stores", naics: "44-45", nace: "47" },
    ]},
  { code: "H", label: "Transportation & Storage", gics: "20 - Industrials", naics: "48-49", nace: "H",
    divisions: [
      { code: "49", label: "Land transport & via pipelines", gics: "203040 - Road & Rail", gicsSub: "20304010 - Rail Transportation", naics: "482-486", nace: "49" },
      { code: "50", label: "Water transport", gics: "203030 - Marine", gicsSub: "20303010 - Marine", naics: "483", nace: "50" },
      { code: "51", label: "Air transport", gics: "203020 - Airlines", gicsSub: "20302010 - Airlines", naics: "481", nace: "51" },
      { code: "52", label: "Warehousing & support for transportation", gics: "203050 - Transportation Infrastructure", gicsSub: "20305020 - Marine Ports & Services", naics: "488-493", nace: "52" },
      { code: "53", label: "Postal & courier activities", gics: "203010 - Air Freight & Logistics", gicsSub: "20301010 - Air Freight & Logistics", naics: "491-492", nace: "53" },
    ]},
  { code: "I", label: "Accommodation & Food Service", gics: "25 - Consumer Discretionary", naics: "72", nace: "I",
    divisions: [
      { code: "55", label: "Accommodation", gics: "253010 - Hotels, Restaurants & Leisure", gicsSub: "25301020 - Hotels, Resorts & Cruise Lines", naics: "721", nace: "55" },
      { code: "56", label: "Food & beverage service activities", gics: "253010 - Hotels, Restaurants & Leisure", gicsSub: "25301040 - Restaurants", naics: "722", nace: "56" },
    ]},
  { code: "J", label: "Information & Communication", gics: "45 - Information Technology / 50 - Communication Services", naics: "51", nace: "J",
    divisions: [
      { code: "58", label: "Publishing activities", gics: "502010 - Media", gicsSub: "50201020 - Publishing", naics: "511", nace: "58" },
      { code: "59", label: "Motion picture, video & TV production", gics: "502010 - Media", gicsSub: "50201030 - Movies & Entertainment", naics: "5121", nace: "59" },
      { code: "60", label: "Broadcasting & programming", gics: "502010 - Media", gicsSub: "50201010 - Broadcasting", naics: "515", nace: "60" },
      { code: "61", label: "Telecommunications", gics: "501020 - Diversified Telecommunication", gicsSub: "50102010 - Integrated Telecom Services", naics: "517", nace: "61" },
      { code: "62", label: "Computer programming & consultancy", gics: "451030 - Software", gicsSub: "45103020 - Application Software", naics: "5415", nace: "62" },
      { code: "63", label: "Information service activities", gics: "451020 - IT Services", gicsSub: "45102020 - Data Processing & Outsourced Services", naics: "519", nace: "63" },
    ]},
  { code: "K", label: "Financial & Insurance Activities", gics: "40 - Financials", naics: "52", nace: "K",
    divisions: [
      { code: "64", label: "Financial service activities (excl. insurance)", gics: "401010 - Banks", gicsSub: "40101010 - Diversified Banks", naics: "5221", nace: "64" },
      { code: "65", label: "Insurance, reinsurance & pension", gics: "402010 - Insurance", gicsSub: "40201020 - Life & Health Insurance", naics: "5241", nace: "65" },
      { code: "66", label: "Activities auxiliary to financial services", gics: "402030 - Capital Markets", gicsSub: "40203010 - Asset Management & Custody Banks", naics: "5231-5239", nace: "66" },
    ]},
  { code: "L", label: "Real Estate Activities", gics: "60 - Real Estate", naics: "53", nace: "L",
    divisions: [
      { code: "68.1", label: "Real estate with own property", gics: "601020 - Real Estate Management & Development", gicsSub: "60102010 - Diversified Real Estate", naics: "531", nace: "68.1" },
      { code: "68.2", label: "Real estate on a fee or contract basis", gics: "601020 - Real Estate Management & Development", gicsSub: "60102040 - Real Estate Services", naics: "5312", nace: "68.2" },
    ]},
  { code: "M", label: "Professional, Scientific & Technical", gics: "20 - Industrials / 45 - IT", naics: "54", nace: "M",
    divisions: [
      { code: "69", label: "Legal & accounting activities", gics: "202020 - Professional Services", gicsSub: "20202010 - Diversified Support Services", naics: "5411-5412", nace: "69" },
      { code: "70", label: "Management consultancy activities", gics: "202020 - Professional Services", gicsSub: "20202020 - Research & Consulting Services", naics: "5416", nace: "70" },
      { code: "71", label: "Architecture & engineering", gics: "201030 - Construction & Engineering", gicsSub: "20103010 - Construction & Engineering", naics: "5413-5414", nace: "71" },
      { code: "72", label: "Scientific research & development", gics: "352010 - Biotechnology", gicsSub: "35201010 - Biotechnology", naics: "5417", nace: "72" },
      { code: "73", label: "Advertising & market research", gics: "502030 - Interactive Media & Services", gicsSub: "50203010 - Interactive Media & Services", naics: "5418", nace: "73" },
    ]},
  { code: "N", label: "Administrative & Support Services", gics: "20 - Industrials", naics: "56", nace: "N",
    divisions: [
      { code: "77", label: "Rental & leasing activities", gics: "201060 - Trading Companies & Distributors", gicsSub: "20106010 - Trading Companies & Distributors", naics: "532", nace: "77" },
      { code: "78", label: "Employment activities", gics: "202020 - Professional Services", gicsSub: "20202010 - Diversified Support Services", naics: "5613", nace: "78" },
      { code: "79", label: "Travel agency & tour operator", gics: "253010 - Hotels, Restaurants & Leisure", gicsSub: "25301010 - Casinos & Gaming", naics: "5615", nace: "79" },
      { code: "80", label: "Security & investigation activities", gics: "201070 - Commercial Services & Supplies", gicsSub: "20107020 - Security & Alarm Services", naics: "5616", nace: "80" },
      { code: "81", label: "Services to buildings & landscape", gics: "201070 - Commercial Services & Supplies", gicsSub: "20107010 - Environmental & Facilities Services", naics: "5617", nace: "81" },
      { code: "82", label: "Office administrative & business support", gics: "201070 - Commercial Services & Supplies", gicsSub: "20107010 - Environmental & Facilities Services", naics: "5611", nace: "82" },
    ]},
  { code: "O", label: "Public Administration & Defence", gics: "N/A (Government)", naics: "92", nace: "O", divisions: [] },
  { code: "P", label: "Education", gics: "25 - Consumer Discretionary", naics: "61", nace: "P",
    divisions: [
      { code: "85.1", label: "Pre-primary & primary education", gics: "253020 - Diversified Consumer Services", gicsSub: "25302010 - Education Services", naics: "6111", nace: "85.1" },
      { code: "85.2", label: "Secondary education", gics: "253020 - Diversified Consumer Services", gicsSub: "25302010 - Education Services", naics: "6111", nace: "85.2" },
      { code: "85.3", label: "Higher education", gics: "253020 - Diversified Consumer Services", gicsSub: "25302010 - Education Services", naics: "6113", nace: "85.3" },
      { code: "85.4", label: "Other education (vocational/technical)", gics: "253020 - Diversified Consumer Services", gicsSub: "25302010 - Education Services", naics: "6114-6116", nace: "85.4" },
    ]},
  { code: "Q", label: "Human Health & Social Work", gics: "35 - Health Care", naics: "62", nace: "Q",
    divisions: [
      { code: "86", label: "Human health activities", gics: "351020 - Health Care Providers & Services", gicsSub: "35102010 - Health Care Facilities", naics: "621-622", nace: "86" },
      { code: "87", label: "Residential care activities", gics: "351020 - Health Care Providers & Services", gicsSub: "35102030 - Managed Health Care", naics: "623", nace: "87" },
      { code: "88", label: "Social work without accommodation", gics: "351020 - Health Care Providers & Services", gicsSub: "35102010 - Health Care Facilities", naics: "624", nace: "88" },
    ]},
  { code: "R", label: "Arts, Entertainment & Recreation", gics: "50 - Communication Services", naics: "71", nace: "R",
    divisions: [
      { code: "90", label: "Creative, arts & entertainment", gics: "502010 - Media", gicsSub: "50201030 - Movies & Entertainment", naics: "7111", nace: "90" },
      { code: "91", label: "Libraries, museums & cultural", gics: "502010 - Media", gicsSub: "50201030 - Movies & Entertainment", naics: "7121", nace: "91" },
      { code: "92", label: "Gambling & betting", gics: "253010 - Hotels, Restaurants & Leisure", gicsSub: "25301010 - Casinos & Gaming", naics: "7132", nace: "92" },
      { code: "93", label: "Sports, amusement & recreation", gics: "253010 - Hotels, Restaurants & Leisure", gicsSub: "25301030 - Leisure Facilities", naics: "7131-7139", nace: "93" },
    ]},
  { code: "S", label: "Other Service Activities", gics: "25 - Consumer Discretionary", naics: "81", nace: "S",
    divisions: [
      { code: "94", label: "Activities of membership organizations", gics: "N/A", gicsSub: "N/A", naics: "8131-8134", nace: "94" },
      { code: "95", label: "Repair of computers & personal goods", gics: "452020 - Technology Hardware", gicsSub: "45202010 - Technology Hardware, Storage & Peripherals", naics: "8112", nace: "95" },
      { code: "96", label: "Other personal service activities", gics: "253020 - Diversified Consumer Services", gicsSub: "25302020 - Specialized Consumer Services", naics: "8121-8129", nace: "96" },
    ]},
];

// ─── EXEMPLARY INDIAN BRSR REPORTS BY NIC SECTION ───
const BRSR_PEERS = {
  A: [
    { company: "ITC Limited", why: "Integrated agri-business with detailed water stewardship, Scope 3 and biodiversity disclosures. Externally assured BRSR Core.", url: "https://www.itcportal.com/investor/index.aspx", sector: "Agri / FMCG" },
    { company: "Godrej Agrovet", why: "Comprehensive value chain traceability, animal welfare policies and detailed community impact metrics.", url: "https://www.godrejagrovet.com/investors", sector: "Agri-inputs" },
    { company: "Tata Consumer Products", why: "Ranked top-2 most sustainable Indian company (BW IMSC 2024). LCA on products, SBTi-committed.", url: "https://www.tataconsumer.com/sustainability", sector: "Food & Beverage" },
  ],
  B: [
    { company: "Tata Steel", why: "Pioneer in Indian ESG reporting since 2001. Detailed Scope 1-3, water stress, mine closure plans and just transition disclosures.", url: "https://www.tatasteel.com/corporate/our-organisation/integrated-report/", sector: "Steel / Mining" },
    { company: "Vedanta Limited", why: "Comprehensive biodiversity & tailings management disclosures. GRI+SASB+TCFD aligned BRSR.", url: "https://www.vedantalimited.com/investor-relations/annual-reports.aspx", sector: "Metals & Mining" },
    { company: "Coal India Limited", why: "Detailed mine reclamation, land rehabilitation and just transition planning for workforce.", url: "https://www.coalindia.in/performance/reports/annual-reports", sector: "Coal Mining" },
  ],
  C: [
    { company: "Mahindra & Mahindra", why: "Externally assured BRSR Core, carbon-neutral operations since 2040 target. Detailed EPR and circular economy metrics.", url: "https://www.mahindra.com/investors", sector: "Auto Manufacturing" },
    { company: "Hindustan Unilever", why: "Best-in-class sustainable sourcing (100% palm oil certified), detailed plastics/packaging circularity data.", url: "https://www.hul.co.in/our-company/annual-reports/", sector: "FMCG Manufacturing" },
    { company: "Larsen & Toubro", why: "Comprehensive green revenue taxonomy, water positivity reporting, and detailed supply chain ESG assessments.", url: "https://www.larsentoubro.com/corporate/investor-relations/", sector: "Engineering / Capital Goods" },
  ],
  D: [
    { company: "NTPC Limited", why: "Detailed renewable energy transition roadmap, ash utilization, and RE capacity addition disclosures.", url: "https://www.ntpc.co.in/en/investors/annual-reports", sector: "Power Generation" },
    { company: "Tata Power", why: "Comprehensive coal-to-clean transition metrics, rooftop solar, EV charging and community electrification data.", url: "https://www.tatapower.com/investors/annual-reports.aspx", sector: "Integrated Power" },
    { company: "Adani Green Energy", why: "World's largest solar developer. Detailed RE capacity, carbon avoidance calculations and biodiversity offsets.", url: "https://www.adanigreenenergy.com/investors/annual-reports", sector: "Renewable Energy" },
  ],
  E: [
    { company: "VA Tech Wabag", why: "Water technology leader with detailed ZLD, desalination and wastewater treatment impact metrics.", url: "https://www.wabag.com/investors/", sector: "Water Treatment" },
    { company: "Ramky Enviro Engineers", why: "Comprehensive waste-to-energy, hazardous waste treatment and circular economy disclosures.", url: "https://www.ramkyenviroengineers.com/investor-relations/", sector: "Waste Management" },
    { company: "Ion Exchange India", why: "Detailed water reuse/recycling metrics and community water access programs.", url: "https://www.ionexchangeindia.com/investor-relation.asp", sector: "Water Solutions" },
  ],
  F: [
    { company: "DLF Limited", why: "Green building certifications, embodied carbon tracking, and net-zero campus targets with detailed metrics.", url: "https://www.dlf.in/investors.aspx", sector: "Real Estate Development" },
    { company: "Godrej Properties", why: "100% new projects green-certified. Comprehensive construction waste and worker safety disclosures.", url: "https://www.godrejproperties.com/investor-relations", sector: "Construction / Real Estate" },
    { company: "Ultratech Cement", why: "Detailed clinker factor, alternative fuel usage and mine biodiversity management plans.", url: "https://www.ultratechcement.com/about-us/sustainability", sector: "Cement / Construction Materials" },
  ],
  G: [
    { company: "Avenue Supermarts (DMart)", why: "Detailed energy efficiency per sq ft, food waste reduction and local sourcing percentages.", url: "https://www.dmartindia.com/investor-relationship/annual-report", sector: "Retail" },
    { company: "Titan Company", why: "Comprehensive responsible sourcing (gold, diamonds), packaging reduction and women workforce disclosures.", url: "https://www.titancompany.in/investors/annual-reports", sector: "Retail / Luxury" },
    { company: "Trent Limited (Westside/Zudio)", why: "Growing sustainability disclosures on sustainable cotton sourcing and store energy efficiency.", url: "https://www.trentlimited.com/investors.html", sector: "Fashion Retail" },
  ],
  H: [
    { company: "Container Corp of India (CONCOR)", why: "Modal shift emissions avoided, rail vs road carbon comparison and detailed fuel intensity metrics.", url: "https://www.concorindia.co.in/annual_report.asp", sector: "Logistics" },
    { company: "InterGlobe Aviation (IndiGo)", why: "Fleet fuel efficiency, SAF roadmap, single-use plastic elimination and carbon offset programs.", url: "https://www.goindigo.in/information/investor-relations.html", sector: "Aviation" },
    { company: "Adani Ports & SEZ", why: "Port electrification, mangrove restoration, and comprehensive Scope 3 transport logistics emissions.", url: "https://www.adaniports.com/Sustainability", sector: "Ports & Logistics" },
  ],
  I: [
    { company: "Indian Hotels (Taj)", why: "Detailed per-room energy/water intensity, food waste composting, local community employment metrics.", url: "https://www.ihcltata.com/investors", sector: "Hospitality" },
    { company: "EIH Limited (Oberoi)", why: "Comprehensive single-use plastic elimination, heritage conservation and biodiversity disclosures.", url: "https://www.eih.co.in/investors-corner/annual-reports", sector: "Hotels" },
    { company: "Jubilant FoodWorks", why: "Detailed packaging sustainability, cold chain efficiency and delivery fleet emissions data.", url: "https://www.jubilantfoodworks.com/investors/annual-reports", sector: "Food Service / QSR" },
  ],
  J: [
    { company: "Infosys", why: "Carbon neutral since 2020. Pioneering BRSR adopter, externally assured, comprehensive Scope 3 and water reporting.", url: "https://www.infosys.com/about/esg.html", sector: "IT Services" },
    { company: "Wipro", why: "Detailed energy per employee, e-waste management, DEI metrics and value chain human rights due diligence.", url: "https://www.wipro.com/investors/annual-reports/", sector: "IT Services" },
    { company: "TCS", why: "Zero-waste-to-landfill campuses, comprehensive biodiversity metrics and Science Based Targets Initiative (SBTi) aligned.", url: "https://www.tcs.com/who-we-are/sustainability", sector: "IT Services" },
  ],
  K: [
    { company: "HDFC Bank", why: "Comprehensive Parivartan (social) program impact data, digital inclusion metrics and green lending portfolio disclosure.", url: "https://www.hdfcbank.com/personal/about-us/investor-relations/annual-reports", sector: "Banking" },
    { company: "Kotak Mahindra Bank", why: "Detailed financed emissions (Scope 3 Cat 15), green bond framework and financial inclusion metrics.", url: "https://www.kotak.com/en/investor-relations/financial-results/annual-reports.html", sector: "Banking" },
    { company: "SBI Life Insurance", why: "Comprehensive governance disclosures, digital penetration and policyholder grievance resolution data.", url: "https://www.sbilife.co.in/en/investor-relations/annual-reports", sector: "Insurance" },
  ],
  L: [
    { company: "Godrej Properties", why: "Green building certifications, embodied carbon tracking and land restoration disclosures.", url: "https://www.godrejproperties.com/investor-relations", sector: "Real Estate" },
    { company: "Brigade Enterprises", why: "Net-zero campus targets, construction waste recycling and water harvesting data per project.", url: "https://www.brigadegroup.com/investors/annual-reports", sector: "Real Estate" },
    { company: "Embassy Office Parks REIT", why: "India's first REIT ESG report. Detailed green building metrics, energy intensity per sq ft.", url: "https://www.embassyofficeparks.com/investors/annual-reports", sector: "REIT" },
  ],
  M: [
    { company: "Infosys BPM", why: "Detailed DEI metrics, upskilling hours per employee and environmental footprint per FTE.", url: "https://www.infosys.com/investors/reports-filings.html", sector: "Professional Services" },
    { company: "CRISIL", why: "Comprehensive governance, ethics training coverage and stakeholder engagement disclosures.", url: "https://www.crisil.com/en/home/investors/annual-reports.html", sector: "Research & Analytics" },
    { company: "Tata Consultancy Services", why: "Leading R&D sustainability integration, patent disclosures on green tech.", url: "https://www.tcs.com/who-we-are/sustainability", sector: "Technology Consulting" },
  ],
  N: [
    { company: "TeamLease Services", why: "Detailed contract worker welfare, skilling metrics and social mobility data.", url: "https://www.teamleasegroup.com/investors", sector: "Staffing Services" },
    { company: "Quess Corp", why: "Comprehensive gig worker welfare, health insurance coverage and training metrics.", url: "https://www.quesscorp.com/investors/annual-report/", sector: "Business Services" },
    { company: "SIS Limited", why: "Detailed security workforce welfare, training hours and safety incident data.", url: "https://www.sisindia.com/investors/annual-reports", sector: "Security Services" },
  ],
  O: [
    { company: "NTPC (Public Sector)", why: "Maharatna PSU with comprehensive ESG disclosure. Model for public administration entities.", url: "https://www.ntpc.co.in/en/investors/annual-reports", sector: "Public Sector" },
    { company: "Indian Oil Corporation", why: "Detailed energy transition, biofuel investments and community impact across refinery locations.", url: "https://iocl.com/pages/annual-reports", sector: "Public Sector / Energy" },
    { company: "ONGC", why: "Comprehensive upstream oil & gas ESG including flaring reduction, offshore safety and local content.", url: "https://ongcindia.com/web/eng/investors/annual-reports", sector: "Public Sector / E&P" },
  ],
  P: [
    { company: "NIIT Limited", why: "Digital skilling impact metrics, learner outcomes and accessibility disclosures.", url: "https://www.niit.com/en/investors/", sector: "EdTech" },
    { company: "Manipal Education", why: "Campus sustainability, research impact and student welfare metrics.", url: "https://www.manipal.edu/mu/about-us.html", sector: "Higher Education" },
    { company: "Aptech Limited", why: "Skill development impact, employability outcomes and digital inclusion data.", url: "https://www.aptech.com/investor-relations/", sector: "Vocational Training" },
  ],
  Q: [
    { company: "Apollo Hospitals", why: "Comprehensive biomedical waste management, patient safety metrics and community health programs.", url: "https://www.apollohospitals.com/investors/annual-reports/", sector: "Healthcare" },
    { company: "Dr. Reddy's Laboratories", why: "Detailed pharmaceutical waste management, access-to-medicine programs and clinical trial ethics.", url: "https://www.drreddys.com/investors/annual-reports", sector: "Pharmaceuticals" },
    { company: "Cipla", why: "Comprehensive API manufacturing environmental disclosures, green chemistry initiatives and patient access data.", url: "https://www.cipla.com/investors/annual-reports", sector: "Pharmaceuticals" },
  ],
  R: [
    { company: "PVR INOX", why: "Cinema energy efficiency per screen, single-use plastic elimination and accessibility disclosures.", url: "https://www.pvrinox.com/investors", sector: "Entertainment" },
    { company: "Zee Entertainment", why: "Content responsibility, digital inclusion and detailed workforce diversity metrics.", url: "https://www.zee.com/investor-relations/", sector: "Media & Entertainment" },
    { company: "Delta Corp", why: "Responsible gaming framework, community impact and governance disclosures.", url: "https://www.deltacorp.in/investors.html", sector: "Gaming & Hospitality" },
  ],
  S: [
    { company: "Thomas Cook India", why: "Travel industry sustainability, carbon offset programs and responsible tourism disclosures.", url: "https://www.thomascook.in/investor-relations", sector: "Travel Services" },
    { company: "Matrimony.com", why: "Digital platform sustainability, data privacy and social impact metrics.", url: "https://www.matrimony.com/group/investors.php", sector: "Online Services" },
    { company: "Just Dial", why: "Digital inclusion for SMEs, platform energy efficiency and community impact.", url: "https://www.justdial.com/cms/investor-relations", sector: "Digital Services" },
  ],
};

// ─── EXEMPLARY GLOBAL ESG REPORTS BY GICS SECTOR ───
const GLOBAL_ESG_PEERS = {
  "10": { sector: "Energy", peers: [
    { company: "TotalEnergies (France)", why: "Comprehensive energy transition roadmap, Scope 3 reporting across value chain, TCFD fully aligned.", url: "https://totalenergies.com/sustainability/reports-and-indicators", framework: "GRI + SASB + TCFD" },
    { company: "Equinor (Norway)", why: "Industry-leading climate risk scenario analysis, CCS technology disclosures, just transition plans.", url: "https://www.equinor.com/sustainability", framework: "GRI + TCFD + ISSB" },
    { company: "Enel (Italy)", why: "Integrated annual report with detailed SDG mapping, renewable capacity growth and electrification metrics.", url: "https://www.enel.com/investors/sustainability", framework: "GRI + SASB + EU Taxonomy" },
  ]},
  "15": { sector: "Materials", peers: [
    { company: "BASF (Germany)", why: "Pioneering Scope 3 upstream/downstream carbon accounting, circular economy metrics, biodiversity commitment.", url: "https://www.basf.com/global/en/who-we-are/sustainability.html", framework: "GRI + SASB + TCFD" },
    { company: "BHP Group (Australia)", why: "Detailed mine closure provisioning, tailings safety, Indigenous communities engagement and water stewardship.", url: "https://www.bhp.com/sustainability", framework: "GRI + SASB + TCFD + TNFD" },
    { company: "Holcim (Switzerland)", why: "Cement industry leader in green concrete, circular construction and Scope 1 reduction with SBTi 1.5°C.", url: "https://www.holcim.com/sustainability", framework: "GRI + TCFD + SBTi" },
  ]},
  "20": { sector: "Industrials", peers: [
    { company: "Siemens (Germany)", why: "Comprehensive DEGREE ESG framework, supply chain decarbonization, and detailed product lifecycle data.", url: "https://www.siemens.com/global/en/company/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Schneider Electric (France)", why: "#1 most sustainable company (Corporate Knights 2024). Detailed Scope 3, supplier decarbonization and access-to-energy.", url: "https://www.se.com/ww/en/about-us/sustainability/", framework: "GRI + SASB + TCFD + EU Taxonomy" },
    { company: "ABB (Switzerland)", why: "Electrification and automation ESG metrics, circular economy targets and detailed human rights due diligence.", url: "https://global.abb/group/en/about/sustainability", framework: "GRI + SASB + TCFD" },
  ]},
  "25": { sector: "Consumer Discretionary", peers: [
    { company: "IKEA / Ingka Group (Sweden)", why: "Circular product design, renewable energy investments, fair wage benchmarking and forest-positive sourcing.", url: "https://www.ingka.com/sustainability/", framework: "GRI + TCFD + SBTi" },
    { company: "Unilever (UK/Netherlands)", why: "Pioneer in integrated ESG reporting. Detailed deforestation-free supply chain, living wage and plastics circularity.", url: "https://www.unilever.com/sustainability/", framework: "GRI + SASB + TCFD + TNFD" },
    { company: "Patagonia (USA)", why: "B Corp certified. Radical transparency in supply chain, 1% for the Planet, repair/reuse program metrics.", url: "https://www.patagonia.com/our-footprint/", framework: "B Corp + Custom ESG" },
  ]},
  "30": { sector: "Consumer Staples", peers: [
    { company: "Nestlé (Switzerland)", why: "Comprehensive deforestation monitoring, regenerative agriculture metrics, packaging recyclability targets.", url: "https://www.nestle.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Danone (France)", why: "B Corp-certified entities, detailed water stewardship, smallholder farmer support and One Planet One Health metrics.", url: "https://www.danone.com/impact/sustainability-goals.html", framework: "GRI + TCFD + B Corp" },
    { company: "Natura &Co (Brazil)", why: "Carbon-neutral operations, Amazon bioeconomy model, comprehensive biodiversity and social impact metrics.", url: "https://www.naturaeco.com/en/investors/", framework: "GRI + IIRC + TCFD" },
  ]},
  "35": { sector: "Health Care", peers: [
    { company: "Novo Nordisk (Denmark)", why: "Zero environmental impact ambition, circular for zero waste, detailed access-to-medicine metrics across LMICs.", url: "https://www.novonordisk.com/sustainable-business.html", framework: "GRI + SASB + TCFD" },
    { company: "Roche (Switzerland)", why: "Comprehensive clinical trial diversity, patient access programs, pharmaceutical waste and water intensity data.", url: "https://www.roche.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "AstraZeneca (UK)", why: "Ambition Zero Carbon by 2025, detailed Scope 3 supply chain, health equity and access programs globally.", url: "https://www.astrazeneca.com/sustainability.html", framework: "GRI + TCFD + SBTi" },
  ]},
  "40": { sector: "Financials", peers: [
    { company: "ING Group (Netherlands)", why: "Pioneer in financed emissions reporting (PCAF methodology), Terra approach to portfolio alignment.", url: "https://www.ing.com/Sustainability.htm", framework: "GRI + TCFD + PCAF" },
    { company: "UBS (Switzerland)", why: "Comprehensive sustainable finance reporting, net-zero banking alliance commitment and climate risk stress testing.", url: "https://www.ubs.com/global/en/sustainability-impact.html", framework: "GRI + SASB + TCFD + NZBA" },
    { company: "DBS Bank (Singapore)", why: "Asia's best ESG bank. Detailed transition finance taxonomy, financial inclusion and responsible lending data.", url: "https://www.dbs.com/sustainability/", framework: "GRI + SASB + TCFD" },
  ]},
  "45": { sector: "Information Technology", peers: [
    { company: "Microsoft (USA)", why: "Carbon negative by 2030 target, water positive, zero waste. Industry-leading Scope 3 and AI sustainability disclosures.", url: "https://www.microsoft.com/en-us/sustainability", framework: "GRI + SASB + TCFD + CDP" },
    { company: "SAP (Germany)", why: "Comprehensive cloud energy efficiency, DEI metrics, supply chain sustainability integration and green cloud data.", url: "https://www.sap.com/about/company/sustainability-csr.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Accenture (Ireland)", why: "Detailed per-employee carbon metrics, 100% renewable energy, comprehensive DEI data and responsible AI framework.", url: "https://www.accenture.com/us-en/about/sustainability/sustainability-value-promise", framework: "GRI + SASB + TCFD + CDP" },
  ]},
  "50": { sector: "Communication Services", peers: [
    { company: "Deutsche Telekom (Germany)", why: "Detailed network energy efficiency, e-waste take-back, digital inclusion and comprehensive human rights reporting.", url: "https://www.telekom.com/en/sustainability", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Telstra (Australia)", why: "Network decarbonization roadmap, digital inclusion programs and detailed modern slavery due diligence.", url: "https://www.telstra.com.au/aboutus/community-environment/reports", framework: "GRI + SASB + TCFD" },
    { company: "KPN (Netherlands)", why: "Circular network equipment, Scope 3 supply chain emissions and social connectivity impact metrics.", url: "https://www.kpn.com/corporate/sustainability", framework: "GRI + TCFD + EU Taxonomy" },
  ]},
  "55": { sector: "Utilities", peers: [
    { company: "Ørsted (Denmark)", why: "Transformed from fossil fuels to world's largest offshore wind developer. Best-in-class energy transition case study.", url: "https://orsted.com/en/sustainability", framework: "GRI + TCFD + SBTi + EU Taxonomy" },
    { company: "Iberdrola (Spain)", why: "Comprehensive RE expansion metrics, green hydrogen, biodiversity net gain and community benefit sharing.", url: "https://www.iberdrola.com/sustainability", framework: "GRI + SASB + TCFD + EU Taxonomy" },
    { company: "NextEra Energy (USA)", why: "Largest wind/solar generator in North America. Detailed emissions avoidance, land use and wildlife impact data.", url: "https://www.nexteraenergy.com/sustainability.html", framework: "GRI + SASB + TCFD" },
  ]},
  "60": { sector: "Real Estate", peers: [
    { company: "Prologis (USA)", why: "Global logistics REIT leader. Detailed green building certifications, rooftop solar and tenant engagement ESG.", url: "https://www.prologis.com/sustainability", framework: "GRI + SASB + TCFD + GRESB" },
    { company: "GPT Group (Australia)", why: "Net-zero by 2024, detailed NABERS energy ratings, tenant sustainability partnerships and circularity.", url: "https://www.gpt.com.au/sustainability", framework: "GRI + TCFD + GRESB" },
    { company: "CapitaLand Investment (Singapore)", why: "Comprehensive GRESB 5-star rated. Green building portfolio, embodied carbon tracking and social impact.", url: "https://www.capitalandinvest.com/en/sustainability.html", framework: "GRI + TCFD + GRESB + SBTi" },
  ]},
};

// ─── EXEMPLARY NAICS-BASED ESG REPORTS (NORTH AMERICA) ───
const NAICS_ESG_PEERS = {
  "11": { sector: "Agriculture, Forestry, Fishing (NAICS 11)", peers: [
    { company: "Cargill (USA)", why: "Comprehensive deforestation-free sourcing, regenerative agriculture targets, detailed water stewardship across 70 countries.", url: "https://www.cargill.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Nutrien (Canada)", why: "Leading fertilizer company with detailed Scope 1-3, sustainable agriculture advisory program and precision ag data.", url: "https://www.nutrien.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Weyerhaeuser (USA)", why: "Timber REIT with carbon-negative operations, FSC-certified forestry and detailed biodiversity conservation metrics.", url: "https://www.weyerhaeuser.com/sustainability/", framework: "GRI + SASB + TCFD" },
  ]},
  "21": { sector: "Mining, Oil & Gas Extraction (NAICS 21)", peers: [
    { company: "Newmont Corporation (USA)", why: "Gold mining leader. Detailed tailings, water, closure planning and Indigenous community partnership disclosures.", url: "https://www.newmont.com/sustainability/", framework: "GRI + SASB + TCFD + ICMM" },
    { company: "ConocoPhillips (USA)", why: "Comprehensive Scope 3 reporting for oil & gas, methane intensity targets and Paris-aligned climate risk scenarios.", url: "https://www.conocophillips.com/sustainability/", framework: "GRI + SASB + TCFD + IPIECA" },
    { company: "Teck Resources (Canada)", why: "Mining company with detailed water quality, biodiversity offset, just transition plans and community investment data.", url: "https://www.teck.com/sustainability/", framework: "GRI + SASB + TCFD + ICMM" },
  ]},
  "22": { sector: "Utilities (NAICS 22)", peers: [
    { company: "NextEra Energy (USA)", why: "Largest wind/solar generator in North America. Detailed emissions avoidance, land use and wildlife impact data.", url: "https://www.nexteraenergy.com/sustainability.html", framework: "GRI + SASB + TCFD" },
    { company: "Brookfield Renewable (Canada)", why: "Pure-play renewable with detailed carbon avoidance, hydro/wind/solar lifecycle and community benefit metrics.", url: "https://bep.brookfield.com/sustainability", framework: "GRI + TCFD + SBTi" },
    { company: "AES Corporation (USA)", why: "Coal-to-clean transition case study. Detailed renewable pipeline, battery storage and grid decarbonization data.", url: "https://www.aes.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "23": { sector: "Construction (NAICS 23)", peers: [
    { company: "Jacobs Solutions (USA)", why: "Engineering firm with net-zero roadmap, detailed Scope 3, DEI metrics and social value from infrastructure projects.", url: "https://www.jacobs.com/about/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Haskell (USA)", why: "Detailed green building certifications, embodied carbon tracking, construction waste diversion rates.", url: "https://www.haskell.com/about/", framework: "GRI + LEED" },
    { company: "EllisDon (Canada)", why: "Construction leader with mass timber innovation, net-zero building commitments and detailed safety metrics.", url: "https://www.ellisdon.com/about", framework: "GRI + CCA Sustainability" },
  ]},
  "31-33": { sector: "Manufacturing (NAICS 31-33)", peers: [
    { company: "3M Company (USA)", why: "Comprehensive product stewardship, PFAS phase-out disclosures, circular design and water quality metrics.", url: "https://www.3m.com/3M/en_US/sustainability-us/", framework: "GRI + SASB + TCFD + CDP" },
    { company: "General Motors (USA)", why: "EV transition roadmap, Scope 1-3 with supply chain battery minerals traceability and factory zero-waste.", url: "https://investor.gm.com/esg", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Procter & Gamble (USA)", why: "Detailed packaging circularity, responsible sourcing (palm oil, wood pulp), water-saving product innovation.", url: "https://us.pg.com/esg/", framework: "GRI + SASB + TCFD + CDP" },
  ]},
  "42-45": { sector: "Wholesale & Retail Trade (NAICS 42-45)", peers: [
    { company: "Costco Wholesale (USA)", why: "Detailed responsible sourcing, living wage data, seafood/palm oil traceability and packaging reduction metrics.", url: "https://www.costco.com/sustainability-introduction.html", framework: "SASB + TCFD + CDP" },
    { company: "Target Corporation (USA)", why: "Comprehensive chemical transparency, circular design, supplier DEI and community investment data.", url: "https://corporate.target.com/sustainability-governance", framework: "GRI + SASB + TCFD" },
    { company: "Canadian Tire (Canada)", why: "Detailed EV charging network, packaging recyclability, product durability and community sports investment.", url: "https://corp.canadiantire.ca/English/investors/", framework: "GRI + SASB + TCFD" },
  ]},
  "48-49": { sector: "Transportation & Warehousing (NAICS 48-49)", peers: [
    { company: "Union Pacific Railroad (USA)", why: "Modal shift emissions methodology, fuel efficiency per ton-mile, detailed community safety and land use metrics.", url: "https://www.up.com/aboutup/community/", framework: "GRI + SASB + TCFD" },
    { company: "FedEx (USA)", why: "EV fleet conversion roadmap, carbon-neutral by 2040 target with detailed aviation SAF and last-mile efficiency.", url: "https://www.fedex.com/en-us/about/sustainability.html", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Air Canada", why: "SAF procurement strategy, fleet fuel efficiency, detailed per-RPK emissions and carbon offset program data.", url: "https://www.aircanada.com/ca/en/aco/home/about.html", framework: "GRI + TCFD + CORSIA" },
  ]},
  "51": { sector: "Information (NAICS 51)", peers: [
    { company: "Microsoft (USA)", why: "Carbon negative by 2030. Industry-leading Scope 3, water positive, zero waste and responsible AI disclosures.", url: "https://www.microsoft.com/en-us/sustainability", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Salesforce (USA)", why: "Net-zero across value chain, detailed data center efficiency (PUE), stakeholder capitalism metrics.", url: "https://www.salesforce.com/company/sustainability/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Alphabet / Google (USA)", why: "24/7 carbon-free energy target, data center water efficiency, detailed AI ethics and digital equity data.", url: "https://sustainability.google/reports/", framework: "GRI + SASB + TCFD + CDP" },
  ]},
  "52": { sector: "Finance & Insurance (NAICS 52)", peers: [
    { company: "Bank of America (USA)", why: "Detailed financed emissions, $1.5T sustainable finance target, ESG integration into lending and underwriting.", url: "https://about.bankofamerica.com/en/making-an-impact", framework: "GRI + SASB + TCFD + PCAF" },
    { company: "TD Bank (Canada)", why: "Comprehensive climate action plan, financed emissions across sectors, Indigenous reconciliation and financial inclusion.", url: "https://www.td.com/ca/en/about-td/for-investors/annual-reports", framework: "GRI + SASB + TCFD + PCAF + NZBA" },
    { company: "BlackRock (USA)", why: "World's largest asset manager. Investment stewardship, climate voting record, transition finance metrics.", url: "https://www.blackrock.com/corporate/about-us/sustainability-resilience-research", framework: "SASB + TCFD + ISSB" },
  ]},
  "53": { sector: "Real Estate (NAICS 53)", peers: [
    { company: "Prologis (USA)", why: "Global logistics REIT leader. Green certifications, rooftop solar on warehouses and tenant ESG engagement.", url: "https://www.prologis.com/sustainability", framework: "GRI + SASB + TCFD + GRESB" },
    { company: "Boston Properties (USA)", why: "Net-zero by 2025 target, detailed energy/water intensity per sq ft, WELL certified office portfolio.", url: "https://www.bxp.com/about/sustainability", framework: "GRI + SASB + TCFD + GRESB" },
    { company: "Brookfield Asset Management (Canada)", why: "Net-zero by 2050 across $800B AUM, renewable energy portfolio and detailed GRESB-aligned property data.", url: "https://www.brookfield.com/sustainability-and-impact", framework: "GRI + TCFD + GRESB + SBTi" },
  ]},
  "54": { sector: "Professional & Technical Services (NAICS 54)", peers: [
    { company: "Accenture (USA/Ireland)", why: "Detailed per-employee carbon, 100% renewable energy, comprehensive DEI data and responsible AI framework.", url: "https://www.accenture.com/us-en/about/sustainability/sustainability-value-promise", framework: "GRI + SASB + TCFD + CDP" },
    { company: "WSP Global (Canada)", why: "Engineering consultancy with SBTi targets, detailed project-level sustainability impact and green revenue data.", url: "https://www.wsp.com/en-gl/who-we-are/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Deloitte (USA)", why: "WorldClimate strategy, detailed Scope 1-3, supply chain decarbonization and pro-bono sustainability advisory.", url: "https://www.deloitte.com/global/en/about/governance/global-impact-report.html", framework: "GRI + TCFD + SBTi" },
  ]},
  "56": { sector: "Administrative & Support Services (NAICS 56)", peers: [
    { company: "Waste Management Inc. (USA)", why: "Detailed landfill-gas-to-energy, recycling contamination rates, fleet CNG conversion and community impact.", url: "https://www.wm.com/us/en/inside-wm/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Republic Services (USA)", why: "Circular economy metrics, detailed plastics recovery innovation and polymer-specific recycling data.", url: "https://www.republicservices.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Cintas Corporation (USA)", why: "Uniform rental circular model, water/energy per pound laundered, and detailed employee safety metrics.", url: "https://www.cintas.com/company/esg-reporting/", framework: "GRI + SASB" },
  ]},
  "61": { sector: "Educational Services (NAICS 61)", peers: [
    { company: "Coursera (USA)", why: "Digital skills access metrics, learner outcomes data, and carbon footprint of online vs campus learning.", url: "https://about.coursera.org/", framework: "Custom ESG / Impact" },
    { company: "Chegg (USA)", why: "Textbook rental circular model, paper/packaging sustainability and student financial wellbeing data.", url: "https://investor.chegg.com/", framework: "GRI + Custom ESG" },
    { company: "2U Inc. (USA)", why: "Online education access metrics, first-generation student support and digital divide bridging programs.", url: "https://2u.com/about/", framework: "Custom ESG / Impact" },
  ]},
  "62": { sector: "Health Care & Social Assistance (NAICS 62)", peers: [
    { company: "Johnson & Johnson (USA)", why: "Comprehensive product lifecycle, access-to-medicine in LMICs, DEI in clinical trials and green chemistry.", url: "https://www.jnj.com/esg", framework: "GRI + SASB + TCFD + CDP" },
    { company: "UnitedHealth Group (USA)", why: "Health equity metrics, detailed social determinants of health programs and community health investment.", url: "https://www.unitedhealthgroup.com/who-we-are/annual-reports.html", framework: "GRI + SASB + TCFD" },
    { company: "Pfizer (USA)", why: "Global access-to-medicine programs, clinical trial diversity, pharmaceutical waste and green chemistry.", url: "https://www.pfizer.com/about/responsibility/esg-report", framework: "GRI + SASB + TCFD + CDP" },
  ]},
  "71": { sector: "Arts, Entertainment & Recreation (NAICS 71)", peers: [
    { company: "Walt Disney Company (USA)", why: "Theme park energy/water efficiency, wildlife conservation programs and content responsibility framework.", url: "https://thewaltdisneycompany.com/esg-reporting/", framework: "GRI + SASB + TCFD" },
    { company: "Live Nation Entertainment (USA)", why: "Event-level carbon footprint, single-use plastic elimination, fan engagement and venue sustainability.", url: "https://www.livenationentertainment.com/investors/", framework: "GRI + Custom ESG" },
    { company: "Vail Resorts (USA)", why: "Commitment to Zero by 2030, detailed ski resort energy/water, forest conservation and community access.", url: "https://www.vailresorts.com/our-impact/esg", framework: "GRI + SASB + SBTi" },
  ]},
  "72": { sector: "Accommodation & Food Services (NAICS 72)", peers: [
    { company: "Marriott International (USA)", why: "Serve 360 platform. Detailed per-room energy/water, food waste, human trafficking prevention and DEI.", url: "https://www.marriott.com/about/serve-360.mi", framework: "GRI + SASB + TCFD" },
    { company: "Hilton (USA)", why: "Travel with Purpose. LightStay system for per-property environmental tracking, soap recycling, and modern slavery.", url: "https://esg.hilton.com/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "McDonald's Corporation (USA)", why: "Detailed packaging recyclability, deforestation-free beef/soy, antibiotic-free sourcing and franchise ESG.", url: "https://corporate.mcdonalds.com/corpmcd/our-purpose-and-impact.html", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "81": { sector: "Other Services (NAICS 81)", peers: [
    { company: "ServiceMaster (USA)", why: "Fleet efficiency, chemical management, detailed employee safety and community disaster response metrics.", url: "https://www.servicemaster.com/about-us/", framework: "Custom ESG" },
    { company: "Goodwill Industries (USA)", why: "Social enterprise model, detailed employment outcomes for disadvantaged groups and circular economy metrics.", url: "https://www.goodwill.org/about-us/", framework: "Impact / Custom ESG" },
    { company: "H&R Block (USA)", why: "Financial literacy programs, community tax assistance and digital inclusion data.", url: "https://www.hrblock.com/corporate/investor-relations/", framework: "Custom ESG" },
  ]},
  "92": { sector: "Public Administration (NAICS 92)", peers: [
    { company: "Lockheed Martin (USA)", why: "Defense sector ESG leader. Detailed energy/water per facility, supply chain ethics, STEM education investment.", url: "https://sustainability.lockheedmartin.com/", framework: "GRI + SASB + TCFD" },
    { company: "Booz Allen Hamilton (USA)", why: "Government services with DEI metrics, veteran employment, detailed cybersecurity and community STEM data.", url: "https://www.boozallen.com/about/annual-report.html", framework: "GRI + SASB" },
    { company: "General Dynamics (USA)", why: "Defense contractor with detailed environmental compliance, worker safety and ethics/anti-corruption programs.", url: "https://www.gd.com/responsibility/reports-and-resources", framework: "GRI + SASB" },
  ]},
};

// ─── EXEMPLARY NACE-BASED ESG REPORTS (EUROPEAN) ───
const NACE_ESG_PEERS = {
  A: { sector: "Agriculture, Forestry & Fishing (NACE A)", peers: [
    { company: "Kerry Group (Ireland)", why: "Food ingredients leader with regenerative agriculture, Scope 3 farm-level emissions and biodiversity net gain.", url: "https://www.kerrygroup.com/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Yara International (Norway)", why: "Fertilizer company with green ammonia, precision farming emissions reduction and food security metrics.", url: "https://www.yara.com/investor-relations/", framework: "GRI + TCFD + SBTi + EU Taxonomy" },
    { company: "Mowi ASA (Norway)", why: "World's largest salmon farmer. Detailed feed sourcing, sea lice, fish welfare and marine biodiversity data.", url: "https://mowi.com/investors/", framework: "GRI + SASB + TCFD + ASC" },
  ]},
  B: { sector: "Mining & Quarrying (NACE B)", peers: [
    { company: "BHP Group (Australia/UK)", why: "Detailed tailings safety, Indigenous partnerships, mine closure provisioning and water stewardship data.", url: "https://www.bhp.com/sustainability", framework: "GRI + SASB + TCFD + TNFD + ICMM" },
    { company: "Boliden (Sweden)", why: "Circular metals from e-waste, detailed smelter emissions, mine rehabilitation and Arctic biodiversity.", url: "https://www.boliden.com/investors", framework: "GRI + TCFD + EU Taxonomy + CSRD" },
    { company: "Anglo American (UK)", why: "FutureSmart Mining, detailed water, energy and biodiversity KPIs with integrated social performance data.", url: "https://www.angloamerican.com/investors", framework: "GRI + SASB + TCFD + ICMM" },
  ]},
  C: { sector: "Manufacturing (NACE C)", peers: [
    { company: "Schneider Electric (France)", why: "#1 most sustainable company (Corporate Knights 2024). Scope 3, supplier decarbonization and energy access.", url: "https://www.se.com/ww/en/about-us/sustainability/", framework: "GRI + SASB + TCFD + EU Taxonomy + CSRD" },
    { company: "BASF (Germany)", why: "Chemical industry pioneer in Scope 3 accounting, circular economy metrics and biodiversity commitment.", url: "https://www.basf.com/global/en/who-we-are/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Volvo Group (Sweden)", why: "Electric truck transition, fossil-free steel procurement, detailed lifecycle emissions and road safety data.", url: "https://www.volvogroup.com/en/investors.html", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  D: { sector: "Electricity, Gas, Steam & AC (NACE D)", peers: [
    { company: "Ørsted (Denmark)", why: "Fossil fuel to offshore wind transformation. Best-in-class energy transition case study.", url: "https://orsted.com/en/sustainability", framework: "GRI + TCFD + SBTi + EU Taxonomy + CSRD" },
    { company: "Iberdrola (Spain)", why: "Comprehensive RE expansion, green hydrogen, biodiversity net gain and community benefit sharing.", url: "https://www.iberdrola.com/sustainability", framework: "GRI + SASB + TCFD + EU Taxonomy" },
    { company: "Enel (Italy)", why: "Integrated reporting with SDG mapping, renewable capacity growth and electrification metrics.", url: "https://www.enel.com/investors/sustainability", framework: "GRI + SASB + TCFD + EU Taxonomy + CSRD" },
  ]},
  E: { sector: "Water Supply, Sewerage, Waste (NACE E)", peers: [
    { company: "Veolia (France)", why: "Global water/waste leader. Circular economy revenue, water reuse metrics, detailed hazardous waste treatment.", url: "https://www.veolia.com/en/our-commitments", framework: "GRI + TCFD + EU Taxonomy + CSRD" },
    { company: "Suez (France)", why: "Smart water networks, waste-to-resource conversion rates and detailed microplastics research data.", url: "https://www.suez.com/en/investors", framework: "GRI + TCFD + EU Taxonomy" },
    { company: "Severn Trent (UK)", why: "Water utility with net-zero by 2030, river health metrics, leakage reduction and nature-based solutions.", url: "https://www.severntrent.com/investors/", framework: "GRI + TCFD + TNFD + SBTi" },
  ]},
  F: { sector: "Construction (NACE F)", peers: [
    { company: "Skanska (Sweden)", why: "Green construction pioneer. Embodied carbon tracking per project, timber innovation and safety metrics.", url: "https://www.skanska.com/investors/", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Holcim (Switzerland)", why: "Cement/building materials with green concrete, circular construction and Scope 1 reduction (SBTi 1.5°C).", url: "https://www.holcim.com/sustainability", framework: "GRI + TCFD + SBTi + EU Taxonomy" },
    { company: "Saint-Gobain (France)", why: "Building materials with detailed embodied carbon, renovation impact metrics and indoor air quality data.", url: "https://www.saint-gobain.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  G: { sector: "Wholesale & Retail Trade (NACE G)", peers: [
    { company: "IKEA / Ingka Group (Sweden)", why: "Circular product design, renewable investments, fair wage benchmarking and forest-positive sourcing.", url: "https://www.ingka.com/sustainability/", framework: "GRI + TCFD + SBTi" },
    { company: "Inditex / Zara (Spain)", why: "Fashion with circular design, Join Life sustainable collections, detailed supplier audit and water data.", url: "https://www.inditex.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Ahold Delhaize (Netherlands)", why: "Retail with healthy/sustainable product sales %, food waste reduction and local sourcing metrics.", url: "https://www.aholddelhaize.com/investors/", framework: "GRI + SASB + TCFD + SBTi + CSRD" },
  ]},
  H: { sector: "Transportation & Storage (NACE H)", peers: [
    { company: "Maersk (Denmark)", why: "Shipping decarbonization leader. Green methanol vessels, detailed Scope 1 per TEU and port electrification.", url: "https://www.maersk.com/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Deutsche Post DHL (Germany)", why: "Mission 2050 zero emissions. Electric delivery fleet, GoGreen solutions and detailed last-mile data.", url: "https://www.dhl.com/global-en/home/about-us/sustainability.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Ferrovie dello Stato (Italy)", why: "Rail electrification, modal shift metrics, detailed per-passenger-km emissions and accessibility data.", url: "https://www.fsitaliane.it/content/fsitaliane/en/investor-relations.html", framework: "GRI + TCFD + EU Taxonomy" },
  ]},
  I: { sector: "Accommodation & Food Service (NACE I)", peers: [
    { company: "Accor (France)", why: "Watch Water Act Local program. Per-room energy/water intensity across 5,500 hotels, food waste and DEI.", url: "https://group.accor.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Compass Group (UK)", why: "Contract catering with food waste per meal, plant-forward menus and detailed supply chain sustainability.", url: "https://www.compass-group.com/en/investors.html", framework: "GRI + TCFD + SBTi" },
    { company: "NH Hotel Group / Minor (Spain/Thailand)", why: "Green key certified properties, per-room carbon footprint and local community employment metrics.", url: "https://www.nhhotelgroup.com/en/investors", framework: "GRI + TCFD + EU Taxonomy" },
  ]},
  J: { sector: "Information & Communication (NACE J)", peers: [
    { company: "SAP (Germany)", why: "Comprehensive cloud energy efficiency, DEI metrics, supply chain sustainability and green cloud data.", url: "https://www.sap.com/about/company/sustainability-csr.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Deutsche Telekom (Germany)", why: "Network energy efficiency, e-waste take-back, digital inclusion and comprehensive human rights reporting.", url: "https://www.telekom.com/en/sustainability", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Nokia (Finland)", why: "5G energy efficiency, circular device programs, conflict minerals due diligence and digital bridge metrics.", url: "https://www.nokia.com/about-us/investors/", framework: "GRI + SASB + TCFD + CSRD" },
  ]},
  K: { sector: "Financial & Insurance (NACE K)", peers: [
    { company: "ING Group (Netherlands)", why: "Pioneer in financed emissions (PCAF), Terra approach to portfolio alignment and transition finance.", url: "https://www.ing.com/Sustainability.htm", framework: "GRI + TCFD + PCAF + CSRD" },
    { company: "Allianz (Germany)", why: "Insurance ESG integration, detailed climate risk stress testing, net-zero insurance alliance commitments.", url: "https://www.allianz.com/en/investor_relations/", framework: "GRI + SASB + TCFD + NZIA + CSRD" },
    { company: "Nordea (Finland)", why: "Nordic bank with comprehensive green bond portfolio, financed emissions and financial inclusion metrics.", url: "https://www.nordea.com/en/investors", framework: "GRI + TCFD + PCAF + NZBA + CSRD" },
  ]},
  L: { sector: "Real Estate (NACE L)", peers: [
    { company: "GPT Group (Australia)", why: "Net-zero, NABERS 5-star, tenant sustainability and circularity metrics.", url: "https://www.gpt.com.au/sustainability", framework: "GRI + TCFD + GRESB" },
    { company: "Vonovia (Germany)", why: "Largest EU residential REIT. Energy-efficient retrofit data, tenant affordability and social housing metrics.", url: "https://www.vonovia.com/en/investors/reports", framework: "GRI + TCFD + GRESB + CSRD" },
    { company: "British Land (UK)", why: "Net-zero pathway, BREEAM certifications, embodied carbon targets and social value per development.", url: "https://www.britishland.com/investors", framework: "GRI + TCFD + GRESB + SBTi" },
  ]},
  M: { sector: "Professional, Scientific & Technical (NACE M)", peers: [
    { company: "Siemens (Germany)", why: "DEGREE ESG framework, supply chain decarbonization and product lifecycle sustainability data.", url: "https://www.siemens.com/global/en/company/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Bureau Veritas (France)", why: "Testing/certification company with detailed green revenue taxonomy and sustainable services portfolio.", url: "https://group.bureauveritas.com/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Arup (UK)", why: "Engineering consultancy with project-level carbon modelling, social value framework and pro-bono impact.", url: "https://www.arup.com/about-arup/annual-report", framework: "GRI + TCFD + SBTi" },
  ]},
  N: { sector: "Administrative & Support (NACE N)", peers: [
    { company: "ISS A/S (Denmark)", why: "Facility services with per-site energy management, cleaning chemical sustainability and worker welfare.", url: "https://www.issworld.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Randstad (Netherlands)", why: "Staffing with detailed worker welfare, skills development outcomes and equal pay gap data.", url: "https://www.randstad.com/investor-relations/", framework: "GRI + TCFD + CSRD" },
    { company: "Adecco Group (Switzerland)", why: "Workforce solutions with reskilling impact metrics, youth employment and DEI data across 60 countries.", url: "https://www.adeccogroup.com/investors/", framework: "GRI + TCFD + SBTi" },
  ]},
  O: { sector: "Public Administration & Defence (NACE O)", peers: [
    { company: "BAE Systems (UK)", why: "Defense with detailed environmental compliance, community STEM investment and supply chain ethics.", url: "https://www.baesystems.com/en/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Thales (France)", why: "Defense/aerospace with detailed conflict minerals, cybersecurity ethics and carbon-neutral site operations.", url: "https://www.thalesgroup.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Leonardo (Italy)", why: "Aerospace/defense with detailed clean aviation R&D, circular materials and community engagement metrics.", url: "https://www.leonardo.com/en/investors", framework: "GRI + TCFD + CSRD" },
  ]},
  P: { sector: "Education (NACE P)", peers: [
    { company: "Pearson (UK)", why: "EdTech with digital learning access metrics, efficacy research and environmental footprint per learner.", url: "https://www.pearson.com/en-gb/investor-relations.html", framework: "GRI + TCFD + SBTi" },
    { company: "Springer Nature (Germany)", why: "Academic publishing with open access metrics, paper sourcing sustainability and carbon-neutral operations.", url: "https://group.springernature.com/gp/group/about-us", framework: "GRI + TCFD + CSRD" },
    { company: "Technip Energies (France)", why: "Engineering academy with detailed upskilling metrics and knowledge transfer impact in energy transition.", url: "https://www.technipenergies.com/investors", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  Q: { sector: "Human Health & Social Work (NACE Q)", peers: [
    { company: "Novo Nordisk (Denmark)", why: "Zero environmental impact ambition, circular zero waste, detailed access-to-medicine metrics across LMICs.", url: "https://www.novonordisk.com/sustainable-business.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Roche (Switzerland)", why: "Clinical trial diversity, patient access programs, pharmaceutical waste and water intensity data.", url: "https://www.roche.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Fresenius Medical Care (Germany)", why: "Dialysis with per-treatment energy/water, patient outcomes, and detailed medical waste metrics.", url: "https://www.freseniusmedicalcare.com/en/investors/reports-and-publications", framework: "GRI + TCFD + CSRD" },
  ]},
  R: { sector: "Arts, Entertainment & Recreation (NACE R)", peers: [
    { company: "Spotify (Sweden)", why: "Data center efficiency, content creator equity, accessibility features and carbon footprint per stream.", url: "https://newsroom.spotify.com/sustainability/", framework: "GRI + TCFD + CSRD" },
    { company: "Ubisoft (France)", why: "Gaming with detailed DEI, energy per player-hour, e-waste and responsible content metrics.", url: "https://www.ubisoft.com/en-us/company/about-us/csr", framework: "GRI + TCFD + CSRD" },
    { company: "Merlin Entertainments (UK)", why: "Theme park energy/water per visitor, wildlife conservation programs and accessibility data.", url: "https://www.merlinentertainments.biz/about-us/", framework: "GRI + Custom ESG" },
  ]},
  S: { sector: "Other Service Activities (NACE S)", peers: [
    { company: "Sodexo (France)", why: "Food/facilities services with food waste per meal, DEI hiring, community nutrition and responsible sourcing.", url: "https://www.sodexo.com/en/corporate-responsibility", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Bureau Veritas (France)", why: "Testing/inspection with green service portfolio revenue and detailed ethical auditing supply chain data.", url: "https://group.bureauveritas.com/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "SGS SA (Switzerland)", why: "Inspection/certification with sustainable solutions portfolio and detailed environmental compliance data.", url: "https://www.sgs.com/en/sustainability", framework: "GRI + TCFD + SBTi" },
  ]},
};

// ─── DIVISION-LEVEL INDIAN BRSR PEERS (by NIC division code) ───
const BRSR_DIV_PEERS = {
  "01": [
    { company: "ITC Limited (Agri Business)", why: "Detailed watershed, soil health, e-Choupal farmer digitization and Scope 3 farm-level emissions.", url: "https://www.itcportal.com/investor/index.aspx", sector: "Crop & Animal Production" },
    { company: "UPL Limited", why: "Agrochemicals with detailed product stewardship, bio-solutions portfolio and farmer training impact.", url: "https://www.upl-ltd.com/investors", sector: "Agri-inputs" },
    { company: "Godrej Agrovet", why: "Animal feed, palm oil, crop protection with value chain traceability and biodiversity disclosures.", url: "https://www.godrejagrovet.com/investors", sector: "Agri Business" },
  ],
  "05": [
    { company: "Coal India Limited", why: "Detailed mine reclamation, land rehabilitation, renewable energy at mines and just transition planning.", url: "https://www.coalindia.in/performance/reports/annual-reports", sector: "Coal Mining" },
    { company: "Singareni Collieries", why: "Coal mine safety metrics, community resettlement and solar power integration disclosures.", url: "https://scclmines.com/", sector: "Coal Mining" },
    { company: "NMDC Limited", why: "Iron ore miner with detailed biodiversity offset, water recycling and tribal welfare metrics.", url: "https://www.nmdc.co.in/investors-corner", sector: "Metal Ore Mining" },
  ],
  "06": [
    { company: "ONGC", why: "Comprehensive flaring reduction, offshore safety, methane intensity and decommissioning plans.", url: "https://ongcindia.com/web/eng/investors/annual-reports", sector: "Oil & Gas E&P" },
    { company: "Oil India Limited", why: "Detailed upstream emissions, biodiversity in NE India operations and community development.", url: "https://www.oil-india.com/investor-centre", sector: "Oil & Gas E&P" },
    { company: "Cairn Oil & Gas (Vedanta)", why: "Tight oil operations with water recycling, community engagement and carbon intensity metrics.", url: "https://www.vedantalimited.com/investor-relations/annual-reports.aspx", sector: "Oil & Gas E&P" },
  ],
  "10": [
    { company: "Nestle India", why: "Detailed regenerative agriculture sourcing, packaging recyclability targets and nutrition access metrics.", url: "https://www.nestle.in/investors/annual-report", sector: "Food Products" },
    { company: "Britannia Industries", why: "Comprehensive packaging sustainability, water stewardship per factory and farmer sourcing data.", url: "https://britannia.co.in/investor-relations", sector: "Food Products" },
    { company: "Tata Consumer Products", why: "Ranked top-2 most sustainable Indian company. LCA on products, SBTi-committed.", url: "https://www.tataconsumer.com/sustainability", sector: "Food & Beverage" },
  ],
  "19": [
    { company: "Indian Oil Corporation", why: "Detailed energy transition, biofuel investments, refinery emissions intensity and green hydrogen R&D.", url: "https://iocl.com/pages/annual-reports", sector: "Petroleum Refining" },
    { company: "Bharat Petroleum (BPCL)", why: "Refinery water recycling, CGD expansion, EV charging and detailed Scope 1-2 emissions per refinery.", url: "https://www.bharatpetroleum.in/investors/annual-report.aspx", sector: "Petroleum Refining" },
    { company: "Reliance Industries", why: "O2C segment with detailed circular economy (PET recycling), new energy business and carbon credits.", url: "https://www.ril.com/investors/financial-reporting/annual-reports", sector: "Petrochem & Refining" },
  ],
  "20": [
    { company: "Tata Chemicals", why: "Soda ash with detailed energy/water intensity, brine management and carbon capture pilot data.", url: "https://www.tatachemicals.com/investors", sector: "Chemicals" },
    { company: "Pidilite Industries", why: "Adhesives with VOC reduction, green product portfolio % and detailed EPR compliance data.", url: "https://www.pidilite.com/investors", sector: "Specialty Chemicals" },
    { company: "SRF Limited", why: "Fluorochemicals/packaging films with detailed ozone-depleting substance phase-out and HFC transition.", url: "https://www.srf.com/investors/", sector: "Chemicals" },
  ],
  "21": [
    { company: "Dr. Reddy's Laboratories", why: "Detailed API waste management, green chemistry metrics, access-to-medicine programs and clinical trial ethics.", url: "https://www.drreddys.com/investors/annual-reports", sector: "Pharmaceuticals" },
    { company: "Cipla", why: "Comprehensive API environmental disclosures, green chemistry, respiratory access programs globally.", url: "https://www.cipla.com/investors/annual-reports", sector: "Pharmaceuticals" },
    { company: "Sun Pharmaceutical", why: "Detailed pharmaceutical waste, water intensity per unit, and patient assistance programs.", url: "https://sunpharma.com/investors/", sector: "Pharmaceuticals" },
  ],
  "23": [
    { company: "Ultratech Cement", why: "Detailed clinker factor, alternative fuel usage, TSR %, mine biodiversity and water positivity data.", url: "https://www.ultratechcement.com/about-us/sustainability", sector: "Cement" },
    { company: "Ambuja Cements", why: "Water positive since 2020. Detailed thermal substitution rate and circular economy metrics.", url: "https://www.ambujacement.com/investors", sector: "Cement" },
    { company: "Shree Cement", why: "Lowest carbon intensity among Indian cement companies with detailed waste heat recovery data.", url: "https://www.shreecement.com/investors/", sector: "Cement" },
  ],
  "24": [
    { company: "Tata Steel", why: "Pioneer in ESG reporting. Detailed Scope 1-3, water stress, mine closure plans and just transition.", url: "https://www.tatasteel.com/corporate/our-organisation/integrated-report/", sector: "Steel" },
    { company: "JSW Steel", why: "Detailed steel recycling rate, EAF vs BOF mix, carbon intensity roadmap and water recycling.", url: "https://www.jsw.in/investors/steel", sector: "Steel" },
    { company: "Hindalco Industries", why: "Aluminium/copper with detailed bauxite residue management, recycled content and energy intensity.", url: "https://www.hindalco.com/investors/annual-reports", sector: "Non-ferrous Metals" },
  ],
  "26": [
    { company: "Dixon Technologies", why: "Electronics manufacturing with detailed e-waste management, conflict minerals and energy per unit.", url: "https://www.dixoninfo.com/investors.php", sector: "Electronics" },
    { company: "Kaynes Technology", why: "PCB/box-build with detailed hazardous substance management and RoHS compliance data.", url: "https://www.kaynestech.com/investors/", sector: "Electronics Manufacturing" },
    { company: "Bharat Electronics (BEL)", why: "Defense electronics with detailed environmental compliance, waste management and community initiatives.", url: "https://www.bel-india.in/Investor.aspx", sector: "Electronic Equipment" },
  ],
  "29": [
    { company: "Mahindra & Mahindra", why: "Externally assured BRSR Core, carbon-neutral operations target. Detailed EV transition and EPR data.", url: "https://www.mahindra.com/investors", sector: "Automobiles" },
    { company: "Tata Motors", why: "Detailed EV portfolio lifecycle, battery recycling roadmap, per-vehicle emissions and water intensity.", url: "https://www.tatamotors.com/investors/annual-reports/", sector: "Automobiles" },
    { company: "Maruti Suzuki", why: "Detailed per-vehicle energy/water/waste metrics, supplier ESG scoring and scrapping policy data.", url: "https://www.marutisuzuki.com/corporate/investors/annual-reports", sector: "Automobiles" },
  ],
  "35.1": [
    { company: "NTPC Limited", why: "Detailed RE transition roadmap, ash utilization, and renewable capacity addition disclosures.", url: "https://www.ntpc.co.in/en/investors/annual-reports", sector: "Power Generation" },
    { company: "Tata Power", why: "Comprehensive coal-to-clean transition metrics, rooftop solar and EV charging data.", url: "https://www.tatapower.com/investors/annual-reports.aspx", sector: "Integrated Power" },
    { company: "Adani Green Energy", why: "World's largest solar developer. Detailed RE capacity and carbon avoidance calculations.", url: "https://www.adanigreenenergy.com/investors/annual-reports", sector: "Renewable Energy" },
  ],
  "49": [
    { company: "Container Corp (CONCOR)", why: "Rail vs road modal shift carbon avoided, fuel intensity per TEU-km and safety metrics.", url: "https://www.concorindia.co.in/annual_report.asp", sector: "Rail Transport" },
    { company: "Delhivery", why: "Logistics with per-shipment carbon intensity, fleet electrification and first/last-mile efficiency.", url: "https://www.delhivery.com/investors/", sector: "Logistics" },
    { company: "Adani Ports", why: "Port electrification, mangrove restoration and Scope 3 transport logistics emissions.", url: "https://www.adaniports.com/investors", sector: "Port & Logistics" },
  ],
  "51": [
    { company: "InterGlobe Aviation (IndiGo)", why: "Fleet fuel efficiency, SAF roadmap, single-use plastic elimination and per-RPK emissions.", url: "https://www.goindigo.in/information/investor-relations.html", sector: "Airlines" },
    { company: "Air India (Tata)", why: "Fleet renewal carbon impact, on-board waste management and accessibility disclosures.", url: "https://www.airindia.com/in/en/about-us.html", sector: "Airlines" },
    { company: "SpiceJet", why: "Fuel efficiency metrics, carbon offset programs and operational waste management.", url: "https://www.spicejet.com/Corporate.aspx", sector: "Airlines" },
  ],
  "55": [
    { company: "Indian Hotels (Taj)", why: "Paathya sustainability framework. Per-room energy/water intensity and food waste composting.", url: "https://www.ihcltata.com/investors", sector: "Hotels" },
    { company: "EIH Limited (Oberoi)", why: "Heritage conservation, single-use plastic elimination and biodiversity at resort properties.", url: "https://www.eih.co.in/investors-corner/annual-reports", sector: "Hotels" },
    { company: "Lemon Tree Hotels", why: "Differently-abled employment model, per-room resource intensity and community impact.", url: "https://www.lemontreehotels.com/investors.aspx", sector: "Hotels" },
  ],
  "61": [
    { company: "Bharti Airtel", why: "Network energy efficiency, tower solarization, e-waste management and digital inclusion metrics.", url: "https://www.airtel.in/about-bharti/investors", sector: "Telecom" },
    { company: "Reliance Jio", why: "Green network infrastructure, fiber vs copper lifecycle, digital literacy and rural connectivity.", url: "https://www.ril.com/investors/financial-reporting/annual-reports", sector: "Telecom" },
    { company: "Vodafone Idea", why: "Tower sharing carbon savings, network energy optimization and electronic waste management.", url: "https://www.myvi.in/about-us/investor-relations", sector: "Telecom" },
  ],
  "62": [
    { company: "Infosys", why: "Carbon neutral since 2020. Pioneering BRSR adopter, externally assured, Scope 3 and water reporting.", url: "https://www.infosys.com/about/esg.html", sector: "IT Services" },
    { company: "Wipro", why: "Detailed energy per employee, e-waste management, DEI metrics and human rights due diligence.", url: "https://www.wipro.com/investors/annual-reports/", sector: "IT Services" },
    { company: "TCS", why: "Zero-waste-to-landfill campuses, biodiversity metrics and SBTi aligned targets.", url: "https://www.tcs.com/who-we-are/sustainability", sector: "IT Services" },
  ],
  "64": [
    { company: "HDFC Bank", why: "Parivartan program impact data, digital inclusion, green lending portfolio disclosure.", url: "https://www.hdfcbank.com/personal/about-us/investor-relations/annual-reports", sector: "Banking" },
    { company: "ICICI Bank", why: "Green bond framework, financed emissions methodology pilot and financial inclusion metrics.", url: "https://www.icicibank.com/about-us/investor-relations", sector: "Banking" },
    { company: "SBI", why: "Largest bank ESG disclosures including green finance portfolio, social banking and rural outreach.", url: "https://sbi.co.in/web/investor-relations/annual-report", sector: "Banking" },
  ],
  "65": [
    { company: "SBI Life Insurance", why: "Governance disclosures, digital penetration and policyholder grievance resolution data.", url: "https://www.sbilife.co.in/en/investor-relations/annual-reports", sector: "Insurance" },
    { company: "HDFC Life", why: "Claims settlement data, agent training, customer data privacy and community health programs.", url: "https://www.hdfclife.com/about-us/investor-relations", sector: "Insurance" },
    { company: "ICICI Lombard", why: "Detailed climate risk underwriting, motor telematics sustainability and digital claims data.", url: "https://www.icicilombard.com/investor-relations", sector: "General Insurance" },
  ],
  "86": [
    { company: "Apollo Hospitals", why: "Biomedical waste management, patient safety metrics and community health programs.", url: "https://www.apollohospitals.com/investors/annual-reports/", sector: "Healthcare" },
    { company: "Fortis Healthcare", why: "Detailed clinical outcome metrics, infection control rates and medical waste management.", url: "https://www.fortishealthcare.com/investor-relations", sector: "Hospitals" },
    { company: "Max Healthcare", why: "Per-bed energy/water intensity, biomedical waste and patient satisfaction disclosures.", url: "https://www.maxhealthcare.in/investor-relations", sector: "Hospitals" },
  ],
};

// ─── DIVISION-LEVEL GLOBAL PEERS (by GICS industry code prefix) ───
const GICS_DIV_PEERS = {
  "101020": { sector: "Oil, Gas & Consumable Fuels", peers: [
    { company: "Equinor (Norway)", why: "Industry-leading climate risk scenario analysis, CCS technology, methane intensity targets.", url: "https://www.equinor.com/sustainability", framework: "GRI + TCFD + ISSB" },
    { company: "TotalEnergies (France)", why: "Multi-energy transition roadmap, Scope 3 across value chain, TCFD fully aligned.", url: "https://totalenergies.com/sustainability/reports-and-indicators", framework: "GRI + SASB + TCFD" },
    { company: "ConocoPhillips (USA)", why: "Methane intensity targets, Paris-aligned climate risk scenarios and Scope 3 reporting.", url: "https://www.conocophillips.com/sustainability/", framework: "GRI + SASB + TCFD" },
  ]},
  "151010": { sector: "Chemicals", peers: [
    { company: "BASF (Germany)", why: "Pioneering Scope 3 accounting, circular economy metrics and biodiversity commitment.", url: "https://www.basf.com/global/en/who-we-are/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Dow Inc. (USA)", why: "Circular plastics, carbon-neutral roadmap by 2050 and detailed product carbon footprints.", url: "https://corporate.dow.com/en-us/esg.html", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Solvay (Belgium)", why: "Sustainable solutions revenue %, green chemistry innovation and detailed Scope 1-3.", url: "https://www.solvay.com/en/sustainability", framework: "GRI + TCFD + EU Taxonomy" },
  ]},
  "151020": { sector: "Construction Materials", peers: [
    { company: "Holcim (Switzerland)", why: "Green concrete pioneer, circular construction and Scope 1 reduction with SBTi 1.5°C.", url: "https://www.holcim.com/sustainability", framework: "GRI + TCFD + SBTi" },
    { company: "HeidelbergCement (Germany)", why: "CCS at cement plant, alternative fuels and detailed clinker factor reduction roadmap.", url: "https://www.heidelbergmaterials.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "CRH plc (Ireland)", why: "Detailed recycled aggregates %, embodied carbon per product line and circularity data.", url: "https://www.crh.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "151040": { sector: "Metals & Mining", peers: [
    { company: "BHP Group (Australia)", why: "Tailings safety, Indigenous partnerships, mine closure provisioning and water stewardship.", url: "https://www.bhp.com/sustainability", framework: "GRI + SASB + TCFD + ICMM" },
    { company: "Rio Tinto (UK/Australia)", why: "Decarbonization of aluminium, biodiversity offsets and community consent processes.", url: "https://www.riotinto.com/sustainability", framework: "GRI + SASB + TCFD + ICMM" },
    { company: "ArcelorMittal (Luxembourg)", why: "Green steel via hydrogen DRI, XCarb® innovation and detailed CO2 intensity per tonne.", url: "https://corporate.arcelormittal.com/sustainability", framework: "GRI + TCFD + SBTi" },
  ]},
  "251020": { sector: "Automobiles & Components", peers: [
    { company: "Volvo Group (Sweden)", why: "Electric truck transition, fossil-free steel procurement and lifecycle emissions data.", url: "https://www.volvogroup.com/en/investors.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "BMW Group (Germany)", why: "Circular design, recycled content targets and per-vehicle lifecycle carbon footprint.", url: "https://www.bmwgroup.com/en/sustainability.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "General Motors (USA)", why: "EV transition roadmap, Scope 1-3 with battery minerals traceability and factory zero-waste.", url: "https://investor.gm.com/esg", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "302020": { sector: "Food Products", peers: [
    { company: "Nestlé (Switzerland)", why: "Deforestation monitoring, regenerative agriculture metrics, packaging recyclability targets.", url: "https://www.nestle.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Danone (France)", why: "B Corp-certified entities, water stewardship, smallholder farmer support.", url: "https://www.danone.com/impact/sustainability-goals.html", framework: "GRI + TCFD + B Corp" },
    { company: "Unilever (UK)", why: "Pioneer ESG reporter. Deforestation-free supply chain, living wage and plastics circularity.", url: "https://www.unilever.com/sustainability/", framework: "GRI + SASB + TCFD + TNFD" },
  ]},
  "352020": { sector: "Pharmaceuticals", peers: [
    { company: "Novo Nordisk (Denmark)", why: "Zero environmental impact ambition, circular zero waste, access-to-medicine across LMICs.", url: "https://www.novonordisk.com/sustainable-business.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "AstraZeneca (UK)", why: "Ambition Zero Carbon, Scope 3 supply chain, health equity and access programs globally.", url: "https://www.astrazeneca.com/sustainability.html", framework: "GRI + TCFD + SBTi" },
    { company: "Roche (Switzerland)", why: "Clinical trial diversity, patient access programs and pharmaceutical waste data.", url: "https://www.roche.com/sustainability", framework: "GRI + SASB + TCFD" },
  ]},
  "351020": { sector: "Health Care Providers & Services", peers: [
    { company: "UnitedHealth Group (USA)", why: "Health equity metrics, social determinants of health programs and community investment.", url: "https://www.unitedhealthgroup.com/who-we-are/annual-reports.html", framework: "GRI + SASB + TCFD" },
    { company: "Fresenius Medical Care (Germany)", why: "Per-treatment energy/water, patient outcomes and medical waste management.", url: "https://www.freseniusmedicalcare.com/en/investors/reports-and-publications", framework: "GRI + TCFD + CSRD" },
    { company: "HCA Healthcare (USA)", why: "Detailed clinical quality, nurse staffing ratios and community benefit disclosures.", url: "https://hcahealthcare.com/about/sustainability.dot", framework: "GRI + SASB" },
  ]},
  "401010": { sector: "Banks", peers: [
    { company: "ING Group (Netherlands)", why: "Pioneer in financed emissions (PCAF), Terra approach to portfolio alignment.", url: "https://www.ing.com/Sustainability.htm", framework: "GRI + TCFD + PCAF + CSRD" },
    { company: "DBS Bank (Singapore)", why: "Asia's best ESG bank. Transition finance taxonomy and financial inclusion data.", url: "https://www.dbs.com/sustainability/", framework: "GRI + SASB + TCFD" },
    { company: "Bank of America (USA)", why: "Financed emissions, $1.5T sustainable finance target and ESG lending integration.", url: "https://about.bankofamerica.com/en/making-an-impact", framework: "GRI + SASB + TCFD + PCAF" },
  ]},
  "402010": { sector: "Insurance", peers: [
    { company: "Allianz (Germany)", why: "ESG integration in underwriting, climate risk stress testing and net-zero insurance.", url: "https://www.allianz.com/en/investor_relations/", framework: "GRI + SASB + TCFD + NZIA" },
    { company: "AXA (France)", why: "Climate-aligned investment portfolio, coal divestment timeline and natural disaster data.", url: "https://www.axa.com/en/investor/annual-reports", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Swiss Re (Switzerland)", why: "Nat-cat risk modeling, ESG in reinsurance pricing and responsible investment portfolio.", url: "https://www.swissre.com/sustainability/", framework: "GRI + TCFD + NZIA" },
  ]},
  "451030": { sector: "Software", peers: [
    { company: "Microsoft (USA)", why: "Carbon negative by 2030, water positive, zero waste and responsible AI disclosures.", url: "https://www.microsoft.com/en-us/sustainability", framework: "GRI + SASB + TCFD + CDP" },
    { company: "SAP (Germany)", why: "Cloud energy efficiency, DEI metrics, green cloud data and supply chain sustainability.", url: "https://www.sap.com/about/company/sustainability-csr.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Salesforce (USA)", why: "Net-zero across value chain, stakeholder capitalism metrics and equality data.", url: "https://www.salesforce.com/company/sustainability/", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "451020": { sector: "IT Services", peers: [
    { company: "Accenture (Ireland)", why: "Per-employee carbon, 100% renewable energy and comprehensive DEI data.", url: "https://www.accenture.com/us-en/about/sustainability/sustainability-value-promise", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Cognizant (USA)", why: "Detailed cloud vs on-prem carbon comparison, skilling impact and ESG in client delivery.", url: "https://www.cognizant.com/us/en/about-cognizant/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Capgemini (France)", why: "Green IT services revenue %, per-FTE emissions and sustainable IT advisory metrics.", url: "https://www.capgemini.com/about-us/csr/", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "501020": { sector: "Telecommunications", peers: [
    { company: "Deutsche Telekom (Germany)", why: "Network energy efficiency, digital inclusion and human rights reporting.", url: "https://www.telekom.com/en/sustainability", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Vodafone Group (UK)", why: "Tower energy, SIM recycling, connectivity for underserved and digital parenting tools.", url: "https://www.vodafone.com/sustainable-business", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Telefónica (Spain)", why: "Eco-rating for devices, network lifecycle, circular economy and digital inclusion.", url: "https://www.telefonica.com/en/sustainability-innovation/", framework: "GRI + SASB + TCFD + CSRD" },
  ]},
  "551010": { sector: "Electric Utilities", peers: [
    { company: "Ørsted (Denmark)", why: "Fossil fuel to offshore wind transformation. Best-in-class energy transition case.", url: "https://orsted.com/en/sustainability", framework: "GRI + TCFD + SBTi + EU Taxonomy" },
    { company: "Iberdrola (Spain)", why: "RE expansion, green hydrogen, biodiversity net gain and community benefit sharing.", url: "https://www.iberdrola.com/sustainability", framework: "GRI + SASB + TCFD + EU Taxonomy" },
    { company: "NextEra Energy (USA)", why: "Largest wind/solar generator in North America. Emissions avoidance and wildlife data.", url: "https://www.nexteraenergy.com/sustainability.html", framework: "GRI + SASB + TCFD" },
  ]},
  "253010": { sector: "Hotels, Restaurants & Leisure", peers: [
    { company: "Accor (France)", why: "Per-room energy/water intensity across 5,500 hotels, food waste and DEI.", url: "https://group.accor.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Hilton (USA)", why: "LightStay per-property tracking, soap recycling and modern slavery disclosures.", url: "https://esg.hilton.com/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Marriott International (USA)", why: "Serve 360 platform. Per-room intensity, food waste and human trafficking prevention.", url: "https://www.marriott.com/about/serve-360.mi", framework: "GRI + SASB + TCFD" },
  ]},
  "203020": { sector: "Airlines", peers: [
    { company: "IAG (UK/Spain)", why: "SAF procurement roadmap, fleet renewal carbon impact and per-RPK emissions.", url: "https://www.iairgroup.com/sustainability-overview", framework: "GRI + TCFD + SBTi + CORSIA" },
    { company: "Delta Air Lines (USA)", why: "Fleet efficiency, SAF investment and detailed per-ASM carbon and waste data.", url: "https://www.delta.com/us/en/about-delta/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Air France-KLM (France)", why: "SAF blending targets, fleet renewal, rail substitution and noise reduction data.", url: "https://www.airfranceklm.com/en/group/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
};

// ─── NACE DIVISION-LEVEL PEERS (by NACE division code) ───
const NACE_DIV_PEERS = {
  "10": { sector: "Manufacture of Food Products (NACE 10)", peers: [
    { company: "Nestlé (Switzerland)", why: "Global food leader. Deforestation monitoring, regenerative agriculture, packaging recyclability targets.", url: "https://www.nestle.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "Danone (France)", why: "B Corp-certified entities, water stewardship, smallholder farmer support and One Planet One Health.", url: "https://www.danone.com/impact/sustainability-goals.html", framework: "GRI + TCFD + B Corp + CSRD" },
    { company: "Kerry Group (Ireland)", why: "Food ingredients with regenerative agriculture, Scope 3 farm-level emissions and biodiversity net gain.", url: "https://www.kerrygroup.com/investors", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "11": { sector: "Manufacture of Beverages (NACE 11)", peers: [
    { company: "Diageo (UK)", why: "Water stewardship across distilleries, grain-to-glass carbon tracking and responsible drinking programs.", url: "https://www.diageo.com/en/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Heineken (Netherlands)", why: "Brew a Better World program. Per-hectoliter water/energy, circular packaging and farmer livelihood data.", url: "https://www.theheinekencompany.com/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Pernod Ricard (France)", why: "Terroir preservation, water circularity at distilleries and detailed agricultural carbon footprint.", url: "https://www.pernod-ricard.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "19": { sector: "Manufacture of Coke & Petroleum Products (NACE 19)", peers: [
    { company: "TotalEnergies (France)", why: "Multi-energy transition roadmap, Scope 3 across value chain, refinery emissions intensity targets.", url: "https://totalenergies.com/sustainability/reports-and-indicators", framework: "GRI + SASB + TCFD" },
    { company: "Neste (Finland)", why: "World's largest renewable diesel producer. Waste-to-fuel lifecycle and avoided emissions methodology.", url: "https://www.neste.com/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "OMV (Austria)", why: "Refinery efficiency, green hydrogen pilot and detailed circular chemical feedstock disclosures.", url: "https://www.omv.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "20": { sector: "Manufacture of Chemicals (NACE 20)", peers: [
    { company: "BASF (Germany)", why: "Pioneering Scope 3 upstream/downstream carbon accounting, circular economy and biodiversity commitment.", url: "https://www.basf.com/global/en/who-we-are/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Solvay (Belgium)", why: "Sustainable solutions revenue %, green chemistry innovation and detailed Scope 1-3 per business unit.", url: "https://www.solvay.com/en/sustainability", framework: "GRI + TCFD + EU Taxonomy + CSRD" },
    { company: "Evonik (Germany)", why: "Specialty chemicals with next-gen solutions revenue tracking and detailed product carbon footprints.", url: "https://corporate.evonik.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "21": { sector: "Manufacture of Pharmaceuticals (NACE 21)", peers: [
    { company: "Novo Nordisk (Denmark)", why: "Zero environmental impact ambition, circular zero waste, access-to-medicine across LMICs.", url: "https://www.novonordisk.com/sustainable-business.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Roche (Switzerland)", why: "Clinical trial diversity, patient access programs, pharmaceutical waste and water intensity data.", url: "https://www.roche.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "AstraZeneca (UK)", why: "Ambition Zero Carbon, Scope 3 supply chain, health equity and access programs globally.", url: "https://www.astrazeneca.com/sustainability.html", framework: "GRI + TCFD + SBTi" },
  ]},
  "23": { sector: "Non-metallic Mineral Products / Cement (NACE 23)", peers: [
    { company: "Holcim (Switzerland)", why: "Green concrete pioneer, circular construction and Scope 1 reduction with SBTi 1.5°C target.", url: "https://www.holcim.com/sustainability", framework: "GRI + TCFD + SBTi + EU Taxonomy" },
    { company: "HeidelbergMaterials (Germany)", why: "CCS at cement plant, alternative fuels and detailed clinker factor reduction roadmap.", url: "https://www.heidelbergmaterials.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "CRH plc (Ireland)", why: "Recycled aggregates %, embodied carbon per product line and circularity metrics.", url: "https://www.crh.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "24": { sector: "Manufacture of Basic Metals (NACE 24)", peers: [
    { company: "ArcelorMittal (Luxembourg)", why: "Green steel via hydrogen DRI, XCarb® innovation and detailed CO2 intensity per tonne.", url: "https://corporate.arcelormittal.com/sustainability", framework: "GRI + TCFD + SBTi" },
    { company: "SSAB (Sweden)", why: "HYBRIT fossil-free steel project, world's first fossil-free steel delivery and detailed transition plan.", url: "https://www.ssab.com/en/company/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Outokumpu (Finland)", why: "Stainless steel with highest recycled content (>90%), detailed per-tonne emissions and water data.", url: "https://www.outokumpu.com/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "26": { sector: "Manufacture of Computer & Electronic Products (NACE 26)", peers: [
    { company: "Philips (Netherlands)", why: "Circular economy revenue (25%+ target), product lifecycle extension and conflict minerals due diligence.", url: "https://www.philips.com/a-w/about/sustainability.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Nokia (Finland)", why: "5G energy efficiency, circular device programs, conflict minerals and digital bridge metrics.", url: "https://www.nokia.com/about-us/investors/", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Ericsson (Sweden)", why: "Network energy efficiency per data unit, e-waste, responsible minerals and connectivity gap metrics.", url: "https://www.ericsson.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "29": { sector: "Manufacture of Motor Vehicles (NACE 29)", peers: [
    { company: "Volvo Group (Sweden)", why: "Electric truck transition, fossil-free steel procurement and detailed lifecycle emissions.", url: "https://www.volvogroup.com/en/investors.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "BMW Group (Germany)", why: "Circular design, recycled content targets and per-vehicle lifecycle carbon footprint.", url: "https://www.bmwgroup.com/en/sustainability.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Stellantis (Netherlands)", why: "EV transition, battery lifecycle, detailed Scope 3 and responsible sourcing of battery minerals.", url: "https://www.stellantis.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "05": { sector: "Mining of Coal & Lignite (NACE 05)", peers: [
    { company: "BHP (Australia/UK)", why: "Thermal coal exit strategy, mine closure provisioning, just transition and community investment.", url: "https://www.bhp.com/sustainability", framework: "GRI + SASB + TCFD + ICMM" },
    { company: "Enel (Italy)", why: "Complete coal exit by 2027, detailed decommissioning timeline and worker transition programs.", url: "https://www.enel.com/investors/sustainability", framework: "GRI + SASB + TCFD + EU Taxonomy" },
    { company: "RWE (Germany)", why: "Lignite phase-out roadmap, village resettlement disclosures and RE replacement capacity data.", url: "https://www.rwe.com/en/sustainability/", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "06": { sector: "Extraction of Crude Petroleum & Gas (NACE 06)", peers: [
    { company: "Equinor (Norway)", why: "Climate risk scenario analysis, CCS technology, methane intensity and just transition plans.", url: "https://www.equinor.com/sustainability", framework: "GRI + TCFD + ISSB" },
    { company: "TotalEnergies (France)", why: "Multi-energy transition, Scope 3 across value chain, LNG lifecycle carbon intensity.", url: "https://totalenergies.com/sustainability/reports-and-indicators", framework: "GRI + SASB + TCFD" },
    { company: "Eni (Italy)", why: "Net-zero by 2050, detailed upstream emissions, biorefinery conversion and HVO production.", url: "https://www.eni.com/en-IT/sustainability.html", framework: "GRI + SASB + TCFD + CSRD" },
  ]},
  "62": { sector: "Computer Programming & Consultancy (NACE 62)", peers: [
    { company: "SAP (Germany)", why: "Cloud energy efficiency, DEI metrics, green cloud data and supply chain sustainability integration.", url: "https://www.sap.com/about/company/sustainability-csr.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Capgemini (France)", why: "Green IT services revenue %, per-FTE emissions and sustainable IT advisory metrics.", url: "https://www.capgemini.com/about-us/csr/", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Atos (France)", why: "Net-zero 2028 target, decarbonization services portfolio and digital workplace carbon metrics.", url: "https://atos.net/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "64": { sector: "Financial Services excl. Insurance (NACE 64)", peers: [
    { company: "ING Group (Netherlands)", why: "Pioneer in financed emissions (PCAF), Terra approach to portfolio alignment.", url: "https://www.ing.com/Sustainability.htm", framework: "GRI + TCFD + PCAF + CSRD" },
    { company: "BNP Paribas (France)", why: "Coal exit timeline, financed emissions per sector, green bond issuance and biodiversity pledge.", url: "https://group.bnpparibas/en/sustainable-development", framework: "GRI + TCFD + PCAF + NZBA + CSRD" },
    { company: "Nordea (Finland)", why: "Comprehensive green bond portfolio, financed emissions and financial inclusion metrics.", url: "https://www.nordea.com/en/investors", framework: "GRI + TCFD + PCAF + NZBA + CSRD" },
  ]},
  "65": { sector: "Insurance, Reinsurance & Pension (NACE 65)", peers: [
    { company: "Allianz (Germany)", why: "ESG integration in underwriting, climate risk stress testing and net-zero insurance commitments.", url: "https://www.allianz.com/en/investor_relations/", framework: "GRI + SASB + TCFD + NZIA + CSRD" },
    { company: "AXA (France)", why: "Climate-aligned investment portfolio, coal divestment timeline and natural disaster modelling data.", url: "https://www.axa.com/en/investor/annual-reports", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Zurich Insurance (Switzerland)", why: "Net-zero roadmap for investments, climate risk underwriting and community resilience programs.", url: "https://www.zurich.com/en/sustainability", framework: "GRI + TCFD + NZIA + SBTi" },
  ]},
  "86": { sector: "Human Health Activities (NACE 86)", peers: [
    { company: "Novo Nordisk (Denmark)", why: "Zero environmental impact, access-to-medicine in 80+ LMICs, clinical trial diversity.", url: "https://www.novonordisk.com/sustainable-business.html", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Fresenius Medical Care (Germany)", why: "Per-treatment energy/water, patient outcomes and detailed medical waste management.", url: "https://www.freseniusmedicalcare.com/en/investors/reports-and-publications", framework: "GRI + TCFD + CSRD" },
    { company: "Orpea / Emeis (France)", why: "Elderly care with per-resident resource intensity, staff-to-patient ratios and wellbeing metrics.", url: "https://www.emeis.com/en/investors", framework: "GRI + TCFD + CSRD" },
  ]},
  "49": { sector: "Land Transport & Pipelines (NACE 49)", peers: [
    { company: "Deutsche Bahn (Germany)", why: "Rail electrification, per-passenger-km emissions, green electricity procurement and modal shift data.", url: "https://www.deutschebahn.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Deutsche Post DHL (Germany)", why: "Mission 2050 zero emissions. Electric delivery fleet and detailed last-mile efficiency.", url: "https://www.dhl.com/global-en/home/about-us/sustainability.html", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "DSV (Denmark)", why: "Freight forwarding with per-shipment carbon, modal optimization and sustainable aviation fuel data.", url: "https://www.dsv.com/en/sustainability", framework: "GRI + TCFD + SBTi + CSRD" },
  ]},
  "55": { sector: "Accommodation (NACE 55)", peers: [
    { company: "Accor (France)", why: "Per-room energy/water intensity across 5,500 hotels, food waste and DEI disclosures.", url: "https://group.accor.com/en/investors", framework: "GRI + TCFD + SBTi + CSRD" },
    { company: "Whitbread / Premier Inn (UK)", why: "Net-zero Force for Good plan, per-room carbon, food waste and community investment.", url: "https://www.whitbread.co.uk/sustainability/", framework: "GRI + TCFD + SBTi" },
    { company: "NH Hotel Group / Minor (Spain)", why: "Green key certified properties, per-room carbon footprint and local employment data.", url: "https://www.nhhotelgroup.com/en/investors", framework: "GRI + TCFD + EU Taxonomy" },
  ]},
  "61": { sector: "Telecommunications (NACE 61)", peers: [
    { company: "Deutsche Telekom (Germany)", why: "Network energy efficiency, e-waste take-back, digital inclusion and human rights reporting.", url: "https://www.telekom.com/en/sustainability", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "Telefónica (Spain)", why: "Eco-rating for devices, network lifecycle, circular economy and digital inclusion.", url: "https://www.telefonica.com/en/sustainability-innovation/", framework: "GRI + SASB + TCFD + CSRD" },
    { company: "KPN (Netherlands)", why: "Circular network equipment, Scope 3 supply chain and social connectivity impact.", url: "https://www.kpn.com/corporate/sustainability", framework: "GRI + TCFD + EU Taxonomy + CSRD" },
  ]},
};

// ─── NAICS DIVISION-LEVEL PEERS (by NAICS code) ───
const NAICS_DIV_PEERS = {
  "311": { sector: "Food Manufacturing (NAICS 311)", peers: [
    { company: "Nestlé USA", why: "Regenerative agriculture, deforestation-free sourcing, packaging recyclability and nutrition access.", url: "https://www.nestle.com/sustainability", framework: "GRI + SASB + TCFD" },
    { company: "General Mills (USA)", why: "Regenerative agriculture on 1M acres, detailed Scope 3 farm emissions and packaging circularity.", url: "https://www.generalmills.com/how-we-make-it/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Tyson Foods (USA)", why: "Protein industry GHG targets, water stewardship, animal welfare and worker safety metrics.", url: "https://www.tysonfoods.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "3121": { sector: "Beverage Manufacturing (NAICS 3121)", peers: [
    { company: "Coca-Cola Company (USA)", why: "World Without Waste program, water replenishment, per-liter carbon and packaging collection rates.", url: "https://www.coca-colacompany.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "PepsiCo (USA)", why: "pep+ strategy. Regenerative farming, positive water impact, per-serving emissions and DEI data.", url: "https://www.pepsico.com/our-impact/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Constellation Brands (USA)", why: "Water stewardship in drought regions, solar-powered breweries and agriculture sustainability.", url: "https://www.cbrands.com/responsibility", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "324": { sector: "Petroleum & Coal Products (NAICS 324)", peers: [
    { company: "Valero Energy (USA)", why: "Largest US renewable diesel producer, refinery emissions intensity and ethanol lifecycle data.", url: "https://www.valero.com/responsibility", framework: "GRI + SASB + TCFD" },
    { company: "Phillips 66 (USA)", why: "Emerging energy portfolio, refinery efficiency and detailed renewable fuels transition data.", url: "https://www.phillips66.com/sustainability/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Marathon Petroleum (USA)", why: "Refinery-level emissions, renewable diesel expansion and community impact near facilities.", url: "https://www.marathonpetroleum.com/Sustainability/", framework: "GRI + SASB + TCFD" },
  ]},
  "325": { sector: "Chemical Manufacturing (NAICS 325)", peers: [
    { company: "Dow Inc. (USA)", why: "Circular plastics, carbon-neutral roadmap by 2050 and detailed product carbon footprints.", url: "https://corporate.dow.com/en-us/esg.html", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "DuPont (USA)", why: "Innovation platform sustainability scoring, water stewardship and responsible chemistry.", url: "https://www.dupont.com/sustainability.html", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Eastman Chemical (USA)", why: "Molecular recycling, circular economy revenue tracking and detailed Scope 1-3 per segment.", url: "https://www.eastman.com/en/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "3254": { sector: "Pharmaceutical Manufacturing (NAICS 3254)", peers: [
    { company: "Johnson & Johnson (USA)", why: "Product lifecycle, access-to-medicine in LMICs, DEI in clinical trials and green chemistry.", url: "https://www.jnj.com/esg", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Pfizer (USA)", why: "Global access-to-medicine, clinical trial diversity, pharmaceutical waste and green chemistry.", url: "https://www.pfizer.com/about/responsibility/esg-report", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Merck & Co. (USA)", why: "Access-to-medicine index leader, antibiotic stewardship, detailed API waste and water intensity.", url: "https://www.merck.com/company-overview/esg/", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "327": { sector: "Nonmetallic Mineral Products / Cement (NAICS 327)", peers: [
    { company: "Martin Marietta (USA)", why: "Aggregates with land reclamation, per-ton emissions, water recycling and habitat restoration.", url: "https://www.martinmarietta.com/sustainability/", framework: "GRI + SASB + TCFD" },
    { company: "Vulcan Materials (USA)", why: "Largest US aggregates producer. Detailed quarry biodiversity, dust and water management.", url: "https://www.vulcanmaterials.com/sustainability", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Eagle Materials (USA)", why: "Cement/wallboard with alternative fuels, clinker factor and per-ton energy/emission data.", url: "https://www.eaglematerials.com/sustainability/", framework: "SASB + TCFD" },
  ]},
  "331": { sector: "Primary Metal Manufacturing (NAICS 331)", peers: [
    { company: "Nucor Corporation (USA)", why: "EAF steelmaker with highest recycled content, per-ton CO2, and renewable energy procurement.", url: "https://www.nucor.com/sustainability/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Steel Dynamics (USA)", why: "EAF-based with detailed scrap-to-steel circular metrics and per-ton energy intensity.", url: "https://stld.steeldynamics.com/sustainability/", framework: "GRI + SASB + TCFD" },
    { company: "Alcoa (USA)", why: "ELYSIS zero-carbon aluminium smelting, detailed per-tonne emissions and bauxite residue management.", url: "https://www.alcoa.com/sustainability/en/", framework: "GRI + SASB + TCFD + SBTi" },
  ]},
  "334": { sector: "Computer & Electronic Manufacturing (NAICS 334)", peers: [
    { company: "Apple (USA)", why: "Carbon-neutral products, supplier clean energy, conflict minerals and detailed product lifecycle data.", url: "https://www.apple.com/environment/", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Intel (USA)", why: "RISE 2030 goals, per-chip water/energy, chemical safety and DEI in semiconductor workforce.", url: "https://www.intel.com/content/www/us/en/corporate-responsibility/corporate-responsibility.html", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Texas Instruments (USA)", why: "Semiconductor water reuse, fab energy efficiency and detailed hazardous waste management.", url: "https://www.ti.com/about-ti/citizenship-community/sustainability.html", framework: "GRI + SASB + TCFD" },
  ]},
  "5415": { sector: "Computer Systems Design / IT Services (NAICS 5415)", peers: [
    { company: "Microsoft (USA)", why: "Carbon negative by 2030, water positive, zero waste and responsible AI disclosures.", url: "https://www.microsoft.com/en-us/sustainability", framework: "GRI + SASB + TCFD + CDP" },
    { company: "Salesforce (USA)", why: "Net-zero across value chain, stakeholder capitalism metrics and equality data.", url: "https://www.salesforce.com/company/sustainability/", framework: "GRI + SASB + TCFD + SBTi" },
    { company: "Alphabet / Google (USA)", why: "24/7 carbon-free energy target, data center water efficiency and digital equity data.", url: "https://sustainability.google/reports/", framework: "GRI + SASB + TCFD + CDP" },
  ]},
  "5221": { sector: "Banking / Depository Credit (NAICS 5221)", peers: [
    { company: "Bank of America (USA)", why: "Financed emissions, $1.5T sustainable finance target and ESG lending integration.", url: "https://about.bankofamerica.com/en/making-an-impact", framework: "GRI + SASB + TCFD + PCAF" },
    { company: "JPMorgan Chase (USA)", why: "$2.5T sustainable development target, financed emissions per sector and green bond issuance.", url: "https://www.jpmorganchase.com/impact/sustainability", framework: "GRI + SASB + TCFD + PCAF + NZBA" },
    { company: "TD Bank (Canada)", why: "Climate action plan, financed emissions, Indigenous reconciliation and financial inclusion.", url: "https://www.td.com/ca/en/about-td/for-investors/annual-reports", framework: "GRI + SASB + TCFD + PCAF + NZBA" },
  ]},
  "5241": { sector: "Insurance Carriers (NAICS 5241)", peers: [
    { company: "Chubb (USA)", why: "Climate risk underwriting, coal policy, detailed nat-cat exposure and community resilience.", url: "https://www.chubb.com/us-en/about-chubb/environment-social-governance.html", framework: "GRI + SASB + TCFD" },
    { company: "Manulife (Canada)", why: "Sustainable timber investments, financed emissions and Indigenous community partnerships.", url: "https://www.manulife.com/en/about/sustainability.html", framework: "GRI + TCFD + PCAF + NZBA" },
    { company: "Prudential Financial (USA)", why: "ESG integration in $1.7T AUM, financial inclusion and community development investment.", url: "https://www.prudential.com/sustainability", framework: "GRI + SASB + TCFD" },
  ]},
  "621-622": { sector: "Health Care Services (NAICS 621-622)", peers: [
    { company: "UnitedHealth Group (USA)", why: "Health equity metrics, social determinants of health programs and community investment.", url: "https://www.unitedhealthgroup.com/who-we-are/annual-reports.html", framework: "GRI + SASB + TCFD" },
    { company: "HCA Healthcare (USA)", why: "Clinical quality, nurse staffing ratios, biomedical waste and community benefit disclosures.", url: "https://hcahealthcare.com/about/sustainability.dot", framework: "GRI + SASB" },
    { company: "CVS Health (USA)", why: "Health equity, prescription drug access, opioid stewardship and community health data.", url: "https://www.cvshealth.com/esg.html", framework: "GRI + SASB + TCFD" },
  ]},
};

// Helper to find global peers — supports division-level for all three systems
function findGlobalPeers(nicSection, system, selectedDiv) {
  if (!nicSection) return [];

  if (system === "gics") {
    if (selectedDiv && selectedDiv.gics) {
      const divGicsCode = selectedDiv.gics.match(/\d+/)?.[0];
      if (divGicsCode && GICS_DIV_PEERS[divGicsCode]) {
        return [{ sectorName: `GICS ${divGicsCode} — ${GICS_DIV_PEERS[divGicsCode].sector}`, peers: GICS_DIV_PEERS[divGicsCode].peers }];
      }
    }
    const gicsStr = nicSection.gics;
    const codes = gicsStr.match(/\d+/g) || [];
    let allPeers = [];
    codes.forEach(code => {
      if (GLOBAL_ESG_PEERS[code]) {
        allPeers.push({ sectorName: `GICS ${code} — ${GLOBAL_ESG_PEERS[code].sector}`, peers: GLOBAL_ESG_PEERS[code].peers });
      }
    });
    return allPeers;
  }
  if (system === "naics") {
    if (selectedDiv && selectedDiv.naics) {
      const divNaics = selectedDiv.naics;
      // Try exact match first, then prefix
      if (NAICS_DIV_PEERS[divNaics]) return [{ sectorName: NAICS_DIV_PEERS[divNaics].sector, peers: NAICS_DIV_PEERS[divNaics].peers }];
      const prefix = divNaics.split("-")[0];
      if (NAICS_DIV_PEERS[prefix]) return [{ sectorName: NAICS_DIV_PEERS[prefix].sector, peers: NAICS_DIV_PEERS[prefix].peers }];
    }
    const naicsCode = nicSection.naics;
    if (NAICS_ESG_PEERS[naicsCode]) return [{ sectorName: NAICS_ESG_PEERS[naicsCode].sector, peers: NAICS_ESG_PEERS[naicsCode].peers }];
    return [];
  }
  if (system === "nace") {
    if (selectedDiv && selectedDiv.nace) {
      // Try division-level NACE peers first
      if (NACE_DIV_PEERS[selectedDiv.nace]) return [{ sectorName: NACE_DIV_PEERS[selectedDiv.nace].sector, peers: NACE_DIV_PEERS[selectedDiv.nace].peers }];
      // Fall back to section-level
      const parentNace = nicSection.nace;
      if (NACE_ESG_PEERS[parentNace]) return [{ sectorName: NACE_ESG_PEERS[parentNace].sector, peers: NACE_ESG_PEERS[parentNace].peers }];
    }
    const naceCode = nicSection.nace;
    if (NACE_ESG_PEERS[naceCode]) return [{ sectorName: NACE_ESG_PEERS[naceCode].sector, peers: NACE_ESG_PEERS[naceCode].peers }];
    return [];
  }
  return [];
}

// ─── COMPLETE SRMM v2.0 SCORING FRAMEWORK ───
const SRMM_DATA = {
  sectionA: {
    title: "Section A: General Disclosures",
    maxEssential: 18, maxLeadership: 0, maxTotal: 18,
    items: [
      { id: "A18", ref: "18", label: "Differently abled employees (>5%=3, 5-2%=2, <2%=1, None=0)", max: 3, type: "essential",
        options: [{ v: 3, l: ">5% of total" }, { v: 2, l: "2-5%" }, { v: 1, l: "<2%" }, { v: 0, l: "Not engaging" }] },
      { id: "A18b", ref: "18", label: "Differently abled workmen (>5%=3, 5-2%=2, <2%=1, None=0)", max: 3, type: "essential",
        options: [{ v: 3, l: ">5% of total" }, { v: 2, l: "2-5%" }, { v: 1, l: "<2%" }, { v: 0, l: "Not engaging" }] },
      { id: "A19", ref: "19", label: "Women employees (>25%=2, 10-25%=1, <10%=0)", max: 2, type: "essential",
        options: [{ v: 2, l: ">25%" }, { v: 1, l: "10-25%" }, { v: 0, l: "<10%" }] },
      { id: "A20", ref: "20", label: "Turnover rate permanent employees/workers (avg 3 yrs)", max: 2, type: "essential",
        options: [{ v: 2, l: "<10%" }, { v: 1, l: "10-15%" }, { v: 0, l: ">15%" }] },
      { id: "A21a", ref: "21a", label: "Subsidiary participation in BR initiatives", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "A23", ref: "23", label: "Stakeholder grievance/redressal mechanism + resolution rate", max: 4, type: "essential",
        options: [{ v: 4, l: "Mechanism + >80% resolved" }, { v: 3, l: "Mechanism + 60-80% resolved" }, { v: 2, l: "Mechanism + <60% resolved" }, { v: 1, l: "Mechanism only" }, { v: 0, l: "Not Reported" }] },
      { id: "A24", ref: "24", label: "ESG risk assessment", max: 3, type: "essential",
        options: [{ v: 3, l: "Full assessment + addressed + financial implications" }, { v: 2, l: "Assessment done, not addressed" }, { v: 1, l: "Partial assessment" }, { v: 0, l: "Not Reported" }] },
    ]
  },
  sectionB: {
    title: "Section B: Management & Process Disclosures",
    maxEssential: 24, maxLeadership: 0, maxTotal: 24,
    items: [
      { id: "B1a", ref: "1a", label: "Company policy covering NGRBC principles", max: 3, type: "essential",
        options: [{ v: 3, l: "All principles" }, { v: 2, l: ">5 principles" }, { v: 1, l: ">3 principles" }, { v: 0, l: "Not Reported" }] },
      { id: "B2", ref: "2", label: "Policy translated into procedures", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "B3", ref: "3", label: "Policies extended to value chain partners", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "B4", ref: "4", label: "National/international codes/certifications adopted & mapped", max: 3, type: "essential",
        options: [{ v: 3, l: "All principles" }, { v: 2, l: ">5 principles" }, { v: 1, l: ">3 principles" }, { v: 0, l: "Not Reported" }] },
      { id: "B5", ref: "5", label: "Commitments, goals & targets with timelines", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "B6", ref: "6", label: "Performance against commitments/goals/targets", max: 3, type: "essential",
        options: [{ v: 3, l: ">80% goals met" }, { v: 2, l: "60-80% met" }, { v: 1, l: "50-60% met" }, { v: 0, l: "<50% met" }] },
      { id: "B7", ref: "7", label: "Director's statement on ESG challenges/targets/achievements", max: 2, type: "essential",
        options: [{ v: 2, l: "Full reporting" }, { v: 1, l: "Partial reporting" }, { v: 0, l: "No reporting" }] },
      { id: "B8", ref: "8", label: "Highest authority responsible for BR policy", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "B9", ref: "9", label: "Board committee for sustainability decisions", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes, composition specified" }, { v: 0, l: "No" }] },
      { id: "B10", ref: "10", label: "Review frequency of NGRBCs", max: 3, type: "essential",
        options: [{ v: 3, l: "Half-yearly" }, { v: 2, l: "Annual" }, { v: 0, l: "No review" }] },
      { id: "B11", ref: "11", label: "Independent assessment/evaluation of policies", max: 5, type: "essential",
        options: [{ v: 5, l: "External assessment/audit" }, { v: 0, l: "No assessment" }] },
    ]
  },
  principle1: {
    title: "Principle 1: Ethics, Transparency & Accountability",
    maxEssential: 19, maxLeadership: 5, maxTotal: 24,
    items: [
      { id: "P1_1a", ref: "1.1a", label: "Training/awareness programs on principles", max: 3, type: "essential",
        options: [{ v: 3, l: "Directors + KMP + employees + others" }, { v: 2, l: "Any two categories" }, { v: 1, l: "One category" }, { v: 0, l: "None" }] },
      { id: "P1_1b", ref: "1.1b", label: "Coverage by awareness programs", max: 5, type: "essential",
        options: [{ v: 5, l: ">90%" }, { v: 4, l: "80-90%" }, { v: 3, l: "60-80%" }, { v: 2, l: "50-60%" }, { v: 0, l: "<50% or none" }] },
      { id: "P1_2a", ref: "1.2", label: "Fines/penalties/punishment details reported", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_2b", ref: "1.2", label: "Monetary penalty/fine details reported", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_2c", ref: "1.2", label: "Non-monetary cases reported", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_3", ref: "1.3", label: "Appeal/revision details for impugned penalties", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_4", ref: "1.4", label: "Anti-corruption/anti-bribery policy", max: 3, type: "essential",
        options: [{ v: 3, l: "Policy exists & reported" }, { v: 1, l: "No policy but reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_5", ref: "1.5", label: "Disciplinary action for bribery/corruption", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_6", ref: "1.6", label: "Conflict of interest complaints reported", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_7", ref: "1.7", label: "Corrective action on corruption/conflicts", max: 2, type: "essential",
        options: [{ v: 2, l: "Reported + corrective actions" }, { v: 1, l: "Reported, no actions" }, { v: 0, l: "Not Reported" }] },
      { id: "P1_L1", ref: "L1.1", label: "Awareness programs for value chain partners", max: 3, type: "leadership",
        options: [{ v: 3, l: "All partners, all principles" }, { v: 2, l: ">2 partners, >5 principles" }, { v: 1, l: "1-2 partners, >5 principles" }, { v: 0, l: "Otherwise" }] },
      { id: "P1_L2", ref: "L1.2", label: "Processes to manage Board conflict of interest", max: 2, type: "leadership",
        options: [{ v: 2, l: "Process exists & reported" }, { v: 1, l: "No process, but reported" }, { v: 0, l: "Not Reported" }] },
    ]
  },
  principle2: {
    title: "Principle 2: Sustainable & Safe Goods/Services",
    maxEssential: 15, maxLeadership: 12, maxTotal: 27,
    items: [
      { id: "P2_1", ref: "2.1", label: "% R&D/capex in env. & social impact technologies", max: 5, type: "essential",
        options: [{ v: 5, l: ">40%" }, { v: 4, l: ">30%" }, { v: 3, l: ">20%" }, { v: 2, l: "10-20%" }, { v: 1, l: "<10%" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_2a", ref: "2.2a", label: "Sustainable sourcing procedures in place", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P2_2b", ref: "2.2b", label: "% inputs sourced sustainably", max: 5, type: "essential",
        options: [{ v: 5, l: ">75%" }, { v: 4, l: "50-75%" }, { v: 3, l: "25-50%" }, { v: 2, l: "10-25%" }, { v: 1, l: "<10%" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_3", ref: "2.3", label: "Processes for product reclaim (reuse/recycle/dispose)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_4", ref: "2.4", label: "Extended Producer Responsibility (EPR) & waste collection", max: 3, type: "essential",
        options: [{ v: 3, l: "EPR + compliant plan + mitigation" }, { v: 2, l: "EPR available" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_L1", ref: "L2.1", label: "Life Cycle Assessments (LCA)", max: 3, type: "leadership",
        options: [{ v: 3, l: "External agency + public domain" }, { v: 2, l: "Any one of above" }, { v: 1, l: "Partially done" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_L2", ref: "L2.2", label: "Actions to mitigate adverse impacts from LCA", max: 3, type: "leadership",
        options: [{ v: 3, l: "100% products" }, { v: 2, l: "Products covering 75% turnover" }, { v: 1, l: ">50% turnover" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_L3", ref: "L2.3", label: "% recycled or reused input material", max: 4, type: "leadership",
        options: [{ v: 4, l: ">60%" }, { v: 3, l: ">50%" }, { v: 2, l: "25-50%" }, { v: 1, l: "<25%" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_L4", ref: "L2.4", label: "Quantities collected for reuse/recycling/disposal", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P2_L5", ref: "L2.5", label: "Reclaimed products & packaging as % of total sold", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
    ]
  },
  principle3: {
    title: "Principle 3: Employee Well-being",
    maxEssential: 40, maxLeadership: 9, maxTotal: 49,
    items: [
      { id: "P3_1a_h", ref: "3.1a", label: "Employees: Health insurance coverage", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1a_a", ref: "3.1a", label: "Employees: Accident insurance coverage", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1a_m", ref: "3.1a", label: "Employees: Maternity/Paternity benefits", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1a_d", ref: "3.1a", label: "Employees: Day care benefits", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1b_h", ref: "3.1b", label: "Workmen: Health insurance coverage", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1b_a", ref: "3.1b", label: "Workmen: Accident insurance coverage", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1b_m", ref: "3.1b", label: "Workmen: Maternity/Paternity benefits", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_1b_d", ref: "3.1b", label: "Workmen: Day care benefits", max: 2, type: "essential",
        options: [{ v: 2, l: ">75%" }, { v: 1, l: "50-75%" }, { v: 0, l: "<50%" }] },
      { id: "P3_3", ref: "3.3", label: "Premises accessible to differently abled", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_4", ref: "3.4", label: "Equal opportunity policy (Rights of PwD Act 2016)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_5", ref: "3.5", label: "Return to work & retention rates (parental leave)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_6", ref: "3.6", label: "Grievance redressal mechanism for employees/workmen", max: 2, type: "essential",
        options: [{ v: 2, l: "All employees + all workmen" }, { v: 1, l: "Partial" }, { v: 0, l: "No mechanism" }] },
      { id: "P3_8a_hs", ref: "3.8a", label: "% employees/workmen trained: Health & safety", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_8a_sk", ref: "3.8a", label: "% employees/workmen trained: Skill upgradation", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_9a_e", ref: "3.9a", label: "Performance reviews: Employees", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_9a_w", ref: "3.9a", label: "Performance reviews: Workmen", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_10a", ref: "3.10a", label: "OHS management system implementation & coverage", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_10b", ref: "3.10b", label: "Processes to identify work-related hazards", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_10c", ref: "3.10c", label: "Process for workers to report hazards", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_10d", ref: "3.10d", label: "Non-occupational healthcare access", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_11", ref: "3.11", label: "Safety incidents (fatalities/injuries/ill-health)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_12", ref: "3.12", label: "Measures for safe & healthy workplace", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_13", ref: "3.13", label: "% complaints resolved (working conditions/H&S)", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_14", ref: "3.14", label: "% plants/offices assessed for H&S", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P3_15", ref: "3.15", label: "Corrective actions for safety incidents", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_L1", ref: "L3.1", label: "Life insurance/compensatory package on death", max: 1, type: "leadership",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P3_L2", ref: "L3.2", label: "Statutory dues deposited by value chain partners", max: 2, type: "leadership",
        options: [{ v: 2, l: "Complied & reported" }, { v: 1, l: "Either one" }, { v: 0, l: "Neither" }] },
      { id: "P3_L3", ref: "L3.3", label: "Employees with high-consequence injuries rehabilitated", max: 3, type: "leadership",
        options: [{ v: 3, l: ">80%" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_L4", ref: "L3.4", label: "Transition assistance programs (retirement/termination)", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_L5", ref: "L3.5", label: "Value chain partner assessment (H&S/working conditions)", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P3_L6", ref: "L3.6", label: "Corrective actions for value chain H&S concerns", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported + actions taken" }, { v: 0, l: "Not Reported" }] },
    ]
  },
  principle4: {
    title: "Principle 4: Stakeholder Responsiveness",
    maxEssential: 5, maxLeadership: 5, maxTotal: 10,
    items: [
      { id: "P4_1", ref: "4.1", label: "Process for identifying key stakeholder groups", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P4_2a", ref: "4.2", label: "Stakeholder engagement frequency", max: 2, type: "essential",
        options: [{ v: 2, l: "All stakeholders" }, { v: 1, l: "Not all" }, { v: 0, l: "No response" }] },
      { id: "P4_2b", ref: "4.2", label: "Vulnerable/marginalized groups in stakeholders", max: 2, type: "essential",
        options: [{ v: 2, l: ">80% are vulnerable/marginalized" }, { v: 1, l: "<80%" }, { v: 0, l: "None" }] },
      { id: "P4_L1", ref: "L4.1", label: "Board consultation process on ESG topics", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P4_L2", ref: "L4.2", label: "ESG management through stakeholder consultation", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P4_L3", ref: "L4.3", label: "Engagement with vulnerable/marginalized groups", max: 3, type: "leadership",
        options: [{ v: 3, l: "Quarterly" }, { v: 2, l: "Half-yearly" }, { v: 1, l: "Annual" }, { v: 0, l: "No engagement" }] },
    ]
  },
  principle5: {
    title: "Principle 5: Human Rights",
    maxEssential: 14, maxLeadership: 6, maxTotal: 20,
    items: [
      { id: "P5_1", ref: "5.1", label: "% employees/workmen trained on human rights", max: 2, type: "essential",
        options: [{ v: 2, l: "80-100%" }, { v: 1, l: "60-80%" }, { v: 0, l: "<60%" }] },
      { id: "P5_2", ref: "5.2", label: "Minimum wages paid vs stipulated", max: 3, type: "essential",
        options: [{ v: 3, l: "Reported + 30% above minimum" }, { v: 2, l: "Reported + 20% above" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_3", ref: "5.3", label: "Remuneration details (Board/KMP/employees/workmen)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_4", ref: "5.4", label: "Focal point for human rights impacts", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P5_5", ref: "5.5", label: "Internal grievance mechanism for human rights", max: 2, type: "essential",
        options: [{ v: 2, l: "Mechanism + reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_6", ref: "5.6", label: "HR grievance details (sexual harassment/child labour/etc.)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_7", ref: "5.7", label: "Mechanism to prevent adverse consequences to complainant", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_8", ref: "5.8", label: "HR requirements in business agreements/contracts", max: 1, type: "essential",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P5_9", ref: "5.9", label: "Assessment of plants/offices (child/forced labour, etc.)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_10", ref: "5.10", label: "Corrective actions from HR assessments", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_L1", ref: "L5.1", label: "Business processes modified due to HR grievances", max: 1, type: "leadership",
        options: [{ v: 1, l: "Modified" }, { v: 0, l: "Not modified" }] },
      { id: "P5_L2", ref: "L5.2", label: "HR due diligence scope (incl. value chain)", max: 1, type: "leadership",
        options: [{ v: 1, l: "80-100% covered" }, { v: 0, l: "<60% or Not Reported" }] },
      { id: "P5_L3", ref: "L5.3", label: "Accessibility for differently abled visitors", max: 1, type: "leadership",
        options: [{ v: 1, l: "Accessible & reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_L4", ref: "L5.4", label: "Value chain HR assessment (child/forced labour)", max: 2, type: "leadership",
        options: [{ v: 2, l: "100% assessed" }, { v: 1, l: ">75% assessed" }, { v: 0, l: "Not Reported" }] },
      { id: "P5_L5", ref: "L5.5", label: "Corrective actions from value chain HR assessment", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
    ]
  },
  principle6: {
    title: "Principle 6: Environment",
    maxEssential: 34, maxLeadership: 20, maxTotal: 54,
    items: [
      { id: "P6_1a", ref: "6.1", label: "Energy consumption & intensity reported", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_1b", ref: "6.1", label: "Energy: External assessment/assurance", max: 1, type: "essential",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_2", ref: "6.2", label: "PAT scheme targets achieved", max: 2, type: "essential",
        options: [{ v: 2, l: "Achieved & reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_3a", ref: "6.3", label: "Water withdrawal/consumption/intensity", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_3b", ref: "6.3", label: "Water: External assessment/assurance", max: 1, type: "essential",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_4", ref: "6.4", label: "Zero Liquid Discharge mechanism", max: 2, type: "essential",
        options: [{ v: 2, l: "Mechanism + reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_5a", ref: "6.5", label: "Air emissions (NOx, SOx, PM, etc.)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_5b", ref: "6.5", label: "Air emissions: External assessment", max: 1, type: "essential",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_6a", ref: "6.6", label: "GHG emissions (Scope 1 & 2)", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_6b", ref: "6.6", label: "GHG: External assessment/assurance", max: 1, type: "essential",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_7", ref: "6.7", label: "GHG emission reduction projects", max: 5, type: "essential",
        options: [{ v: 5, l: "Active projects" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_8a", ref: "6.8", label: "Waste management details", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_8b", ref: "6.8", label: "Waste: External assessment", max: 1, type: "essential",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_9", ref: "6.9", label: "Waste management practices & hazardous chemical strategy", max: 5, type: "essential",
        options: [{ v: 5, l: "Practices in place & reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_10", ref: "6.10", label: "Operations in ecologically sensitive areas", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_11", ref: "6.11", label: "Environmental impact assessments", max: 4, type: "essential",
        options: [{ v: 4, l: "External + public domain" }, { v: 3, l: "Internal + communicated" }, { v: 2, l: "Done, not communicated" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_12", ref: "6.12", label: "Compliance with environmental laws", max: 5, type: "essential",
        options: [{ v: 5, l: "100% compliance & reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L1a", ref: "L6.1", label: "Renewable vs non-renewable energy details", max: 2, type: "leadership",
        options: [{ v: 2, l: "Reported + >50% renewable" }, { v: 1, l: "25-50% renewable" }, { v: 0, l: "<25% or Not Reported" }] },
      { id: "P6_L1b", ref: "L6.1", label: "Renewable energy: External assessment", max: 1, type: "leadership",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_L2a", ref: "L6.2", label: "Water discharge by destination & treatment level", max: 5, type: "leadership",
        options: [{ v: 5, l: "All 5 categories treated" }, { v: 3, l: "3 categories" }, { v: 1, l: "1 category" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L2b", ref: "L6.2", label: "Water discharge: External assessment", max: 1, type: "leadership",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_L3a", ref: "L6.3", label: "Water in water-stress areas + treatment level", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L3b", ref: "L6.3", label: "Water stress: External assessment", max: 1, type: "leadership",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_L4a", ref: "L6.4", label: "Scope 3 emissions & intensity", max: 2, type: "leadership",
        options: [{ v: 2, l: "Reported with breakup" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L4b", ref: "L6.4", label: "Scope 3: External assessment", max: 1, type: "leadership",
        options: [{ v: 1, l: "External agency" }, { v: 0, l: "No assessment" }] },
      { id: "P6_L5", ref: "L6.5", label: "Biodiversity impact & remediation activities", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L6", ref: "L6.6", label: "Innovative technology for resource efficiency", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L7", ref: "L6.7", label: "Business continuity & disaster management plan", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L8", ref: "L6.8", label: "Value chain environmental impact & mitigation", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P6_L9", ref: "L6.9", label: "% value chain partners assessed (environmental)", max: 2, type: "leadership",
        options: [{ v: 2, l: "100% covered" }, { v: 1, l: ">60%" }, { v: 0, l: "<60% or Not Reported" }] },
    ]
  },
  principle7: {
    title: "Principle 7: Public Policy Advocacy",
    maxEssential: 5, maxLeadership: 2, maxTotal: 7,
    items: [
      { id: "P7_1a", ref: "7.1a", label: "Trade/industry chamber affiliations", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P7_1b", ref: "7.1b", label: "Top 10 trade/industry chambers listed", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P7_2", ref: "7.2", label: "Anti-competitive conduct corrective action", max: 3, type: "essential",
        options: [{ v: 3, l: "No adverse order" }, { v: 2, l: "Adverse order + corrective action" }, { v: 1, l: "Reported" }, { v: 0, l: "Not reported" }] },
      { id: "P7_L1", ref: "L7.1", label: "Public policy positions advocated", max: 2, type: "leadership",
        options: [{ v: 2, l: "Positions advocated" }, { v: 0, l: "Not advocated" }] },
    ]
  },
  principle8: {
    title: "Principle 8: Inclusive Growth & Equitable Development",
    maxEssential: 15, maxLeadership: 9, maxTotal: 24,
    items: [
      { id: "P8_1", ref: "8.1", label: "Social Impact Assessments (SIA)", max: 5, type: "essential",
        options: [{ v: 5, l: "External agency" }, { v: 2, l: "Internal" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_2", ref: "8.2", label: "Rehabilitation & Resettlement projects", max: 3, type: "essential",
        options: [{ v: 3, l: ">2 projects" }, { v: 2, l: "2 projects" }, { v: 1, l: "1 project" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_3", ref: "8.3", label: "Community grievance redressal mechanism", max: 1, type: "essential",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_4", ref: "8.4", label: "% input from MSME/small producers & local sourcing", max: 6, type: "essential",
        options: [{ v: 6, l: ">80% MSME + >50% local" }, { v: 4, l: ">50% MSME + local" }, { v: 2, l: "Partial" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_L1", ref: "L8.1", label: "Actions to mitigate negative SIA impacts", max: 1, type: "leadership",
        options: [{ v: 1, l: "All corrective actions taken" }, { v: 0, l: "Not done" }] },
      { id: "P8_L2", ref: "L8.2", label: "CSR in aspirational districts", max: 2, type: "leadership",
        options: [{ v: 2, l: "All designated districts" }, { v: 1, l: "1 district" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_L3a", ref: "L8.3", label: "Procurement preference for marginal/vulnerable groups", max: 1, type: "leadership",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P8_L3b", ref: "L8.3", label: "% procurement from marginal/vulnerable groups", max: 1, type: "leadership",
        options: [{ v: 1, l: ">10%" }, { v: 0, l: "<10% or Not Reported" }] },
      { id: "P8_L4", ref: "L8.4", label: "IP benefit-sharing basis reported", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P8_L5", ref: "L8.5", label: "Corrective actions for IP cases", max: 1, type: "leadership",
        options: [{ v: 1, l: "All actions taken" }, { v: 0, l: "Not done" }] },
      { id: "P8_L6", ref: "L8.6", label: "CSR beneficiaries from vulnerable groups", max: 2, type: "leadership",
        options: [{ v: 2, l: ">80%" }, { v: 1, l: "50-80%" }, { v: 0, l: "<50% or Not Reported" }] },
    ]
  },
  principle9: {
    title: "Principle 9: Consumer Responsibility",
    maxEssential: 36, maxLeadership: 7, maxTotal: 43,
    items: [
      { id: "P9_1", ref: "9.1", label: "Consumer complaint/feedback mechanism", max: 2, type: "essential",
        options: [{ v: 2, l: "Mechanism + reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_2a", ref: "9.2", label: "Products with environment/social info", max: 5, type: "essential",
        options: [{ v: 5, l: "90-100%" }, { v: 4, l: "75-90%" }, { v: 3, l: "70-75%" }, { v: 2, l: "60-70%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_2b", ref: "9.2", label: "Products with safe/responsible usage info", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100%" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_2c", ref: "9.2", label: "Products with recycling/disposal info", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100%" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3a", ref: "9.3", label: "Data privacy complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil complaints)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3b", ref: "9.3", label: "Advertising complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3c", ref: "9.3", label: "Cyber security complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3d", ref: "9.3", label: "Essential services complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3e", ref: "9.3", label: "Restrictive trade practices complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_3f", ref: "9.3", label: "Unfair trade practices complaints resolved", max: 3, type: "essential",
        options: [{ v: 3, l: "80-100% (or nil)" }, { v: 2, l: "60-80%" }, { v: 1, l: "<60%" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_4", ref: "9.4", label: "Product recall instances (safety)", max: 2, type: "essential",
        options: [{ v: 2, l: "Reported, no recalls" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_5", ref: "9.5", label: "Cyber security & data privacy framework", max: 2, type: "essential",
        options: [{ v: 2, l: "Framework exists + reported" }, { v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_6", ref: "9.6", label: "Corrective actions on data privacy/advertising", max: 1, type: "essential",
        options: [{ v: 1, l: "Steps taken" }, { v: 0, l: "Not taken" }] },
      { id: "P9_L1", ref: "L9.1", label: "Product/service info channels/platforms", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_L2", ref: "L9.2", label: "Consumer education on safe/responsible usage", max: 1, type: "leadership",
        options: [{ v: 1, l: "Steps taken" }, { v: 0, l: "Not taken" }] },
      { id: "P9_L3", ref: "L9.3", label: "Mechanism to inform of service disruption", max: 1, type: "leadership",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P9_L4a", ref: "L9.4", label: "Product info beyond legal mandate", max: 1, type: "leadership",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P9_L4b", ref: "L9.4", label: "Consumer survey conducted", max: 1, type: "leadership",
        options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
      { id: "P9_L5a", ref: "L9.5a", label: "Data breach instances & impact reported", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
      { id: "P9_L5b", ref: "L9.5b", label: "% data breaches involving PII", max: 1, type: "leadership",
        options: [{ v: 1, l: "Reported" }, { v: 0, l: "Not Reported" }] },
    ]
  },
};

const SECTION_KEYS = Object.keys(SRMM_DATA);
const SECTION_LABELS = {
  sectionA: "Sec A", sectionB: "Sec B", principle1: "P1", principle2: "P2", principle3: "P3",
  principle4: "P4", principle5: "P5", principle6: "P6", principle7: "P7", principle8: "P8", principle9: "P9"
};

const MATURITY_LEVELS = [
  { level: 1, name: "Formative", range: "≤25%", color: "#e74c3c", desc: "Initial level of reporting, identifying need for BRSR" },
  { level: 2, name: "Emerging", range: ">25–50%", color: "#f39c12", desc: "Setting up robust mechanisms, formalising policies" },
  { level: 3, name: "Established", range: ">50–75%", color: "#2ecc71", desc: "Formal functions/policies/systems established" },
  { level: 4, name: "Leading", range: ">75%", color: "#0a6847", desc: "Beyond compliance, market leader in sustainability" },
];

function getMaturityLevel(pct) {
  if (pct > 75) return MATURITY_LEVELS[3];
  if (pct > 50) return MATURITY_LEVELS[2];
  if (pct > 25) return MATURITY_LEVELS[1];
  return MATURITY_LEVELS[0];
}

import { jsPDF } from "jspdf";

// ─── PDF EXPORT FUNCTION ───
async function exportPDF(scores, answers, companyName, selectedNIC, answeredCount, totalItems) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 18;
  const CW = W - 2 * M;
  let y = 0;
  const maturity = getMaturityLevel(scores.pct);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const cName = companyName || "Company";
  const nicLabel = selectedNIC ? "NIC " + selectedNIC.code + ": " + selectedNIC.label : "";
  let currentPageTitle = "";

  // Reset font state helper - prevents spacing issues
  function resetFont(style, size, r, g, b) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(r, g, b);
    doc.setCharSpace(0);
  }

  function drawHeader(pageTitle) {
    // Header bar
    doc.setFillColor(10, 61, 46);
    doc.rect(0, 0, W, 18, "F");
    doc.setFillColor(13, 90, 62);
    doc.rect(0, 18, W, 1.5, "F");
    // Left: BRSR Compass
    resetFont("bold", 11, 255, 255, 255);
    doc.text("BRSR Compass", M, 8);
    resetFont("normal", 7, 180, 230, 200);
    doc.text("Benchmark \u2022 Assess \u2022 Bridge the Gap", M, 13);
    // Center: Company name
    resetFont("bold", 9, 255, 255, 255);
    doc.text(cName, W / 2, 8, { align: "center" });
    if (nicLabel) {
      resetFont("normal", 6.5, 160, 210, 185);
      doc.text(nicLabel, W / 2, 13, { align: "center" });
    }
    // Right: Page title
    resetFont("normal", 8, 200, 230, 215);
    doc.text(pageTitle, W - M, 10, { align: "right" });
    currentPageTitle = pageTitle;
  }

  function drawFooter() {
    resetFont("normal", 6.5, 150, 150, 150);
    doc.text("BRSR Compass Report | SRMM v2.0 | ICAI Framework | Generated " + today, M, H - 8);
    doc.text("Page " + doc.getNumberOfPages(), W - M, H - 8, { align: "right" });
    // Thin line above footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(M, H - 12, W - M, H - 12);
  }

  function newPage(pageTitle) {
    doc.addPage();
    drawHeader(pageTitle);
    drawFooter();
    y = 26;
  }

  function checkPage(needed) {
    if (y + needed > H - 18) {
      newPage(currentPageTitle);
    }
  }

  // ════════════════════════════════════════
  // PAGE 1: COVER
  // ════════════════════════════════════════
  doc.setFillColor(10, 61, 46); doc.rect(0, 0, W, 90, "F");
  doc.setFillColor(13, 90, 62); doc.rect(0, 90, W, 4, "F");

  resetFont("bold", 28, 255, 255, 255);
  doc.text("BRSR Compass", M, 35);
  resetFont("normal", 13, 180, 230, 200);
  doc.text("Benchmark \u2022 Assess \u2022 Bridge the Gap", M, 48);
  resetFont("normal", 9, 127, 206, 160);
  doc.text("Peer Benchmarking | Maturity Assessment | GAP Analysis | SEBI BRSR + ICAI SRMM v2.0", M, 58);
  resetFont("bold", 16, 255, 255, 255);
  doc.text(cName, M, 78);

  y = 106;
  resetFont("normal", 10, 60, 60, 60);
  doc.text("Report Date: " + today, M, y); y += 7;
  doc.text("Parameters Scored: " + answeredCount + " of " + totalItems, M, y); y += 7;
  if (selectedNIC) {
    doc.text("Industry: NIC Section " + selectedNIC.code + " \u2014 " + selectedNIC.label, M, y); y += 7;
  }

  // Summary box
  y += 6;
  doc.setFillColor(240, 250, 245); doc.roundedRect(M, y, CW, 52, 4, 4, "F");
  doc.setDrawColor(180, 224, 200); doc.roundedRect(M, y, CW, 52, 4, 4, "S");

  const boxY = y + 8;
  const col1 = M + 10, col2 = M + CW / 3 + 5, col3 = M + (2 * CW) / 3 + 5;

  resetFont("normal", 8, 100, 100, 100);
  doc.text("SRMM SCORE", col1, boxY);
  doc.text("MATURITY LEVEL", col2, boxY);
  doc.text("BREAKDOWN", col3, boxY);

  resetFont("bold", 22, 10, 61, 46);
  doc.text(scores.totalScore + "/" + scores.totalMax, col1, boxY + 12);
  resetFont("normal", 9, 80, 80, 80);
  doc.text(scores.pct + "% achieved", col1, boxY + 18);

  resetFont("bold", 18, 10, 61, 46);
  doc.text("Level " + maturity.level, col2, boxY + 12);
  resetFont("normal", 10, 80, 80, 80);
  doc.text(maturity.name + " Stage", col2, boxY + 18);
  resetFont("normal", 8, 100, 100, 100);
  doc.text(maturity.range, col2, boxY + 24);

  resetFont("normal", 10, 60, 60, 60);
  doc.text("Essential: " + scores.essentialScore + "/" + scores.essentialMax, col3, boxY + 10);
  doc.text("Leadership: " + scores.leaderScore + "/" + scores.leaderMax, col3, boxY + 18);
  resetFont("normal", 8, 180, 60, 60);
  doc.text("Gap: " + (scores.totalMax - scores.totalScore) + " points to close", col3, boxY + 26);

  y += 62;

  // Maturity level descriptions
  y += 8;
  resetFont("bold", 11, 10, 61, 46);
  doc.text("SRMM Maturity Scale", M, y); y += 8;
  MATURITY_LEVELS.forEach(m => {
    const isActive = maturity.level === m.level;
    if (isActive) { doc.setFillColor(220, 245, 230); doc.roundedRect(M, y - 4, CW, 11, 2, 2, "F"); }
    resetFont(isActive ? "bold" : "normal", 9, isActive ? 10 : 100, isActive ? 61 : 100, isActive ? 46 : 100);
    const arrow = isActive ? "\u25B6 " : "  ";
    doc.text(arrow + "Level " + m.level + ": " + m.name + " (" + m.range + ") \u2014 " + m.desc, M + 2, y + 3);
    y += 13;
  });
  drawFooter();

  // ════════════════════════════════════════
  // PAGE 2: SECTION BREAKDOWN
  // ════════════════════════════════════════
  newPage("Score Breakdown");

  resetFont("bold", 13, 10, 61, 46);
  doc.text("Section & Principle-wise Score Breakdown", M, y); y += 12;

  SECTION_KEYS.forEach(key => {
    checkPage(18);
    const s = scores.sections[key];
    const sec = SRMM_DATA[key];
    const pct = s.pct;
    const barColor = pct > 75 ? [10, 104, 71] : pct > 50 ? [39, 174, 96] : pct > 25 ? [243, 156, 18] : [231, 76, 60];

    resetFont("bold", 9, 30, 30, 30);
    doc.text(SECTION_LABELS[key] + " \u2014 " + sec.title, M, y);
    resetFont("bold", 9, 10, 90, 62);
    doc.text(s.score + "/" + s.max + " (" + pct + "%)", W - M, y, { align: "right" });

    y += 5;
    doc.setFillColor(230, 238, 232); doc.roundedRect(M, y, CW, 4, 2, 2, "F");
    if (pct > 0) { doc.setFillColor(...barColor); doc.roundedRect(M, y, CW * (pct / 100), 4, 2, 2, "F"); }
    y += 10;
  });

  // ════════════════════════════════════════
  // DETAILED PARAMETER SCORES
  // ════════════════════════════════════════
  newPage("Detailed Scores");

  resetFont("bold", 13, 10, 61, 46);
  doc.text("Detailed Parameter Scores", M, y); y += 10;

  SECTION_KEYS.forEach(key => {
    const sec = SRMM_DATA[key];
    checkPage(14);

    // Section header band
    doc.setFillColor(230, 245, 235); doc.rect(M, y - 3, CW, 8, "F");
    resetFont("bold", 9, 10, 61, 46);
    doc.text(sec.title, M + 2, y + 2); y += 10;

    sec.items.forEach(item => {
      checkPage(12);
      const v = answers[item.id];
      const scored = v !== undefined ? v : "-";
      const selectedOpt = v !== undefined ? item.options.find(o => o.v === v) : null;

      // Parameter label
      resetFont("normal", 7.5, 80, 80, 80);
      const typeTag = item.type === "leadership" ? "[L] " : "[E] ";
      const labelText = typeTag + item.ref + ": " + item.label;
      const truncLabel = labelText.length > 90 ? labelText.slice(0, 87) + "..." : labelText;
      doc.text(truncLabel, M + 1, y + 2);

      // Score
      const isFullScore = v === item.max;
      const isZero = v === 0 || v === undefined;
      resetFont("bold", 8, isFullScore ? 10 : isZero ? 180 : 160, isFullScore ? 104 : isZero ? 60 : 120, isFullScore ? 71 : isZero ? 60 : 20);
      doc.text(scored + "/" + item.max, W - M, y + 2, { align: "right" });

      if (selectedOpt) {
        resetFont("normal", 6.5, 120, 120, 120);
        const optText = "Selected: " + selectedOpt.l;
        doc.text(optText.length > 75 ? optText.slice(0, 72) + "..." : optText, M + 3, y + 7);
        y += 10;
      } else {
        y += 7;
      }
    });
    y += 4;
  });

  // ════════════════════════════════════════
  // GAP ANALYSIS
  // ════════════════════════════════════════
  newPage("GAP Analysis");

  resetFont("bold", 13, 10, 61, 46);
  doc.text("GAP Analysis \u2014 Top Priority Areas", M, y); y += 5;
  resetFont("normal", 8, 100, 100, 100);
  doc.text("Parameters ranked by gap size (largest first) \u2014 focus on these to improve your maturity level", M, y); y += 10;

  // Build gaps
  const allGaps = [];
  SECTION_KEYS.forEach(key => {
    SRMM_DATA[key].items.forEach(item => {
      const v = answers[item.id] ?? 0;
      const gap = item.max - v;
      if (gap > 0) allGaps.push({ ...item, section: SRMM_DATA[key].title, scored: v, gap });
    });
  });
  allGaps.sort((a, b) => b.gap - a.gap);

  // Table header
  doc.setFillColor(10, 61, 46); doc.rect(M, y, CW, 7, "F");
  resetFont("bold", 7, 255, 255, 255);
  doc.text("#", M + 3, y + 5);
  doc.text("Ref", M + 11, y + 5);
  doc.text("Parameter", M + 26, y + 5);
  doc.text("Scored", W - M - 28, y + 5, { align: "right" });
  doc.text("Max", W - M - 15, y + 5, { align: "right" });
  doc.text("Gap", W - M - 2, y + 5, { align: "right" });
  y += 9;

  allGaps.slice(0, 30).forEach((g, i) => {
    checkPage(8);
    if (i < 5) {
      doc.setFillColor(255, 240, 240); doc.rect(M, y - 2.5, CW, 7, "F");
    } else if (i % 2 === 0) {
      doc.setFillColor(248, 250, 248); doc.rect(M, y - 2.5, CW, 7, "F");
    }

    resetFont(i < 5 ? "bold" : "normal", 7.5, i < 5 ? 180 : 80, i < 5 ? 40 : 80, i < 5 ? 40 : 80);
    doc.text(String(i + 1), M + 3, y + 2);
    doc.text(g.ref, M + 11, y + 2);
    const paramText = g.label.length > 60 ? g.label.slice(0, 57) + "..." : g.label;
    doc.text(paramText, M + 26, y + 2);
    resetFont("normal", 7.5, 80, 80, 80);
    doc.text(String(g.scored), W - M - 28, y + 2, { align: "right" });
    doc.text(String(g.max), W - M - 15, y + 2, { align: "right" });
    resetFont("bold", 7.5, 200, 60, 60);
    doc.text(String(g.gap), W - M - 2, y + 2, { align: "right" });
    y += 7;
  });

  // Recommendation box
  y += 8; checkPage(22);
  doc.setFillColor(255, 251, 232); doc.roundedRect(M, y, CW, 20, 3, 3, "F");
  doc.setDrawColor(240, 230, 192); doc.roundedRect(M, y, CW, 20, 3, 3, "S");
  resetFont("bold", 9, 100, 90, 40);
  doc.text("Recommendation", M + 4, y + 7);
  resetFont("normal", 8, 100, 90, 50);
  const recText = maturity.level <= 2
    ? "Focus on Essential Indicators first \u2014 closing the top 10 gaps above can move you to the next maturity level."
    : "Your organization is at " + maturity.name + " stage. Prioritize Leadership Indicators to reach Level " + Math.min(4, maturity.level + 1) + ".";
  doc.text(recText, M + 4, y + 14);

  // Disclaimer
  y += 30; checkPage(25);
  doc.setDrawColor(220, 220, 220); doc.line(M, y, W - M, y); y += 5;
  resetFont("normal", 6.5, 140, 140, 140);
  const disc = [
    "Disclaimer: This report is generated based on self-assessment inputs and is for internal use only.",
    "Based on the SRMM v2.0 framework developed by the Sustainability Reporting Standards Board of ICAI.",
    "Not a certified assessment. For official BRSR assurance, engage a SEBI-accredited assessment provider.",
    "Scoring methodology follows the SEBI BRSR Circular dated 10th May 2021 with total score of 300 points.",
  ];
  disc.forEach(line => { doc.text(line, M, y); y += 4; });

  // Save
  const filename = cName.replace(/[^a-zA-Z0-9]/g, "_") + "_BRSR_Compass_Report_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(filename);
  return filename;
}

// ─── MAIN COMPONENT WITH AUTH ───
export default function BRSRTool() {
  const [user, setUser] = useState(() => {
    try { const s = window.localStorage.getItem("brsr_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [authView, setAuthView] = useState("login");
  const [users, setUsers] = useState(() => {
    try { const s = window.localStorage.getItem("brsr_users"); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });

  // Persist users and session to localStorage
  useEffect(() => { try { window.localStorage.setItem("brsr_users", JSON.stringify(users)); } catch {} }, [users]);
  useEffect(() => {
    try {
      if (user) window.localStorage.setItem("brsr_session", JSON.stringify(user));
      else window.localStorage.removeItem("brsr_session");
    } catch {}
  }, [user]);

  // When user updates API key in settings, also update the users database
  const handleSetUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser && users[updatedUser.email]) {
      setUsers(prev => ({ ...prev, [updatedUser.email]: { ...prev[updatedUser.email], apiKey: updatedUser.apiKey } }));
    }
  };

  if (!user) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "linear-gradient(135deg, #f0faf5 0%, #e8f4f0 50%, #f5f0e8 100%)", minHeight: "100vh", color: "#1a2e23" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
        {authView === "login"
          ? <LoginView users={users} onLogin={handleSetUser} onSwitch={() => setAuthView("signup")} />
          : <SignupView users={users} setUsers={setUsers} onSignup={handleSetUser} onSwitch={() => setAuthView("login")} />}
      </div>
    );
  }

  return <AppShell user={user} setUser={handleSetUser} onLogout={() => setUser(null)} />;
}

// ─── LOGIN VIEW ───
function LoginView({ users, onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please enter both email and password"); return; }
    const u = users[email.toLowerCase()];
    if (!u) { setError("No account found with this email. Please sign up."); return; }
    if (u.password !== password) { setError("Incorrect password. Please try again."); return; }
    onLogin({ email: email.toLowerCase(), name: u.name, apiKey: u.apiKey || "" });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
      <div style={{ width: 420, background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(10,61,46,0.12)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #0a3d2e, #0d5a3e)", padding: "32px 36px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #2ecc71, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>B</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>BRSR Compass</div>
              <div style={{ fontSize: 9, color: "#7fcea0", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Benchmark • Assess • Bridge the Gap</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#a0d8b8", lineHeight: 1.5 }}>Sign in to access your sustainability assessments and industry benchmarks.</div>
        </div>
        <div style={{ padding: "28px 36px 36px" }}>
          {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fef0f0", border: "1px solid #f0c0c0", color: "#8a2a2a", fontSize: 12, marginBottom: 14 }}>{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 5 }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#2ecc71"} onBlur={e => e.target.style.borderColor = "#cde0d6"}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 5 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your password"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#2ecc71"} onBlur={e => e.target.style.borderColor = "#cde0d6"}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0d5a3e, #2ecc71)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(13,90,62,0.25)", marginBottom: 16 }}>
            Sign In
          </button>
          <div style={{ textAlign: "center", fontSize: 12, color: "#6a8a7a" }}>
            Don't have an account? <button onClick={onSwitch} style={{ background: "none", border: "none", color: "#0d5a3e", fontWeight: 700, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Create Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIGNUP VIEW ───
function SignupView({ users, setUsers, onSignup, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    setError("");
    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (users[email.toLowerCase()]) { setError("An account with this email already exists"); return; }
    const newUsers = { ...users, [email.toLowerCase()]: { password, name, apiKey: "" } };
    setUsers(newUsers);
    onSignup({ email: email.toLowerCase(), name, apiKey: "" });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
      <div style={{ width: 420, background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(10,61,46,0.12)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #0a3d2e, #0d5a3e)", padding: "32px 36px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #2ecc71, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>B</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>Create Account</div>
              <div style={{ fontSize: 9, color: "#7fcea0", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>BRSR Compass</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#a0d8b8", lineHeight: 1.5 }}>Get started with free access to benchmarking, maturity assessment and gap analysis.</div>
        </div>
        <div style={{ padding: "24px 36px 36px" }}>
          {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fef0f0", border: "1px solid #f0c0c0", color: "#8a2a2a", fontSize: 12, marginBottom: 14 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 4 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 4 }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 4 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min 6 characters"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 4 }}>Confirm Password</label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="Repeat password"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
          </div>
          <button onClick={handleSignup} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0d5a3e, #2ecc71)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(13,90,62,0.25)", marginBottom: 14 }}>
            Create Account
          </button>
          <div style={{ textAlign: "center", fontSize: 12, color: "#6a8a7a" }}>
            Already have an account? <button onClick={onSwitch} style={{ background: "none", border: "none", color: "#0d5a3e", fontWeight: 700, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ───
function SettingsView({ user, setUser, onBack }) {
  const [apiKey, setApiKey] = useState(user.apiKey || "");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setUser({ ...user, apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDisconnect = () => {
    setApiKey("");
    setUser({ ...user, apiKey: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isConnected = user.apiKey && user.apiKey.startsWith("sk-ant-");

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#0d5a3e", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>← Back to app</button>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0a3d2e", marginBottom: 20 }}>Account Settings</h2>

      {/* Profile */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0a3d2e", marginBottom: 14 }}>Profile</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6a8a7a", marginBottom: 3 }}>Name</div>
            <div style={{ fontSize: 14, color: "#1a2e23" }}>{user.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6a8a7a", marginBottom: 3 }}>Email</div>
            <div style={{ fontSize: 14, color: "#1a2e23" }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Connect API */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${isConnected ? "#b0e0c8" : "#e0ece6"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0a3d2e" }}>Connect API</div>
          <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: isConnected ? "#d5f0e5" : "#f5f0e0", color: isConnected ? "#0a6847" : "#8a7a3a" }}>
            {isConnected ? "Connected" : "Not Connected"}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#5a7a6a", lineHeight: 1.6, marginBottom: 14 }}>
          Connect your Anthropic API key to enable AI-powered BRSR document analysis. Upload a PDF/DOCX/XLSX of your existing BRSR report and the AI will automatically pre-fill the assessment questionnaire.
        </p>
        <div style={{ background: "#f8faf9", borderRadius: 10, padding: 14, marginBottom: 14, border: "1px solid #e0ece6" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3a5a4a", marginBottom: 8 }}>What this enables:</div>
          <div style={{ fontSize: 11, color: "#4a6a5a", lineHeight: 1.7 }}>
            Upload your existing BRSR report (PDF, DOCX, or XLSX) and the AI reads the entire document, matches disclosures against all 100+ SRMM v2.0 parameters, and pre-selects the appropriate scores automatically. You can then review and adjust any AI suggestions before viewing results.
          </div>
        </div>
        <div style={{ background: "#fffbe8", borderRadius: 10, padding: 14, marginBottom: 16, border: "1px solid #f0e6c0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6a5a1a", marginBottom: 4 }}>Without Connect API:</div>
          <div style={{ fontSize: 11, color: "#7a6a3a", lineHeight: 1.6 }}>
            All other features work fully — industry benchmarking, peer comparisons, manual assessment scoring, maturity dashboard, gap analysis, and PDF export. Only the auto-fill from document upload requires an API connection.
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#3a5a4a", display: "block", marginBottom: 5 }}>Anthropic API Key</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input value={apiKey} onChange={e => setApiKey(e.target.value)} type={showKey ? "text" : "password"} placeholder="sk-ant-api03-..."
                style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1px solid #cde0d6", fontSize: 12, fontFamily: "'DM Sans', monospace", outline: "none", boxSizing: "border-box" }} />
              <button onClick={() => setShowKey(!showKey)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#8a9a8a" }}>
                {showKey ? "🙈" : "👁"}
              </button>
            </div>
            <button onClick={handleSave} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0d5a3e, #2ecc71)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              {saved ? "Saved!" : "Save Key"}
            </button>
          </div>
        </div>
        {isConnected && (
          <button onClick={handleDisconnect} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #f0c0c0", background: "#fef8f8", color: "#8a3a3a", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            Disconnect API
          </button>
        )}
        <div style={{ marginTop: 12, fontSize: 10, color: "#8a9a8a", lineHeight: 1.5 }}>
          Your API key is stored only in your browser session and is never sent to any server other than Anthropic's API. Get your key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: "#0d5a3e" }}>console.anthropic.com</a>
        </div>
      </div>

      {/* Feature Access Table */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0a3d2e", marginBottom: 14 }}>Feature Access</div>
        {[
          ["Industry classification mapping", true, false],
          ["Indian BRSR peer benchmarks", true, false],
          ["Global ESG peer benchmarks (GICS/NAICS/NACE)", true, false],
          ["Manual GAP assessment (100+ parameters)", true, false],
          ["Maturity level & dashboard", true, false],
          ["Gap analysis & recommendations", true, false],
          ["PDF report export", true, false],
          ["AI auto-fill from BRSR document upload", false, true],
        ].map(([feature, free, needsApi]) => (
          <div key={feature} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f4f0" }}>
            <span style={{ fontSize: 12, color: "#2a4a3a" }}>{feature}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 5,
              background: free ? "#d5f0e5" : (isConnected ? "#d5f0e5" : "#f5f0e0"),
              color: free ? "#0a6847" : (isConnected ? "#0a6847" : "#8a7a3a") }}>
              {free ? "Available" : (isConnected ? "Active" : "Requires API")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP SHELL (after auth) ───
function AppShell({ user, setUser, onLogout }) {
  const [view, setView] = useState("home");
  const [selectedNIC, setSelectedNIC] = useState(null);
  const [targetSystem, setTargetSystem] = useState("gics");
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [companyName, setCompanyName] = useState("");

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const scores = useMemo(() => {
    const result = {};
    let totalScore = 0, totalMax = 0, essentialScore = 0, essentialMax = 0, leaderScore = 0, leaderMax = 0;
    SECTION_KEYS.forEach(key => {
      const sec = SRMM_DATA[key];
      let secScore = 0, secEss = 0, secLead = 0;
      sec.items.forEach(item => {
        const v = answers[item.id] ?? -1;
        if (v >= 0) {
          if (item.type === "essential") { secEss += v; essentialScore += v; }
          else { secLead += v; leaderScore += v; }
          secScore += v;
        }
      });
      totalScore += secScore;
      totalMax += sec.maxTotal;
      essentialMax += sec.maxEssential;
      leaderMax += sec.maxLeadership;
      result[key] = { score: secScore, max: sec.maxTotal, essScore: secEss, leadScore: secLead, pct: sec.maxTotal > 0 ? Math.round((secScore / sec.maxTotal) * 100) : 0 };
    });
    return { sections: result, totalScore, totalMax, essentialScore, essentialMax, leaderScore, leaderMax, pct: totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0 };
  }, [answers]);

  const answeredCount = Object.values(answers).filter(v => v >= 0).length;
  const totalItems = SECTION_KEYS.reduce((s, k) => s + SRMM_DATA[k].items.length, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "linear-gradient(135deg, #f0faf5 0%, #e8f4f0 50%, #f5f0e8 100%)", minHeight: "100vh", color: "#1a2e23" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* ─── HEADER ─── */}
      <header style={{ background: "linear-gradient(135deg, #0a3d2e 0%, #0d5a3e 40%, #116b4a 100%)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(10,61,46,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #2ecc71, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", boxShadow: "0 2px 10px rgba(46,204,113,0.4)" }}>B</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", letterSpacing: 0.5 }}>BRSR Compass</div>
            <div style={{ fontSize: 9, color: "#7fcea0", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Benchmark • Assess • Bridge the Gap</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <nav style={{ display: "flex", gap: 3 }}>
            {[["home", "Home"], ["classify", "Benchmark"], ["assess", "Assess"], ["dashboard", "Bridge the Gap"]].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                background: view === v ? "rgba(46,204,113,0.25)" : "transparent", color: view === v ? "#7fcea0" : "rgba(255,255,255,0.55)" }}>{l}</button>
            ))}
          </nav>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <button onClick={() => setView("settings")} style={{ padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            background: view === "settings" ? "rgba(46,204,113,0.25)" : "transparent", color: view === "settings" ? "#7fcea0" : "rgba(255,255,255,0.55)" }}>
            {user.apiKey ? "🟢" : "⚙️"} Settings
          </button>
          <button onClick={onLogout} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, cursor: "pointer", marginLeft: 2 }}>
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {view === "home" && <HomeView onNavigate={setView} />}
        {view === "classify" && <ClassifyView selectedNIC={selectedNIC} setSelectedNIC={setSelectedNIC} targetSystem={targetSystem} setTargetSystem={setTargetSystem} onNext={() => setView("assess")} />}
        {view === "assess" && <AssessView data={SRMM_DATA} answers={answers} setAnswer={setAnswer} currentSection={currentSection} setCurrentSection={setCurrentSection} companyName={companyName} setCompanyName={setCompanyName} answeredCount={answeredCount} totalItems={totalItems} onDashboard={() => setView("dashboard")} apiKey={user.apiKey} onConnectApi={() => setView("settings")} />}
        {view === "dashboard" && <DashboardView scores={scores} answers={answers} companyName={companyName} selectedNIC={selectedNIC} answeredCount={answeredCount} totalItems={totalItems} />}
        {view === "settings" && <SettingsView user={user} setUser={setUser} onBack={() => setView("home")} />}
      </main>
    </div>
  );
}

// ─── HOME VIEW ───
function HomeView({ onNavigate }) {
  const cards = [
    ["🔍", "Benchmark", "Find the most compliant Indian BRSR & global ESG reporters in your exact sub-industry", "classify"],
    ["📊", "Assess", "Upload existing BRSR to auto-score, or manually evaluate 100+ SRMM v2.0 parameters", "assess"],
    ["🌉", "Bridge the Gap", "Pinpoint highest-impact gaps, get your maturity level, and export a PDF action plan", "dashboard"],
  ];
  return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, background: "linear-gradient(135deg, #0a3d2e, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        BRSR Compass
      </h1>
      <p style={{ fontSize: 16, color: "#4a6a5a", maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}>
        Benchmark against top Indian and global sustainability leaders, assess your BRSR maturity using ICAI's SRMM v2.0 framework, and identify the highest-impact gaps to close — all in one place.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 700, margin: "0 auto 40px" }}>
        {cards.map(([icon, title, desc, target]) => (
          <div key={title} onClick={() => onNavigate(target)}
            style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,61,46,0.12)"; e.currentTarget.style.borderColor = "#2ecc71"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "#e0ece6"; }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#0a3d2e" }}>{title}</div>
            <div style={{ fontSize: 12, color: "#6a8a7a", lineHeight: 1.5, marginBottom: 10 }}>{desc}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#2ecc71" }}>Go to {title} →</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#8aa89a", marginTop: 16 }}>Based on SEBI Circular dated 10th May 2021 • ICAI SRMM v2.0 • Grand Total: 300 points (225 Essential + 75 Leadership)</p>
    </div>
  );
}

// ─── CLASSIFY VIEW ───
function ClassifyView({ selectedNIC, setSelectedNIC, targetSystem, setTargetSystem, onNext }) {
  const [search, setSearch] = useState("");
  const [selectedDiv, setSelectedDiv] = useState(null);
  const filtered = NIC_SECTIONS.filter(n => n.label.toLowerCase().includes(search.toLowerCase()) || n.code.toLowerCase().includes(search.toLowerCase()) || (n.divisions||[]).some(d => d.label.toLowerCase().includes(search.toLowerCase())));
  const brsrDivFound = selectedDiv ? !!BRSR_DIV_PEERS[selectedDiv.code] : true;
  const brsPeers = selectedDiv ? (BRSR_DIV_PEERS[selectedDiv.code] || BRSR_PEERS[selectedNIC?.code] || []) : selectedNIC ? (BRSR_PEERS[selectedNIC.code] || []) : [];

  // For global peers, detect if division-level data was found or fell back
  const _globalDivCheck = (() => {
    if (!selectedDiv || !selectedNIC) return { found: true };
    if (targetSystem === "gics" && selectedDiv.gics) {
      const code = selectedDiv.gics.match(/\d+/)?.[0];
      return { found: !!(code && GICS_DIV_PEERS[code]) };
    }
    if (targetSystem === "naics" && selectedDiv.naics) {
      const exact = selectedDiv.naics;
      const prefix = exact.split("-")[0];
      return { found: !!(NAICS_DIV_PEERS[exact] || NAICS_DIV_PEERS[prefix]) };
    }
    if (targetSystem === "nace" && selectedDiv.nace) {
      return { found: !!NACE_DIV_PEERS[selectedDiv.nace] };
    }
    return { found: false };
  })();
  const globalDivFound = _globalDivCheck.found;
  const globalPeerGroups = selectedNIC ? findGlobalPeers(selectedNIC, targetSystem, selectedDiv) : [];
  const divisions = selectedNIC?.divisions || [];

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 6, color: "#0a3d2e" }}>Industry Classification & Peer Benchmarks</h2>
      <p style={{ fontSize: 13, color: "#5a7a6a", marginBottom: 20 }}>Select your NIC section and sub-division for precise GICS/NAICS/NACE sub-industry mapping.</p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        {/* Left: NIC Selection */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e", marginBottom: 10 }}>NIC Section & Division</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search section or sub-industry..." style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cde0d6", fontSize: 12, marginBottom: 8, boxSizing: "border-box", outline: "none" }} />
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {filtered.map(n => (
              <div key={n.code}>
                <div onClick={() => { setSelectedNIC(n); setSelectedDiv(null); }} style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 2, cursor: "pointer", fontSize: 11, lineHeight: 1.4, transition: "all 0.15s",
                  background: selectedNIC?.code === n.code ? "linear-gradient(135deg, #e8f8f0, #d5f0e5)" : "transparent", border: selectedNIC?.code === n.code ? "1px solid #2ecc71" : "1px solid transparent",
                  fontWeight: selectedNIC?.code === n.code ? 700 : 500, color: "#1a2e23" }}>
                  <span style={{ fontWeight: 700, color: "#0d5a3e", marginRight: 6 }}>{n.code}</span>{n.label}
                  {(n.divisions||[]).length > 0 && <span style={{ float: "right", fontSize: 9, color: "#8a9a8a" }}>{n.divisions.length} sub ▾</span>}
                </div>
                {selectedNIC?.code === n.code && (n.divisions||[]).length > 0 && (
                  <div style={{ marginLeft: 14, borderLeft: "2px solid #c0e8d0", paddingLeft: 10, marginBottom: 6 }}>
                    {n.divisions.map(d => (
                      <div key={d.code} onClick={() => setSelectedDiv(d)} style={{ padding: "5px 8px", borderRadius: 6, marginBottom: 2, cursor: "pointer", fontSize: 10, lineHeight: 1.3,
                        background: selectedDiv?.code === d.code ? "#d5f0e5" : "transparent", border: selectedDiv?.code === d.code ? "1px solid #7fcea0" : "1px solid transparent",
                        fontWeight: selectedDiv?.code === d.code ? 600 : 400, color: "#2a4a3a" }}>
                        <span style={{ fontWeight: 600, color: "#1a7a4a", marginRight: 4 }}>{d.code}</span>{d.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mapping + Peers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Classification Mapping Card — now with sub-level */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e" }}>Global Classification Mapping</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[["gics", "GICS"], ["naics", "NAICS"], ["nace", "NACE"]].map(([k, l]) => (
                  <button key={k} onClick={() => setTargetSystem(k)} style={{ padding: "5px 10px", borderRadius: 6, border: targetSystem === k ? "2px solid #2ecc71" : "1px solid #d0dcd6", background: targetSystem === k ? "#e8f8f0" : "#fafafa", fontSize: 10, fontWeight: 600, cursor: "pointer", color: targetSystem === k ? "#0d5a3e" : "#8a9a8a" }}>{l}</button>
                ))}
              </div>
            </div>
            {selectedNIC ? (
              <div>
                {/* Section-level mapping */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: selectedDiv ? 10 : 0 }}>
                  <div style={{ background: "#f0faf5", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "#5a8a6a", fontWeight: 600, marginBottom: 3 }}>NIC Section</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e" }}>{selectedNIC.code} — {selectedNIC.label}</div>
                  </div>
                  <div style={{ background: "#f5f0e8", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "#8a7a4a", fontWeight: 600, marginBottom: 3 }}>Section → {targetSystem.toUpperCase()}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4a3a1a" }}>
                      {targetSystem === "gics" && selectedNIC.gics}
                      {targetSystem === "naics" && `NAICS ${selectedNIC.naics}`}
                      {targetSystem === "nace" && `NACE ${selectedNIC.nace}`}
                    </div>
                  </div>
                </div>
                {/* Division-level (sub-classification) mapping */}
                {selectedDiv && (
                  <div style={{ background: "linear-gradient(135deg, #eef8f3, #e5f5ed)", borderRadius: 10, padding: 14, border: "1px dashed #7fcea0" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#0d5a3e", marginBottom: 8 }}>📌 Sub-Classification Detail (Division {selectedDiv.code})</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a3a2a", marginBottom: 8 }}>{selectedDiv.label}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #d0e8d8" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#2a7a4a", marginBottom: 3 }}>GICS Industry</div>
                        <div style={{ fontSize: 10, color: "#2a4a3a", fontWeight: 500 }}>{selectedDiv.gics}</div>
                        <div style={{ fontSize: 9, color: "#6a9a7a", marginTop: 3 }}>Sub: {selectedDiv.gicsSub}</div>
                      </div>
                      <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #d0d8e8" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#2a4a7a", marginBottom: 3 }}>NAICS Code</div>
                        <div style={{ fontSize: 11, color: "#2a3a4a", fontWeight: 600 }}>{selectedDiv.naics}</div>
                      </div>
                      <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #d8d0e8" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#5a2a7a", marginBottom: 3 }}>NACE Division</div>
                        <div style={{ fontSize: 11, color: "#3a2a4a", fontWeight: 600 }}>{selectedDiv.nace}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 9, color: "#7a9a8a", marginTop: 6 }}>Chain: NIC Div. {selectedDiv.code} → ISIC Rev.5 → GICS {selectedDiv.gicsSub?.split(" - ")[0]} / NAICS {selectedDiv.naics} / NACE {selectedDiv.nace}</div>
                  </div>
                )}
                {!selectedDiv && divisions.length > 0 && (
                  <div style={{ padding: 10, background: "#fffbe8", borderRadius: 8, border: "1px solid #f0e6c0", marginTop: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#8a7a3a" }}>💡 Select a sub-division on the left for precise sub-industry level GICS / NAICS / NACE mapping</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#8aa89a", fontSize: 12 }}>← Select a NIC section to begin</div>
            )}
          </div>

          {/* Indian BRSR Peers */}
          {selectedNIC && brsPeers.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #c0e8d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🇮🇳</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e" }}>Exemplary Indian BRSR Reports</div>
                  <div style={{ fontSize: 10, color: "#6a8a7a" }}>{selectedDiv ? `NIC Div. ${selectedDiv.code}: ${selectedDiv.label}` : `NIC Section ${selectedNIC.code}: ${selectedNIC.label}`} — Top 3 peers</div>
                </div>
              </div>
              {selectedDiv && !brsrDivFound && (
                <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: "#fffbe8", border: "1px solid #f0e6c0", fontSize: 10, color: "#7a6a2a", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span>Division-specific Indian peers for <strong>NIC {selectedDiv.code} ({selectedDiv.label})</strong> are not available yet. Showing <strong>section-level peers for NIC {selectedNIC.code} ({selectedNIC.label})</strong> instead.</span>
                </div>
              )}
              <div style={{ display: "grid", gap: 10 }}>
                {brsPeers.map((peer, i) => (
                  <div key={i} style={{ background: "linear-gradient(135deg, #f8fdf9, #f0faf5)", borderRadius: 10, padding: 14, border: "1px solid #d5eede", position: "relative" }}>
                    <div style={{ position: "absolute", top: 10, right: 12, background: "#0d5a3e", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.5 }}>#{i + 1}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0a3d2e", marginBottom: 2 }}>{peer.company}</div>
                    <div style={{ fontSize: 10, color: "#7a9a8a", marginBottom: 6, fontWeight: 600 }}>{peer.sector}</div>
                    <div style={{ fontSize: 11, color: "#3a5a4a", lineHeight: 1.5, marginBottom: 8 }}>{peer.why}</div>
                    <a href={peer.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#0d7a4e", textDecoration: "none", background: "#d5f0e5", padding: "4px 10px", borderRadius: 6, border: "1px solid #b0e0c8", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.target.style.background = "#b0e0c8"; }} onMouseLeave={e => { e.target.style.background = "#d5f0e5"; }}>
                      📄 View Reports &amp; Sustainability Page →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Global ESG Peers */}
          {selectedNIC && globalPeerGroups.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #c0d8e8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>{targetSystem === "naics" ? "🇺🇸" : targetSystem === "nace" ? "🇪🇺" : "🌍"}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0a2e3d" }}>Exemplary {targetSystem === "naics" ? "North American" : targetSystem === "nace" ? "European" : "Global"} ESG Reports</div>
                  <div style={{ fontSize: 10, color: "#6a7a8a" }}>{targetSystem.toUpperCase()}-matched sectors — Best-in-class sustainability reports from {targetSystem === "naics" ? "US/Canada" : targetSystem === "nace" ? "EU/UK" : "international"} peers</div>
                </div>
              </div>
              {selectedDiv && !globalDivFound && (
                <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: "#eef0ff", border: "1px solid #c0c8e8", fontSize: 10, color: "#3a3a6a", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span>{targetSystem.toUpperCase()} sub-industry peers for <strong>{selectedDiv.label} ({targetSystem === "gics" ? selectedDiv.gics : targetSystem === "naics" ? `NAICS ${selectedDiv.naics}` : `NACE ${selectedDiv.nace}`})</strong> are not available yet. Showing <strong>section-level {targetSystem.toUpperCase()} peers for NIC {selectedNIC.code}</strong> instead.</span>
                </div>
              )}
              {globalPeerGroups.map((group, gi) => (
                <div key={gi} style={{ marginBottom: gi < globalPeerGroups.length - 1 ? 16 : 0 }}>
                  {globalPeerGroups.length > 1 && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2a5a7a", background: "#e8f0f8", display: "inline-block", padding: "3px 10px", borderRadius: 5, marginBottom: 10 }}>{targetSystem.toUpperCase()}: {group.sectorName}</div>
                  )}
                  <div style={{ display: "grid", gap: 10 }}>
                    {group.peers.map((peer, i) => (
                      <div key={i} style={{ background: "linear-gradient(135deg, #f8fafd, #f0f4f8)", borderRadius: 10, padding: 14, border: "1px solid #d0dce8", position: "relative" }}>
                        <div style={{ position: "absolute", top: 10, right: 12, background: "#1a4a6a", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.5 }}>#{i + 1}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0a2e3d", marginBottom: 2 }}>{peer.company}</div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 9, color: "#4a7a9a", background: "#e0eef8", padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>{peer.framework}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#3a4a5a", lineHeight: 1.5, marginBottom: 8 }}>{peer.why}</div>
                        <a href={peer.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#1a5a8a", textDecoration: "none", background: "#d5e5f0", padding: "4px 10px", borderRadius: 6, border: "1px solid #b0c8e0", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.target.style.background = "#b0c8e0"; }} onMouseLeave={e => { e.target.style.background = "#d5e5f0"; }}>
                          🌐 View Reports &amp; ESG Disclosures →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <button onClick={onNext} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0d5a3e, #2ecc71)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 12px rgba(13,90,62,0.25)" }}>
          Proceed to Assessment →
        </button>
      </div>
    </div>
  );
}

// ─── ASSESS VIEW ───
function AssessView({ data, answers, setAnswer, currentSection, setCurrentSection, companyName, setCompanyName, answeredCount, totalItems, onDashboard, apiKey, onConnectApi }) {
  const key = SECTION_KEYS[currentSection];
  const section = data[key];
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'analyzing' | 'done' | 'error'
  const [uploadMsg, setUploadMsg] = useState("");
  const [prefillCount, setPrefillCount] = useState(0);

  // Build compact scoring schema - only IDs, max scores, and valid values
  const buildScoringPrompt = () => {
    let schema = {};
    SECTION_KEYS.forEach(k => {
      data[k].items.forEach(item => {
        schema[item.id] = { r: item.ref, m: item.max, v: item.options.map(o => o.v), l: item.label.slice(0, 60) };
      });
    });
    return JSON.stringify(schema);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) { setUploadStatus("error"); setUploadMsg("File too large (max 20MB)"); return; }

    setUploadStatus("uploading");
    setUploadMsg(`Reading ${file.name}...`);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const ext = file.name.split(".").pop().toLowerCase();
      let mediaType = "application/pdf";
      if (ext === "xlsx" || ext === "xls") mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      else if (ext === "docx" || ext === "doc") mediaType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (ext === "csv") mediaType = "text/csv";

      setUploadStatus("analyzing");
      setUploadMsg("AI is analyzing your BRSR document against SRMM v2.0 criteria... This may take 30-60 seconds.");

      const scoringSchema = buildScoringPrompt();

      const headers = {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      };
      if (apiKey) headers["x-api-key"] = apiKey;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8096,
          messages: [{
            role: "user",
            content: [
              {
                type: "document",
                source: { type: "base64", media_type: mediaType, data: base64 }
              },
              {
                type: "text",
                text: `You are an expert BRSR analyst. Analyze this document and score it against ICAI SRMM v2.0.

SCHEMA: Each key is a parameter ID. "r"=BRSR ref, "m"=max score, "v"=valid scores, "l"=label.
${scoringSchema}

RULES:
- Score ONLY parameters with clear evidence in the document
- Use only values from the "v" array for each parameter
- Extract company name
- Be concise - output ONLY the JSON below, nothing else

OUTPUT FORMAT (pure JSON, no backticks):
{"company":"Name","scores":{"A18":3,"A19":2,"P1_1a":3}}`
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `API error ${response.status}`);
      }

      const result = await response.json();
      const text = result.content?.map(c => c.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();

      // Robust JSON parsing - handle truncated responses
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (jsonErr) {
        // Try to fix truncated JSON by closing brackets
        let fixable = cleaned;
        if (!fixable.endsWith("}")) fixable += "}";
        if (!fixable.endsWith("}}")) fixable += "}";
        // Remove trailing partial entries like ,"P9_L5
        fixable = fixable.replace(/,"[^"]*$/, "");
        if (!fixable.endsWith("}}")) fixable += "}}";
        try {
          parsed = JSON.parse(fixable);
        } catch {
          // Last resort: extract what we can with regex
          const companyMatch = cleaned.match(/"company"\s*:\s*"([^"]+)"/);
          const scoresMatch = cleaned.match(/"scores"\s*:\s*\{([^]*)/);
          parsed = { company: companyMatch?.[1] || "", scores: {} };
          if (scoresMatch) {
            const pairs = scoresMatch[1].matchAll(/"(\w+)"\s*:\s*(\d+)/g);
            for (const m of pairs) parsed.scores[m[1]] = parseInt(m[2]);
          }
        }
      }

      let count = 0;
      if (parsed.scores) {
        Object.entries(parsed.scores).forEach(([id, val]) => {
          // Validate the score is a valid option for this parameter
          let valid = false;
          SECTION_KEYS.forEach(sk => {
            data[sk].items.forEach(item => {
              if (item.id === id && item.options.some(o => o.v === val)) {
                valid = true;
              }
            });
          });
          if (valid) {
            setAnswer(id, val);
            count++;
          }
        });
      }
      if (parsed.company && !companyName) setCompanyName(parsed.company);

      setPrefillCount(count);
      setUploadStatus("done");
      setUploadMsg(`Successfully pre-filled ${count} of ${totalItems} parameters from your document. Review and adjust as needed.`);
    } catch (err) {
      console.error("Upload/analysis error:", err);
      setUploadStatus("error");
      const errMsg = err.message || "Unknown error";
      const hint = errMsg.includes("Failed to fetch") ? " Check your internet connection and API key in Settings."
        : errMsg.includes("401") ? " Invalid API key. Go to Settings → Connect API and check your key."
        : errMsg.includes("429") ? " Rate limit exceeded. Please wait a minute and try again."
        : errMsg.includes("overloaded") ? " API is busy. Please try again in a few seconds."
        : " Please try again or fill manually.";
      setUploadMsg(`Analysis failed: ${errMsg}.${hint}`);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0a3d2e", margin: 0 }}>BRSR Compass — Assessment</h2>
          <p style={{ fontSize: 12, color: "#6a8a7a", margin: "4px 0 0" }}>Progress: {answeredCount} / {totalItems} parameters scored</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cde0d6", fontSize: 12, width: 180, outline: "none" }} />
          <button onClick={onDashboard} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0d5a3e", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Bridge the Gap →</button>
        </div>
      </div>

      {/* ─── UPLOAD BRSR DOCUMENT ─── */}
      <div style={{ background: apiKey ? "linear-gradient(135deg, #f8f0ff, #f0e8ff)" : "linear-gradient(135deg, #f8f8f0, #f0f0e8)", borderRadius: 14, padding: 18, marginBottom: 16, border: `1px solid ${apiKey ? "#d8c8f0" : "#e0dcc0"}`, boxShadow: "0 2px 10px rgba(100,60,180,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{apiKey ? "🤖" : "🔌"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: apiKey ? "#3a1a6a" : "#4a4a2a" }}>Auto-fill from existing BRSR Report</div>
              <div style={{ fontSize: 10, color: apiKey ? "#7a6a9a" : "#8a8a5a" }}>
                {apiKey ? "Upload your BRSR (PDF, DOCX, XLSX) — AI will analyze & pre-select matching scores" : "Connect your API key in Settings to enable AI-powered document analysis"}
              </div>
            </div>
          </div>
          {apiKey ? (
            <label style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: uploadStatus === "analyzing" ? "#9a8aba" : "linear-gradient(135deg, #6a3aaa, #8a5aca)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: uploadStatus === "analyzing" ? "wait" : "pointer", boxShadow: "0 2px 8px rgba(106,58,170,0.3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {uploadStatus === "analyzing" ? (
                <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</span> Analyzing...</>
              ) : uploadStatus === "uploading" ? (
                <>📤 Reading...</>
              ) : (
                <>📎 Upload BRSR Document</>
              )}
              <input type="file" accept=".pdf,.docx,.doc,.xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: "none" }} disabled={uploadStatus === "analyzing" || uploadStatus === "uploading"} />
            </label>
          ) : (
            <button onClick={onConnectApi} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #8a7a30, #b0a040)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              ⚙️ Connect API
            </button>
          )}
        </div>
        {uploadMsg && (
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, fontSize: 11, lineHeight: 1.5,
            background: uploadStatus === "done" ? "#e8f8f0" : uploadStatus === "error" ? "#fef0f0" : "#f0e8ff",
            color: uploadStatus === "done" ? "#0a5a2e" : uploadStatus === "error" ? "#8a2a2a" : "#4a2a7a",
            border: `1px solid ${uploadStatus === "done" ? "#b0e0c8" : uploadStatus === "error" ? "#f0c0c0" : "#d0c0f0"}` }}>
            {uploadStatus === "done" && "✅ "}{uploadStatus === "error" && "❌ "}{uploadMsg}
            {uploadStatus === "done" && <span style={{ marginLeft: 8, fontSize: 10, color: "#6a8a7a" }}>({prefillCount} pre-filled — highlighted in purple below)</span>}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Progress bar */}
      <div style={{ background: "#e0ece6", borderRadius: 6, height: 6, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ width: `${(answeredCount / totalItems) * 100}%`, height: "100%", background: "linear-gradient(90deg, #2ecc71, #0d5a3e)", borderRadius: 6, transition: "width 0.4s" }} />
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {SECTION_KEYS.map((k, i) => {
          const sec = data[k];
          const secAnswered = sec.items.filter(it => answers[it.id] !== undefined).length;
          const complete = secAnswered === sec.items.length;
          return (
            <button key={k} onClick={() => setCurrentSection(i)} style={{ padding: "6px 10px", borderRadius: 7, border: currentSection === i ? "2px solid #2ecc71" : "1px solid #d0e0d6", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              background: currentSection === i ? "#e8f8f0" : complete ? "#d5f0e5" : "#fff", color: currentSection === i ? "#0a3d2e" : "#5a7a6a" }}>
              {SECTION_LABELS[k]} {complete && "✓"}
            </button>
          );
        })}
      </div>

      {/* Section content */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0a3d2e", marginBottom: 4 }}>{section.title}</h3>
        <div style={{ fontSize: 11, color: "#7a9a8a", marginBottom: 20 }}>Max Score: {section.maxTotal} (Essential: {section.maxEssential} + Leadership: {section.maxLeadership})</div>

        {section.items.map(item => {
          const wasPreFilled = uploadStatus === "done" && answers[item.id] !== undefined;
          return (
          <div key={item.id} style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 10, background: answers[item.id] !== undefined ? (wasPreFilled ? "#f8f0ff" : "#f8fdf9") : "#fafafa", border: `1px solid ${wasPreFilled ? "#d0c0f0" : answers[item.id] !== undefined ? "#c0e8d0" : "#e8e8e8"}`, transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.type === "leadership" ? "#b07d10" : "#0d5a3e", background: item.type === "leadership" ? "#fff8e0" : "#e8f8f0", padding: "2px 7px", borderRadius: 4, marginRight: 8 }}>
                  {item.ref} {item.type === "leadership" ? "★ Leader" : "Essential"}
                </span>
                <span style={{ fontSize: 10, color: "#8a8a8a" }}>Max: {item.max}</span>
                {wasPreFilled && <span style={{ fontSize: 9, color: "#7a4aaa", background: "#f0e0ff", padding: "1px 6px", borderRadius: 3, marginLeft: 6, fontWeight: 600 }}>🤖 AI pre-filled</span>}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#2a3e33", marginBottom: 8, lineHeight: 1.4 }}>{item.label}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {item.options.map(opt => (
                <button key={opt.v + opt.l} onClick={() => setAnswer(item.id, opt.v)}
                  style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                    border: answers[item.id] === opt.v ? "2px solid #2ecc71" : "1px solid #d0dcd6",
                    background: answers[item.id] === opt.v ? "#d5f0e5" : "#fff",
                    fontWeight: answers[item.id] === opt.v ? 700 : 400,
                    color: answers[item.id] === opt.v ? "#0a3d2e" : "#5a6a60" }}>
                  {opt.l} ({opt.v})
                </button>
              ))}
            </div>
          </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} disabled={currentSection === 0}
          style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #cde0d6", background: "#fff", fontSize: 13, fontWeight: 600, cursor: currentSection === 0 ? "default" : "pointer", opacity: currentSection === 0 ? 0.4 : 1, color: "#0a3d2e" }}>← Previous</button>
        {currentSection < SECTION_KEYS.length - 1 ? (
          <button onClick={() => setCurrentSection(currentSection + 1)} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0d5a3e, #2ecc71)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Next →</button>
        ) : (
          <button onClick={onDashboard} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #b07d10, #d4a017)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Bridge the Gap — View Results →</button>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───
function DashboardView({ scores, answers, companyName, selectedNIC, answeredCount, totalItems }) {
  const maturity = getMaturityLevel(scores.pct);
  const [exporting, setExporting] = useState(false);
  const gaps = [];
  SECTION_KEYS.forEach(key => {
    SRMM_DATA[key].items.forEach(item => {
      const v = answers[item.id] ?? 0;
      const gap = item.max - v;
      if (gap > 0) gaps.push({ ...item, section: SRMM_DATA[key].title, scored: v, gap });
    });
  });
  gaps.sort((a, b) => b.gap - a.gap);
  const topGaps = gaps.slice(0, 15);

  const handleExport = async () => {
    setExporting(true);
    try {
      const fname = await exportPDF(scores, answers, companyName, selectedNIC, answeredCount, totalItems);
    } catch (err) {
      console.error("PDF export error:", err);
    }
    setExporting(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0a3d2e", margin: 0 }}>
          {companyName || "Company"} — Maturity & GAP Dashboard
        </h2>
        <button onClick={handleExport} disabled={exporting}
          style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: exporting ? "#8a9a8a" : "linear-gradient(135deg, #c0392b, #e74c3c)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: exporting ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(192,57,43,0.25)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          {exporting ? "⏳ Generating..." : "📄 Export PDF Report"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "#6a8a7a", marginBottom: 20 }}>
        {answeredCount} of {totalItems} parameters scored{selectedNIC ? ` | NIC Section ${selectedNIC.code}: ${selectedNIC.label}` : ""}
      </p>

      {/* Maturity Level Hero */}
      <div style={{ background: "linear-gradient(135deg, #0a3d2e, #0d5a3e)", borderRadius: 16, padding: 28, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.6, marginBottom: 8 }}>SRMM Score</div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{scores.totalScore}<span style={{ fontSize: 18, opacity: 0.5 }}>/{scores.totalMax}</span></div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{scores.pct}% achieved</div>
        </div>
        <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.15)", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.6, marginBottom: 8 }}>Maturity Level</div>
          <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 8, background: maturity.color, fontSize: 22, fontWeight: 800 }}>Level {maturity.level}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{maturity.name} Stage</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{maturity.range}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.6, marginBottom: 8 }}>Breakdown</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Essential: {scores.essentialScore}<span style={{ opacity: 0.5 }}>/{scores.essentialMax}</span></div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Leadership: {scores.leaderScore}<span style={{ opacity: 0.5 }}>/{scores.leaderMax}</span></div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6 }}>Gap: {scores.totalMax - scores.totalScore} points to close</div>
        </div>
      </div>

      {/* Maturity Scale */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e", marginBottom: 12 }}>SRMM Maturity Scale</div>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", height: 36 }}>
          {MATURITY_LEVELS.map(m => (
            <div key={m.level} style={{ flex: 1, background: maturity.level === m.level ? m.color : `${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: maturity.level === m.level ? "#fff" : m.color, transition: "all 0.3s", position: "relative" }}>
              L{m.level}: {m.name} ({m.range})
              {maturity.level === m.level && <span style={{ position: "absolute", top: -8, fontSize: 14 }}>▼</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Section Breakdown */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e", marginBottom: 14 }}>Score by Section & Principle</div>
        {SECTION_KEYS.map(key => {
          const s = scores.sections[key];
          const sec = SRMM_DATA[key];
          return (
            <div key={key} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ fontWeight: 600, color: "#1a2e23" }}>{SECTION_LABELS[key]} — {sec.title}</span>
                <span style={{ fontWeight: 700, color: "#0d5a3e" }}>{s.score}/{s.max} ({s.pct}%)</span>
              </div>
              <div style={{ background: "#e8efe9", borderRadius: 5, height: 10, overflow: "hidden" }}>
                <div style={{ width: `${s.pct}%`, height: "100%", borderRadius: 5, transition: "width 0.5s",
                  background: s.pct > 75 ? "linear-gradient(90deg, #0a6847, #2ecc71)" : s.pct > 50 ? "linear-gradient(90deg, #27ae60, #2ecc71)" : s.pct > 25 ? "linear-gradient(90deg, #f39c12, #f1c40f)" : "linear-gradient(90deg, #e74c3c, #e67e22)" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top GAPs */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e0ece6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0a3d2e", marginBottom: 4 }}>Top 15 GAPs to Close (Highest Impact)</div>
        <div style={{ fontSize: 11, color: "#7a9a8a", marginBottom: 14 }}>Focus on these to move up the maturity ladder fastest</div>
        <div style={{ display: "grid", gap: 6 }}>
          {topGaps.map((g, i) => (
            <div key={g.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 70px 60px", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: i < 5 ? "#fff5f5" : "#fafafa", border: `1px solid ${i < 5 ? "#f0d0d0" : "#e8e8e8"}`, fontSize: 11 }}>
              <span style={{ fontWeight: 800, color: i < 5 ? "#e74c3c" : "#b0b0b0" }}>#{i + 1}</span>
              <div>
                <span style={{ fontWeight: 600, color: "#0a3d2e" }}>[{g.ref}]</span>{" "}
                <span style={{ color: "#3a4a40" }}>{g.label.slice(0, 80)}{g.label.length > 80 ? "..." : ""}</span>
              </div>
              <span style={{ fontWeight: 700, color: "#e74c3c", textAlign: "right" }}>Gap: {g.gap}</span>
              <span style={{ textAlign: "right", color: "#6a8a7a" }}>{g.scored}/{g.max}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
