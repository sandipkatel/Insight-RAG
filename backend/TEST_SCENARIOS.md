"""
Test Scenarios and Expected Outputs

This file documents the mock responses and test scenarios configured in the backend.
Use these to verify the API is working correctly and understand the response format.
"""

# ============================================================================
# SCENARIO 1: Straightforward Factual Query
# ============================================================================

REQUEST = {
    "query": "How many days can I work remotely per week?"
}

EXPECTED_RESPONSE = {
    "query": "How many days can I work remotely per week?",
    "timestamp": "2024-01-15T10:30:00Z",
    "responses": [
        {
            "mode": "parametric",
            "answer": "The parametric model suggests employees can work remotely 5 days per week.",
            "confidence": 65,
            "latencyMs": 145,
            "hallucinations": ["Claims 5 days per week, but actual policy is 4 days"]
        },
        {
            "mode": "finetuned",
            "answer": "Based on training data, remote work is approximately 4-5 days per week.",
            "confidence": 78,
            "latencyMs": 98
        },
        {
            "mode": "rag",
            "answer": "According to our company policy, employees can work remotely 4 days per week with core hours from 10am-3pm on Fridays in office.",
            "confidence": 98,
            "latencyMs": 234,
            "retrievedChunks": [
                {
                    "id": "chunk-2",
                    "text": "Remote work policy: Employees may work remotely up to 4 days per week.",
                    "source": "Company Handbook - Section 3.2",
                    "page": 12,
                    "score": 0.96
                },
                {
                    "id": "chunk-3",
                    "text": "Core hours on Fridays: All employees must be present in office between 10am-3pm on Fridays.",
                    "source": "Company Handbook - Section 3.3",
                    "page": 13,
                    "score": 0.89
                }
            ],
            "citations": [
                {
                    "chunkId": "chunk-2",
                    "sentence": "Employees may work remotely up to 4 days per week."
                },
                {
                    "chunkId": "chunk-3",
                    "sentence": "All employees must be present in office between 10am-3pm on Fridays."
                }
            ]
        }
    ]
}

# KEY OBSERVATIONS:
# - Parametric model HALLUCINATES (says 5 days when policy is 4)
# - Finetuned model is UNCERTAIN (gives range)
# - RAG model is ACCURATE with full citations and context


# ============================================================================
# SCENARIO 2: Policy Details Query
# ============================================================================

REQUEST_2 = {
    "query": "What is the vacation accrual policy after 5 years of employment?"
}

EXPECTED_RESPONSE_2 = {
    "query": "What is the vacation accrual policy after 5 years of employment?",
    "timestamp": "2024-01-15T10:45:00Z",
    "responses": [
        {
            "mode": "parametric",
            "answer": "The parametric model states that after 5 years, employees accrue 20 vacation days per year.",
            "confidence": 72,
            "latencyMs": 132,
            "hallucinations": []  # Happens to be correct
        },
        {
            "mode": "finetuned",
            "answer": "After 5 years of employment, vacation accrual increases to approximately 18-20 days annually.",
            "confidence": 81,
            "latencyMs": 105
        },
        {
            "mode": "rag",
            "answer": "According to our vacation policy, employees accrue vacation time based on tenure. After 5 years of employment, the accrual rate is 20 days per year, an increase from the initial 15 days per year for the first 3 years.",
            "confidence": 99,
            "latencyMs": 189,
            "retrievedChunks": [
                {
                    "id": "chunk-6",
                    "text": "Vacation accrual: First 3 years of employment: 15 days per year. After 3 years: 20 days per year.",
                    "source": "HR Manual - PTO Policy",
                    "page": 24,
                    "score": 0.97
                }
            ],
            "citations": [
                {
                    "chunkId": "chunk-6",
                    "sentence": "After 3 years: 20 days per year."
                }
            ]
        }
    ]
}

# KEY OBSERVATIONS:
# - All models agree (20 days)
# - Parametric is confident and correct
# - Finetuned gives a range (slightly uncertain)
# - RAG provides full context and citations


# ============================================================================
# SCENARIO 3: Multi-hop Query (Complex Reasoning Required)
# ============================================================================

REQUEST_3 = {
    "query": "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?"
}

