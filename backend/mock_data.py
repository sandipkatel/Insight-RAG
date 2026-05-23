from datetime import datetime

from models import (
    Chunk,
    Citation,
    Document,
    Mode,
    ModelResponse,
    PresetQuery,
    QueryCategory,
    QueryResult,
)

# Knowledge base document with chunks
MOCK_DOCUMENT = Document(
    id="doc-1",
    title="Company Knowledge Base — Internal Policy Manual v3.2",
    content="""Acme Corp was founded in 2008 by Sarah Chen and Marcus Webb in San Francisco, California. The company specializes in enterprise software solutions for supply chain management.

Remote Work Policy: Effective January 2024, employees may work remotely up to four days per week. All remote work must be pre-approved by the employee's direct manager. Employees working remotely are required to be available during core hours of 10am–3pm Pacific Time. Remote workers must maintain a professional home office setup and attend all mandatory in-person sessions during the first week of each quarter.

Health Benefits: Full-time employees receive comprehensive health coverage through BlueShield Premier Plan. Dental and vision coverage is included at no cost for employees and their dependents. The annual deductible is $500 for individuals and $1,000 for families. Mental health benefits include up to 20 therapy sessions per year covered at 90%.

Vacation Policy: Employees accrue 15 days of paid vacation per year for the first three years of employment. After three years, accrual increases to 20 days per year. Unused vacation may be carried over up to a maximum of 30 days. Vacation requests must be submitted at least two weeks in advance.

Performance Reviews: Annual performance reviews are conducted each November. Employees receive ratings on a five-point scale: Exceeds Expectations, Meets Expectations, Needs Improvement, and two additional levels. Salary adjustments resulting from reviews take effect the following January 1st.

Expense Reimbursement: Business expenses must be submitted within 30 days of incurrence. Meals are reimbursable up to $75 per day when traveling. Hotel accommodations up to $250 per night are covered. All expenses over $500 require pre-approval from department heads.

Data Security: All employees must complete annual cybersecurity training by March 31st. Sensitive customer data must be stored only on company-approved encrypted drives. Sharing company data via personal email or unapproved cloud services is strictly prohibited. Password changes are required every 90 days.

Parental Leave: Primary caregivers receive 16 weeks of fully paid parental leave. Secondary caregivers receive 6 weeks of fully paid parental leave. Parental leave must be taken within 12 months of the child's birth or adoption.""",
    chunks=[
        Chunk(
            id="chunk-1",
            text="Acme Corp was founded in 2008 by Sarah Chen and Marcus Webb in San Francisco, California. The company specializes in enterprise software solutions for supply chain management.",
            source="Section 1 — Company Overview",
            page=1,
            score=0,
        ),
        Chunk(
            id="chunk-2",
            text="Remote Work Policy: Effective January 2024, employees may work remotely up to four days per week. All remote work must be pre-approved by the employee's direct manager. Employees working remotely are required to be available during core hours of 10am–3pm Pacific Time.",
            source="Section 3 — Remote Work",
            page=4,
            score=0,
        ),
        Chunk(
            id="chunk-3",
            text="Remote workers must maintain a professional home office setup and attend all mandatory in-person sessions during the first week of each quarter.",
            source="Section 3 — Remote Work",
            page=4,
            score=0,
        ),
        Chunk(
            id="chunk-4",
            text="Health Benefits: Full-time employees receive comprehensive health coverage through BlueShield Premier Plan. Dental and vision coverage is included at no cost for employees and their dependents. The annual deductible is $500 for individuals and $1,000 for families.",
            source="Section 5 — Benefits",
            page=7,
            score=0,
        ),
        Chunk(
            id="chunk-5",
            text="Mental health benefits include up to 20 therapy sessions per year covered at 90%. Parental leave: Primary caregivers receive 16 weeks of fully paid parental leave. Secondary caregivers receive 6 weeks.",
            source="Section 5 — Benefits",
            page=8,
            score=0,
        ),
        Chunk(
            id="chunk-6",
            text="Vacation Policy: Employees accrue 15 days of paid vacation per year for the first three years of employment. After three years, accrual increases to 20 days per year. Unused vacation may be carried over up to a maximum of 30 days.",
            source="Section 6 — Time Off",
            page=9,
            score=0,
        ),
        Chunk(
            id="chunk-7",
            text="Performance Reviews: Annual performance reviews are conducted each November. Employees receive ratings on a five-point scale. Salary adjustments resulting from reviews take effect the following January 1st.",
            source="Section 8 — Performance",
            page=12,
            score=0,
        ),
        Chunk(
            id="chunk-8",
            text="Expense Reimbursement: Business expenses must be submitted within 30 days of incurrence. Meals are reimbursable up to $75 per day when traveling. Hotel accommodations up to $250 per night are covered.",
            source="Section 9 — Expenses",
            page=14,
            score=0,
        ),
    ],
)

