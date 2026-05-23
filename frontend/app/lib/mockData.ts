import { Document, PresetQuery, QueryResult } from "./types";

export const MOCK_DOCUMENT: Document = {
  id: "doc-1",
  title: "Company Knowledge Base — Internal Policy Manual v3.2",
  content: `Acme Corp was founded in 2008 by Sarah Chen and Marcus Webb in San Francisco, California. The company specializes in enterprise software solutions for supply chain management.

Remote Work Policy: Effective January 2024, employees may work remotely up to four days per week. All remote work must be pre-approved by the employee's direct manager. Employees working remotely are required to be available during core hours of 10am–3pm Pacific Time. Remote workers must maintain a professional home office setup and attend all mandatory in-person sessions during the first week of each quarter.

Health Benefits: Full-time employees receive comprehensive health coverage through BlueShield Premier Plan. Dental and vision coverage is included at no cost for employees and their dependents. The annual deductible is $500 for individuals and $1,000 for families. Mental health benefits include up to 20 therapy sessions per year covered at 90%.

Vacation Policy: Employees accrue 15 days of paid vacation per year for the first three years of employment. After three years, accrual increases to 20 days per year. Unused vacation may be carried over up to a maximum of 30 days. Vacation requests must be submitted at least two weeks in advance.

Performance Reviews: Annual performance reviews are conducted each November. Employees receive ratings on a five-point scale: Exceeds Expectations, Meets Expectations, Needs Improvement, and two additional levels. Salary adjustments resulting from reviews take effect the following January 1st.

Expense Reimbursement: Business expenses must be submitted within 30 days of incurrence. Meals are reimbursable up to $75 per day when traveling. Hotel accommodations up to $250 per night are covered. All expenses over $500 require pre-approval from department heads.

Data Security: All employees must complete annual cybersecurity training by March 31st. Sensitive customer data must be stored only on company-approved encrypted drives. Sharing company data via personal email or unapproved cloud services is strictly prohibited. Password changes are required every 90 days.

Parental Leave: Primary caregivers receive 16 weeks of fully paid parental leave. Secondary caregivers receive 6 weeks of fully paid parental leave. Parental leave must be taken within 12 months of the child's birth or adoption.`,
  chunks: [
    {
      id: "chunk-1",
      text: "Acme Corp was founded in 2008 by Sarah Chen and Marcus Webb in San Francisco, California. The company specializes in enterprise software solutions for supply chain management.",
      source: "Section 1 — Company Overview",
      page: 1,
      score: 0,
    },
    {
      id: "chunk-2",
      text: "Remote Work Policy: Effective January 2024, employees may work remotely up to four days per week. All remote work must be pre-approved by the employee's direct manager. Employees working remotely are required to be available during core hours of 10am–3pm Pacific Time.",
      source: "Section 3 — Remote Work",
      page: 4,
      score: 0,
    },
    {
      id: "chunk-3",
      text: "Remote workers must maintain a professional home office setup and attend all mandatory in-person sessions during the first week of each quarter.",
      source: "Section 3 — Remote Work",
      page: 4,
      score: 0,
    },
    {
      id: "chunk-4",
      text: "Health Benefits: Full-time employees receive comprehensive health coverage through BlueShield Premier Plan. Dental and vision coverage is included at no cost for employees and their dependents. The annual deductible is $500 for individuals and $1,000 for families.",
      source: "Section 5 — Benefits",
      page: 7,
      score: 0,
    },
    {
      id: "chunk-5",
      text: "Mental health benefits include up to 20 therapy sessions per year covered at 90%. Parental leave: Primary caregivers receive 16 weeks of fully paid parental leave. Secondary caregivers receive 6 weeks.",
      source: "Section 5 — Benefits",
      page: 8,
      score: 0,
    },
    {
      id: "chunk-6",
      text: "Vacation Policy: Employees accrue 15 days of paid vacation per year for the first three years of employment. After three years, accrual increases to 20 days per year. Unused vacation may be carried over up to a maximum of 30 days.",
      source: "Section 6 — Time Off",
      page: 9,
      score: 0,
    },
    {
      id: "chunk-7",
      text: "Performance Reviews: Annual performance reviews are conducted each November. Employees receive ratings on a five-point scale. Salary adjustments resulting from reviews take effect the following January 1st.",
      source: "Section 8 — Performance",
      page: 12,
      score: 0,
    },
    {
      id: "chunk-8",
      text: "Expense Reimbursement: Business expenses must be submitted within 30 days of incurrence. Meals are reimbursable up to $75 per day when traveling. Hotel accommodations up to $250 per night are covered.",
      source: "Section 9 — Expenses",
      page: 14,
      score: 0,
    },
  ],
};