EXPECTED_RESPONSE_3 = {
    "query": "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
    "timestamp": "2024-01-15T11:00:00Z",
    "responses": [
        {
            "mode": "parametric",
            "answer": "Upon having a new baby, you receive 12 weeks paid leave and can submit expenses up to $5,000.",
            "confidence": 60,
            "latencyMs": 156,
            "hallucinations": [
                "Mentioned $5,000 limit (actual is employer-covered reimbursement)",
                "Did not mention parental leave extension options"
            ]
        },
        {
            "mode": "finetuned",
            "answer": "Parental leave provides several weeks of paid time off following the birth of a child. Expenses can typically be submitted through the HR portal.",
            "confidence": 74,
            "latencyMs": 87
        },
        {
            "mode": "rag",
            "answer": "For parental leave: New parents are eligible for 12 weeks of paid parental leave. During your leave, you can submit business and personal expenses for reimbursement. Meal expenses up to $75 are reimbursable, and hotel accommodations up to $250 are covered when traveling on company business. To submit expenses, use the HR expense management portal or paper forms available from HR.",
            "confidence": 96,
            "latencyMs": 312,
            "retrievedChunks": [
                {
                    "id": "chunk-5",
                    "text": "Parental leave: New parents receive 12 weeks of paid leave following birth or adoption.",
                    "source": "HR Benefits Guide",
                    "page": 18,
                    "score": 0.98
                },
                {
                    "id": "chunk-8",
                    "text": "Expense reimbursement: Meals up to $75. Hotel accommodations up to $250. Submit via HR portal or paper forms.",
                    "source": "Finance Policy - Travel & Expenses",
                    "page": 31,
                    "score": 0.92
                }
            ],
            "citations": [
                {
                    "chunkId": "chunk-5",
                    "sentence": "New parents receive 12 weeks of paid leave following birth or adoption."
                },
                {
                    "chunkId": "chunk-8",
                    "sentence": "Submit via HR portal or paper forms."
                }
            ]
        }
    ]
}

# KEY OBSERVATIONS:
# - Parametric model STRUGGLES with multi-hop questions (hallucinations)
# - Finetuned model is VAGUE and incomplete
# - RAG model EXCELS: connects multiple policies and provides complete answer
# - RAG model retrieves from multiple chunks (parental leave + expense policy)
# - RAG model has highest confidence (96%) because it has source citations


# ============================================================================
# SCENARIO 4: Unknown/Unanswerable Query
# ============================================================================

REQUEST_4 = {
    "query": "What is the CEO's favorite coffee brand?"
}

EXPECTED_RESPONSE_4 = {
    "query": "What is the CEO's favorite coffee brand?",
    "timestamp": "2024-01-15T11:15:00Z",
    "responses": [
        {
            "mode": "parametric",
            "answer": "I don't have information about the CEO's personal coffee preferences in my training data.",
            "confidence": 35,
            "latencyMs": 78
        },
        {
            "mode": "finetuned",
            "answer": "This information is not available in my knowledge base.",
            "confidence": 42,
            "latencyMs": 65
        },
        {
            "mode": "rag",
            "answer": "I was unable to find any information about the CEO's coffee preferences in the company knowledge base. This question falls outside the scope of our available company policies and procedures documentation.",
            "confidence": 5,
            "latencyMs": 98,
            "retrievedChunks": [],
            "citations": []
        }
    ]
}

# KEY OBSERVATIONS:
# - All models appropriately respond that they don't have the information
# - RAG has very low confidence (5%) because no chunks matched
# - No hallucinations because models are designed to admit uncertainty
# - This shows the system's ability to handle out-of-scope questions


# ============================================================================
# TESTING INSTRUCTIONS
# ============================================================================

"""
To test these scenarios:

1. Start the backend:
   python main.py

2. Test via curl:
   curl -X POST http://localhost:8000/api/query \
     -H "Content-Type: application/json" \
     -d '{"query":"How many days can I work remotely per week?"}'

3. Test via Python:
   import requests
   response = requests.post(
       'http://localhost:8000/api/query',
       json={'query': 'How many days can I work remotely per week?'}
   )
   print(response.json())

4. Test via Swagger UI:
   - Open http://localhost:8000/docs
   - Click POST /api/query
   - Click "Try it out"
   - Enter the query in the request body
   - Click "Execute"

5. Test automatically:
   python test_api.py
"""

# ============================================================================
# RESPONSE FORMAT REFERENCE
# ============================================================================

"""
All responses follow this structure:

{
  "query": string,                    # The user's query
  "responses": [                      # Array of 3 responses (parametric, finetuned, rag)
    {
      "mode": string,                 # "parametric", "finetuned", or "rag"
      "answer": string,               # The model's response
      "confidence": number,           # 0-100, higher = more confident
      "latencyMs": number,            # Response time in milliseconds
      "hallucinations": [string],     # Optional: known false statements
      "retrievedChunks": [            # Optional: only for RAG
        {
          "id": string,
          "text": string,
          "source": string,
          "page": number,
          "score": number             # Relevance score 0-1
        }
      ],
      "citations": [                  # Optional: only for RAG
        {
          "chunkId": string,
          "sentence": string
        }
      ]
    }
  ],
  "timestamp": ISO8601 datetime
}
"""