# Preset queries
PRESET_QUERIES = [
    PresetQuery(
        text="How many days can I work remotely per week?",
        category=QueryCategory.factual,
        description="Factual lookup — tests precise retrieval",
    ),
    PresetQuery(
        text="What is the vacation accrual policy after 5 years of employment?",
        category=QueryCategory.factual,
        description="Factual — requires reading a condition",
    ),
    PresetQuery(
        text="How does our remote work policy compare to industry standards in 2025?",
        category=QueryCategory.recent,
        description="Requires external, up-to-date knowledge",
    ),
    PresetQuery(
        text="If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
        category=QueryCategory.multihop,
        description="Multi-hop — combines parental leave + expenses",
    ),
    PresetQuery(
        text="What is the CEO's personal phone number?",
        category=QueryCategory.unanswerable,
        description="Unanswerable — tests graceful failure",
    ),
]

# Mock responses keyed by query text
MOCK_RESPONSES = {
    "How many days can I work remotely per week?": QueryResult(
        query="How many days can I work remotely per week?",
        timestamp=datetime.now(),
        responses=[
            ModelResponse(
                mode=Mode.parametric,
                answer="Remote work policies vary widely by company. Most modern technology companies allow 2–3 days of remote work per week, though some offer full flexibility. Typically you'd need manager approval and should be available during standard business hours. Some companies have moved to fully remote models since 2020.",
                hallucinations=[
                    "Most modern technology companies allow 2–3 days of remote work per week"
                ],
                confidence=42,
                latencyMs=820,
            ),
            ModelResponse(
                mode=Mode.finetuned,
                answer="Based on company policy, employees can work remotely several days per week with manager approval. Core hours apply during remote days and professional home office setup is required.",
                confidence=67,
                latencyMs=950,
            ),
            ModelResponse(
                mode=Mode.rag,
                answer="According to the Remote Work Policy (effective January 2024), employees may work remotely **up to four days per week**. Remote work must be pre-approved by your direct manager, and you must be available during core hours of **10am–3pm Pacific Time**. You're also required to maintain a professional home office setup and attend mandatory in-person sessions during the first week of each quarter.",
                citations=[
                    Citation(
                        chunkId="chunk-2",
                        sentence="employees may work remotely up to four days per week",
                    ),
                    Citation(
                        chunkId="chunk-3",
                        sentence="attend all mandatory in-person sessions during the first week of each quarter",
                    ),
                ],
                retrievedChunks=[
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[1].id,
                        text=MOCK_DOCUMENT.chunks[1].text,
                        source=MOCK_DOCUMENT.chunks[1].source,
                        page=MOCK_DOCUMENT.chunks[1].page,
                        score=0.94,
                    ),
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[2].id,
                        text=MOCK_DOCUMENT.chunks[2].text,
                        source=MOCK_DOCUMENT.chunks[2].source,
                        page=MOCK_DOCUMENT.chunks[2].page,
                        score=0.81,
                    ),
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[0].id,
                        text=MOCK_DOCUMENT.chunks[0].text,
                        source=MOCK_DOCUMENT.chunks[0].source,
                        page=MOCK_DOCUMENT.chunks[0].page,
                        score=0.23,
                    ),
                ],
                confidence=97,
                latencyMs=1340,
            ),
        ],
    ),
    "What is the vacation accrual policy after 5 years of employment?": QueryResult(
        query="What is the vacation accrual policy after 5 years of employment?",
        timestamp=datetime.now(),
        responses=[
            ModelResponse(
                mode=Mode.parametric,
                answer="After 5 years at most companies, employees typically earn between 15–20 days of paid vacation. Many employers also offer additional perks like floating holidays or extra personal days for long-tenured employees. Some companies switch to an unlimited PTO policy after a certain tenure.",
                hallucinations=[
                    "Many employers also offer additional perks like floating holidays",
                    "Some companies switch to an unlimited PTO policy after a certain tenure",
                ],
                confidence=35,
                latencyMs=760,
            ),
            ModelResponse(
                mode=Mode.finetuned,
                answer="Employees with over three years of service accrue more vacation days than newer employees. The accrual rate increases after the initial period, and there is a maximum cap on carryover.",
                confidence=71,
                latencyMs=880,
            ),
            ModelResponse(
                mode=Mode.rag,
                answer="After 5 years of employment, you accrue **20 days of paid vacation per year** — the increased rate that applies after the first three years of service. Unused vacation can be carried over up to a maximum of **30 days**. Vacation requests must be submitted at least **two weeks in advance**.",
                citations=[
                    Citation(
                        chunkId="chunk-6",
                        sentence="After three years, accrual increases to 20 days per year",
                    ),
                    Citation(
                        chunkId="chunk-6",
                        sentence="Unused vacation may be carried over up to a maximum of 30 days",
                    ),
                ],
                retrievedChunks=[
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[5].id,
                        text=MOCK_DOCUMENT.chunks[5].text,
                        source=MOCK_DOCUMENT.chunks[5].source,
                        page=MOCK_DOCUMENT.chunks[5].page,
                        score=0.96,
                    ),
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[3].id,
                        text=MOCK_DOCUMENT.chunks[3].text,
                        source=MOCK_DOCUMENT.chunks[3].source,
                        page=MOCK_DOCUMENT.chunks[3].page,
                        score=0.34,
                    ),
                ],
                confidence=94,
                latencyMs=1120,
            ),
        ],
    ),
    "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?": QueryResult(
        query="If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
        timestamp=datetime.now(),
        responses=[
            ModelResponse(
                mode=Mode.parametric,
                answer="Most companies offer parental leave benefits ranging from 6 weeks to several months, typically paid. You'll want to check with your HR department about specific policies. During leave, you can usually submit expenses as normal, but check if there are any special procedures while you're off the clock.",
                hallucinations=[
                    "Most companies offer parental leave benefits ranging from 6 weeks to several months"
                ],
                confidence=38,
                latencyMs=890,
            ),
            ModelResponse(
                mode=Mode.finetuned,
                answer="New parents can take time off from work, and the company has procedures for expense reimbursement. Benefits for new parents and expense submission rules are documented in the policy manual.",
                confidence=58,
                latencyMs=1050,
            ),
            ModelResponse(
                mode=Mode.rag,
                answer="**Parental Leave**: As a primary caregiver, you receive **16 weeks of fully paid parental leave**. Secondary caregivers receive 6 weeks of fully paid leave. Parental leave must be taken within 12 months of your child's birth or adoption.\n\n**Expense Reimbursement During Leave**: Business expenses must be submitted within **30 days of incurrence**. During parental leave, continue following standard reimbursement procedures:\n- Meals: up to **$75 per day** when traveling\n- Hotel: up to **$250 per night**\n- All expenses over **$500 require pre-approval** from department heads",
                citations=[
                    Citation(
                        chunkId="chunk-5",
                        sentence="Primary caregivers receive 16 weeks of fully paid parental leave",
                    ),
                    Citation(
                        chunkId="chunk-8",
                        sentence="Business expenses must be submitted within 30 days of incurrence",
                    ),
                ],
                retrievedChunks=[
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[4].id,
                        text=MOCK_DOCUMENT.chunks[4].text,
                        source=MOCK_DOCUMENT.chunks[4].source,
                        page=MOCK_DOCUMENT.chunks[4].page,
                        score=0.92,
                    ),
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[7].id,
                        text=MOCK_DOCUMENT.chunks[7].text,
                        source=MOCK_DOCUMENT.chunks[7].source,
                        page=MOCK_DOCUMENT.chunks[7].page,
                        score=0.88,
                    ),
                    Chunk(
                        id=MOCK_DOCUMENT.chunks[5].id,
                        text=MOCK_DOCUMENT.chunks[5].text,
                        source=MOCK_DOCUMENT.chunks[5].source,
                        page=MOCK_DOCUMENT.chunks[5].page,
                        score=0.31,
                    ),
                ],
                confidence=96,
                latencyMs=1480,
            ),
        ],
    ),
}


def get_mock_response(query: str) -> QueryResult:
    """Get mock response for a query, or return a default response"""
    if query in MOCK_RESPONSES:
        return MOCK_RESPONSES[query]

    # Default response for queries not in mock data
    return QueryResult(
        query=query,
        timestamp=datetime.now(),
        responses=[
            ModelResponse(
                mode=Mode.parametric,
                answer=f"I don't have specific information about '{query}' in my training data. This is a question I cannot answer with confidence.",
                confidence=15,
                latencyMs=420,
            ),
            ModelResponse(
                mode=Mode.finetuned,
                answer=f"I'm not able to answer the query '{query}' based on my fine-tuned model.",
                confidence=20,
                latencyMs=510,
            ),
            ModelResponse(
                mode=Mode.rag,
                answer=f"I couldn't find relevant information in the knowledge base to answer '{query}'.",
                confidence=5,
                latencyMs=310,
                retrievedChunks=[],
            ),
        ],
    )