export const PRESET_QUERIES: PresetQuery[] = [
  {
    text: "How many days can I work remotely per week?",
    category: "factual",
    description: "Factual lookup — tests precise retrieval",
  },
  {
    text: "What is the vacation accrual policy after 5 years of employment?",
    category: "factual",
    description: "Factual — requires reading a condition",
  },
  {
    text: "How does our remote work policy compare to industry standards in 2025?",
    category: "recent",
    description: "Requires external, up-to-date knowledge",
  },
  {
    text: "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
    category: "multihop",
    description: "Multi-hop — combines parental leave + expenses",
  },
  {
    text: "What is the CEO's personal phone number?",
    category: "unanswerable",
    description: "Unanswerable — tests graceful failure",
  },
];

// ---------------------------------------------------------------------------
// Mock responses keyed by query text
// ---------------------------------------------------------------------------

type MockMap = Record<string, QueryResult>;

export const MOCK_RESPONSES: MockMap = {
  "How many days can I work remotely per week?": {
    query: "How many days can I work remotely per week?",
    timestamp: new Date(),
    responses: [
      {
        mode: "parametric",
        answer:
          "Remote work policies vary widely by company. Most modern technology companies allow 2–3 days of remote work per week, though some offer full flexibility. Typically you'd need manager approval and should be available during standard business hours. Some companies have moved to fully remote models since 2020.",
        hallucinations: [
          "Most modern technology companies allow 2–3 days of remote work per week",
        ],
        confidence: 42,
        latencyMs: 820,
      },
      {
        mode: "finetuned",
        answer:
          "Based on company policy, employees can work remotely several days per week with manager approval. Core hours apply during remote days and professional home office setup is required.",
        confidence: 67,
        latencyMs: 950,
      },
      {
        mode: "rag",
        answer:
          "According to the Remote Work Policy (effective January 2024), employees may work remotely **up to four days per week**. Remote work must be pre-approved by your direct manager, and you must be available during core hours of **10am–3pm Pacific Time**. You're also required to maintain a professional home office setup and attend mandatory in-person sessions during the first week of each quarter.",
        citations: [
          {
            chunkId: "chunk-2",
            sentence: "employees may work remotely up to four days per week",
          },
          {
            chunkId: "chunk-3",
            sentence:
              "attend all mandatory in-person sessions during the first week of each quarter",
          },
        ],
        retrievedChunks: [
          { ...MOCK_DOCUMENT.chunks[1], score: 0.94 },
          { ...MOCK_DOCUMENT.chunks[2], score: 0.81 },
          { ...MOCK_DOCUMENT.chunks[0], score: 0.23 },
        ],
        confidence: 97,
        latencyMs: 1340,
      },
    ],
  },

  "What is the vacation accrual policy after 5 years of employment?": {
    query: "What is the vacation accrual policy after 5 years of employment?",
    timestamp: new Date(),
    responses: [
      {
        mode: "parametric",
        answer:
          "After 5 years at most companies, employees typically earn between 15–20 days of paid vacation. Many employers also offer additional perks like floating holidays or extra personal days for long-tenured employees. Some companies switch to an unlimited PTO policy after a certain tenure.",
        hallucinations: [
          "Many employers also offer additional perks like floating holidays",
          "Some companies switch to an unlimited PTO policy after a certain tenure",
        ],
        confidence: 35,
        latencyMs: 760,
      },
      {
        mode: "finetuned",
        answer:
          "Employees with over three years of service accrue more vacation days than newer employees. The accrual rate increases after the initial period, and there is a maximum cap on carryover.",
        confidence: 71,
        latencyMs: 880,
      },
      {
        mode: "rag",
        answer:
          "After 5 years of employment, you accrue **20 days of paid vacation per year** — the increased rate that applies after the first three years of service. Unused vacation can be carried over up to a maximum of **30 days**. Vacation requests must be submitted at least **two weeks in advance**.",
        citations: [
          {
            chunkId: "chunk-6",
            sentence:
              "After three years, accrual increases to 20 days per year",
          },
          {
            chunkId: "chunk-6",
            sentence:
              "Unused vacation may be carried over up to a maximum of 30 days",
          },
        ],
        retrievedChunks: [
          { ...MOCK_DOCUMENT.chunks[5], score: 0.96 },
          { ...MOCK_DOCUMENT.chunks[6], score: 0.31 },
          { ...MOCK_DOCUMENT.chunks[7], score: 0.18 },
        ],
        confidence: 99,
        latencyMs: 1190,
      },
    ],
  },

  "How does our remote work policy compare to industry standards in 2025?": {
    query:
      "How does our remote work policy compare to industry standards in 2025?",
    timestamp: new Date(),
    responses: [
      {
        mode: "parametric",
        answer:
          "As of my knowledge, most tech companies in 2023 offered hybrid arrangements of 2–3 days in-office. The trend has continued evolving. I don't have real-time data on 2025 industry standards, but the general direction has been toward more flexibility with some return-to-office pressure from larger corporations.",
        hallucinations: [],
        confidence: 38,
        latencyMs: 900,
      },
      {
        mode: "finetuned",
        answer:
          "Our remote work policy allows up to four days remote per week. Comparing this to general industry standards requires current market data that isn't available in the training corpus used for this fine-tune.",
        confidence: 55,
        latencyMs: 1020,
      },
      {
        mode: "rag",
        answer:
          "Our policy (up to **four remote days/week**, effective January 2024) is on the flexible end based on retrieved documentation. However, comparing it to live 2025 industry benchmarks falls outside the scope of the company knowledge base. The index contains internal policy documents only — for external market comparisons, this question would benefit from a web-augmented retrieval source. What I can confirm: core hours (10am–3pm PT) and quarterly in-person sessions are the main constraints on our arrangement.",
        citations: [
          {
            chunkId: "chunk-2",
            sentence: "employees may work remotely up to four days per week",
          },
        ],
        retrievedChunks: [
          { ...MOCK_DOCUMENT.chunks[1], score: 0.72 },
          { ...MOCK_DOCUMENT.chunks[2], score: 0.61 },
        ],
        confidence: 63,
        latencyMs: 1480,
      },
    ],
  },

  "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?":
    {
      query:
        "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
      timestamp: new Date(),
      responses: [
        {
          mode: "parametric",
          answer:
            "Congratulations! Most companies offer parental leave ranging from 6–16 weeks. You should check with HR about FMLA eligibility, short-term disability, and any supplemental pay. For expenses, you'd typically submit through the normal expense system. Health insurance continues during leave.",
          hallucinations: [
            "You should check with HR about FMLA eligibility, short-term disability",
            "Health insurance continues during leave",
          ],
          confidence: 31,
          latencyMs: 1100,
        },
        {
          mode: "finetuned",
          answer:
            "Primary caregivers receive a significant amount of paid parental leave. Expense reimbursement follows the standard process with receipts required. Specific amounts and timelines are in the HR policy documentation.",
          confidence: 58,
          latencyMs: 1250,
        },
        {
          mode: "rag",
          answer:
            "Two separate policy sections are relevant here:\n\n**Parental Leave:** As a primary caregiver, you receive **16 weeks of fully paid parental leave**. This must be taken within 12 months of the child's birth or adoption.\n\n**Expenses during leave:** Any business expenses must be submitted within **30 days of incurrence**, regardless of leave status. Travel meals are reimbursable up to **$75/day** and hotels up to **$250/night**. Expenses over $500 require department head pre-approval.\n\nFor benefits coverage, your health plan (BlueShield Premier) and dental/vision remain active during paid leave.",
          citations: [
            { chunkId: "chunk-5", sentence: "16 weeks of fully paid parental leave" },
            { chunkId: "chunk-8", sentence: "submitted within 30 days of incurrence" },
            { chunkId: "chunk-4", sentence: "comprehensive health coverage through BlueShield Premier Plan" },
          ],
          retrievedChunks: [
            { ...MOCK_DOCUMENT.chunks[4], score: 0.93 },
            { ...MOCK_DOCUMENT.chunks[7], score: 0.87 },
            { ...MOCK_DOCUMENT.chunks[3], score: 0.74 },
            { ...MOCK_DOCUMENT.chunks[5], score: 0.41 },
          ],
          confidence: 95,
          latencyMs: 1820,
        },
      ],
    },

  "What is the CEO's personal phone number?": {
    query: "What is the CEO's personal phone number?",
    timestamp: new Date(),
    responses: [
      {
        mode: "parametric",
        answer:
          "I don't have access to personal contact information for company executives. This kind of information is typically not publicly available for privacy and security reasons. You might try contacting the company's main switchboard or reaching out through official company channels.",
        hallucinations: [],
        confidence: 12,
        latencyMs: 650,
      },
      {
        mode: "finetuned",
        answer:
          "That information is not contained in the policy documentation I was trained on. Personal contact details for executives are not typically stored in HR policy manuals.",
        confidence: 15,
        latencyMs: 720,
      },
      {
        mode: "rag",
        answer:
          "No results found in the knowledge base for this query. After searching across all document chunks, no personal contact information for any executive exists in the indexed documents — this is expected, as the knowledge base contains HR policy documentation only.\n\nThe closest relevant chunks retrieved were about company founding (mentioning Sarah Chen and Marcus Webb as co-founders) but contained no contact details. This question is correctly identified as **unanswerable** from this index.",
        citations: [],
        retrievedChunks: [
          { ...MOCK_DOCUMENT.chunks[0], score: 0.31 },
        ],
        confidence: 98,
        latencyMs: 1050,
      },
    ],
  },
};
