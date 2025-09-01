export interface Source {
  label: string
  url: string
}

export interface BreachScenario {
  company: string
  year: number | string
  scenario: string
  actualCost: number
  costLabel: string
  totalImpact: number
  totalImpactLabel: string
  impact: string
  sources: Source[] | string[]
  category: string
}

export const scenarios: BreachScenario[] = [
  {
    company: "Meta/Facebook",
    year: "2016-2018",
    scenario:
      "The Cambridge Analytica scandal involved the unauthorized harvesting of personal data from up to 87 million Facebook users. The data was collected through a personality quiz app that not only gathered information from users who took the quiz but also from their Facebook friends without consent. This data was then used for political advertising and voter profiling during the 2016 US election and Brexit referendum. Although it's not a traditional data breach where information is stolen, the misuse of data in this incident has set the precedent for data privacy laws that impact present-day data breaches.",
    actualCost: 5_825_000_000,
    costLabel: "$5.825 billion (core settlements)",
    totalImpact: 6_000_000_000,
    totalImpactLabel: "$6+ billion (all settlements and penalties)",
    impact:
      "Facebook faced unprecedented regulatory and legal consequences: $5 billion FTC penalty (record-breaking), $725 million US class action settlement, $50 million Australian settlement, and $100 million SEC settlement for misleading investors. The company implemented comprehensive privacy reforms and oversight mechanisms. Shareholders demanded $8 billion reimbursement from leadership for fines and legal fees. The scandal fundamentally changed global data privacy regulations, accelerating GDPR implementation and inspiring new privacy laws worldwide.",
    sources: [
      {
        label: "FTC: Facebook to Pay $5 Billion Penalty",
        url: "https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-imposes-5-billion-penalty-sweeping-new-privacy-restrictions-facebook",
      },
      {
        label: "Reuters: Facebook parent Meta to pay $725 million to settle lawsuit relating to Cambridge Analytica",
        url: "https://www.reuters.com/legal/facebook-parent-meta-pay-725-mln-settle-lawsuit-relating-cambridge-analytica-2022-12-23/",
      },
    ],
    category: "total",
  },

  {
    company: "Optus",
    year: 2022,
    scenario:
      "Cyber attackers accessed personal data of approximately 10 million current and former customers, including 2.8 million passport and driver's licence numbers. Attack exploited a four-year-old coding error left unresolved on a dormant domain. ACMA alleges Optus failed to detect and remedy the flaw despite multiple opportunities.",
    actualCost: 140_000_000,
    costLabel: "$140 million",
    totalImpact: 1_640_000_000,
    totalImpactLabel: "$1.64 billion+ (incl. brand value loss)",
    impact:
      "Optus provisioned A$140M to cover aftermath costs: customer support, ID document replacement, credit monitoring, and external reviews. Over 10,000 records published on the dark web. Brand value estimated to have dropped by $1.5B. ACMA initiated Federal Court action alleging Optus failed to safeguard data. CEO resigned. Significant reputational damage despite continued revenue growth.",
    sources: [
      {
        label: "ComputerWeekly: Optus earmarks A$140m for breach costs",
        url: "https://www.computerweekly.com/news/252527126/Optus-earmarks-A140m-to-cover-cost-of-data-breach",
      },
      {
        label: "ABC News: Optus hack explained (June 2024)",
        url: "https://www.abc.net.au/news/2024-06-20/optus-hack/104002682",
      },
      {
        label: "ABC News: Optus class action over privacy breach",
        url: "https://www.abc.net.au/news/2023-04-21/optus-hack-class-action-customer-privacy-breach-data-leaked/102247638",
      },
      {
        label: "ABC News: Optus CEO resigns after outage",
        url: "https://www.abc.net.au/news/2023-11-20/optus-ceo-kelly-bayer-rosmarin-resigns-nationwide-outage/103125462",
      },
      {
        label: "QLD Govt Case Study: Optus data breach",
        url: "https://www.qld.gov.au/community/your-home-community/cyber-security/cyber-security-for-queenslanders/case-studies/optus-data-breach",
      },
    ],
    category: "total",
  },

  {
    company: "Latitude",
    year: 2023,
    scenario:
      "Personal data of up to 14 million customers exposed, including driver licence, passport, and Medicare numbers. Attackers used stolen employee credentials from a third-party to access information from two service providers.",
    actualCost: 53_000_000,
    costLabel: "$53 million",
    totalImpact: 76_000_000,
    totalImpactLabel: "$76 million",
    impact:
      "Operations severely disrupted for nearly five weeks—new account originations and collections halted or restricted. Lost $98M in the first six months after the breach. Reputational damage and potential insurance recovery ongoing.",
    sources: [
      {
        label: "Reuters: Latitude earnings forecast slashed",
        url: "https://www.reuters.com/business/finance/latitude-group-forecasts-steep-drop-earnings-cyber-attack-impact-2023-05-26/",
      },
      {
        label: "ACS: Latitude breach cost hits $76M",
        url: "https://ia.acs.org.au/article/2023/data-breach-cost-latitude--76-million.html",
      },
    ],
    category: "total",
  },

  {
    company: "Medibank",
    year: 2022,
    scenario:
      "A ransomware attack exposed personal and medical data of 9.7 million Australians, including Medicare, passport, and driver licence numbers. Hackers threatened to publish sensitive medical histories on the dark web. Medibank refused to pay the ransom in line with government policy.",
    actualCost: 125_000_000,
    costLabel: "$125 million+ (projected remediation and legal costs)",
    totalImpact: 125_000_000,
    totalImpactLabel: "$125 million+ (projected remediation and legal costs)",
    impact:
      "Medibank faces civil proceedings from OAIC for privacy law breaches, multiple class actions from customers and shareholders, and potential fines of $2.2M per contravention. APRA mandated a $250M insurance buffer for security weaknesses. Data for millions was leaked in stages online. Individuals experienced widespread stress, document replacements, and fear of identity fraud. Medibank faced reputational damage, legal risks, and regulatory scrutiny.",
    sources: [
      {
        label: "ACS: Medibank breach to cost more than $125M",
        url: "https://ia.acs.org.au/article/2024/data-breach-to-cost-medibank-more-than--125m-.html",
      },
      {
        label: "QLD Gov: Medibank Private cyber incident case study",
        url: "https://www.qld.gov.au/community/your-home-community/cyber-security/cyber-security-for-queenslanders/case-studies/medibank-private-cyber-incident",
      },
      {
        label: "OAIC: Civil penalty action against Medibank",
        url: "https://www.oaic.gov.au/news/media-centre/oaic-takes-civil-penalty-action-against-medibank",
      },
      {
        label: "APRA: Action against Medibank Private cyber incident",
        url: "https://www.apra.gov.au/news-and-publications/apra-takes-action-against-medibank-private-relation-to-cyber-incident",
      },
    ],
    category: "total",
  },

  {
    company: "T-Mobile",
    year: "2021-2023",
    scenario:
      "T-Mobile suffered multiple data breaches over three years (2021, 2022, and 2023) that impacted tens of millions of U.S. consumers. The 2021 breach alone affected 76.6 million U.S. consumers, while a 2023 breach impacted 37 million customers. The breaches exposed personal data of current, former, and prospective T-Mobile customers.",
    actualCost: 31_500_000,
    costLabel: "$31.5 million (FCC settlement)",
    totalImpact: 381_500_000,
    totalImpactLabel: "$381.5 million+ (incl. class action settlement)",
    impact:
      "FCC settlement requires $15.75 million civil penalty plus $15.75 million investment in cybersecurity improvements over two years. T-Mobile must address foundational security flaws, improve cyber hygiene, and adopt modern security architectures including zero trust and phishing-resistant multi-factor authentication. The company faces additional class action settlements totaling approximately $350 million. Significant regulatory scrutiny and reputational damage to the nation's third-largest wireless carrier.",
    sources: [
      {
        label: "Reuters: T-Mobile reaches $31.5M settlement with FCC",
        url: "https://www.reuters.com/business/media-telecom/t-mobile-reaches-315-million-settlement-with-fcc-over-data-breaches-2024-09-30/",
      },
      {
        label: "InformationWeek: T-Mobile's $350M Settlement and Future of Data Breach Consequences",
        url: "https://www.informationweek.com/cyber-resilience/t-mobile-s-350m-settlement-and-the-future-of-data-breach-consequences",
      },
    ],
    category: "settlement",
  },

  {
    company: "Robinhood",
    year: 2021,
    scenario:
      "In 2021, US share-trading app Robinhood experienced a social engineering attack where unauthorized parties convinced a customer service employee to provide access to internal customer support systems. The breach exposed personal information for over 7 million customers: email addresses for 5 million users, full names for 2 million users, and more detailed information (names, dates of birth, ZIP codes) for approximately 310 customers.",
    actualCost: 20_000_000,
    costLabel: "$20 million (class action settlement)",
    totalImpact: 65_000_000,
    totalImpactLabel: "$65 million+ (incl. SEC settlement)",
    impact:
      "The company agreed to a $20 million class action settlement for negligence claims, with $500,000 allocated for direct class member payments. A separate $45 million SEC settlement in 2025 addressed various securities law violations including issues stemming from the breach. The incident highlighted vulnerabilities in social engineering attacks targeting customer support staff.",
    sources: [
      {
        label: "BBC News: Robinhood hack affects millions of users",
        url: "https://www.bbc.com/news/technology-59209494",
      },
      {
        label: "IAPP: Robinhood settles class action lawsuit for negligence for $20 million",
        url: "https://iapp.org/news/b/robinhood-settles-class-action-lawsuit-for-negligence-for-20-million",
      },
      {
        label: "Banking Dive: Robinhood to pay $45M to settle SEC charges",
        url: "https://www.bankingdive.com/news/robinhood-to-pay-45m-to-settle-sec-charges/737475/",
      },
    ],
    category: "settlement",
  },
]
