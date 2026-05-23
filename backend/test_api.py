"""
Simple test script to verify the FastAPI backend is working correctly.

Run this after starting the backend server:
    python test_api.py
"""

import sys

import requests

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"


class Colors:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}\n")


def print_success(text: str):
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")


def print_error(text: str):
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")


def print_info(text: str):
    print(f"{Colors.YELLOW}ℹ {text}{Colors.RESET}")


def test_health() -> bool:
    """Test health endpoint"""
    print_header("Testing Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Health check passed: {data['status']}")
            return True
        else:
            print_error(f"Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Could not connect to server: {e}")
        return False


def test_document() -> bool:
    """Test document endpoint"""
    print_header("Testing Knowledge Base Document Endpoint")
    try:
        response = requests.get(f"{API_URL}/document")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Document retrieved: '{data['title']}'")
            print_info(f"Contains {len(data['chunks'])} chunks")
            return True
        else:
            print_error(f"Failed with status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False


def test_preset_queries() -> bool:
    """Test preset queries endpoint"""
    print_header("Testing Preset Queries Endpoint")
    try:
        response = requests.get(f"{API_URL}/preset-queries")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} preset queries")
            for i, query in enumerate(data, 1):
                print_info(f"{i}. [{query['category']}] {query['text']}")
            return True
        else:
            print_error(f"Failed with status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False


def test_query_endpoint() -> bool:
    """Test main query endpoint"""
    print_header("Testing Query Endpoint (Main API)")

    test_queries = [
        "How many days can I work remotely per week?",
        "What is the vacation accrual policy after 5 years of employment?",
        "If I have a new baby and need time off, what benefits apply and how do I submit expenses during leave?",
    ]

    all_passed = True

    for query_text in test_queries:
        try:
            print(f"\n{Colors.YELLOW}Testing query:{Colors.RESET} {query_text}")

            response = requests.post(
                f"{API_URL}/query", json={"query": query_text}, timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                print_success("Query successful")

                # Display results from each model
                for resp in data.get("responses", []):
                    mode = resp.get("mode", "unknown")
                    confidence = resp.get("confidence", "N/A")
                    latency = resp.get("latencyMs", "N/A")
                    hallucinations = len(resp.get("hallucinations", []))
                    retrieved = len(resp.get("retrievedChunks", []))

                    print(f"  • {Colors.BOLD}{mode}{Colors.RESET}")
                    print(f"    Confidence: {confidence}%")
                    print(f"    Latency: {latency}ms")

                    if hallucinations > 0:
                        print(f"    ⚠ Hallucinations detected: {hallucinations}")

                    if retrieved > 0:
                        print(f"    ✓ Retrieved {retrieved} chunks")
            else:
                print_error(f"Query failed with status {response.status_code}")
                print_error(f"Response: {response.text}")
                all_passed = False

        except requests.exceptions.Timeout:
            print_error("Query timeout")
            all_passed = False
        except Exception as e:
            print_error(f"Error: {e}")
            all_passed = False

    return all_passed


def test_models_endpoint() -> bool:
    """Test models information endpoint"""
    print_header("Testing Models Information Endpoint")
    try:
        response = requests.get(f"{API_URL}/models")
        if response.status_code == 200:
            data = response.json()
            print_success("Models information retrieved")
            for model in data.get("models", []):
                print(f"  • {Colors.BOLD}{model['name']}{Colors.RESET}")
                print(f"    Description: {model['description']}")
            return True
        else:
            print_error(f"Failed with status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False


def main():
    """Run all tests"""
    print(f"\n{Colors.BOLD}InsightRAG Backend API Test Suite{Colors.RESET}")
    print(f"Testing API at: {BASE_URL}\n")

    results = []

    # Run tests
    results.append(("Health Check", test_health()))

    if not results[0][1]:
        print_error("\nBackend server is not running. Start it with:")
        print("  python main.py")
        sys.exit(1)

    results.append(("Document Endpoint", test_document()))
    results.append(("Preset Queries Endpoint", test_preset_queries()))
    results.append(("Models Endpoint", test_models_endpoint()))
    results.append(("Query Endpoint", test_query_endpoint()))

    # Summary
    print_header("Test Summary")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = (
            f"{Colors.GREEN}PASSED{Colors.RESET}"
            if result
            else f"{Colors.RED}FAILED{Colors.RESET}"
        )
        print(f"{test_name}: {status}")

    print(f"\n{Colors.BOLD}Total: {passed}/{total} tests passed{Colors.RESET}\n")

    if passed == total:
        print(
            f"{Colors.GREEN}✓ All tests passed! Backend is working correctly.{Colors.RESET}\n"
        )
        sys.exit(0)
    else:
        print(
            f"{Colors.RED}✗ Some tests failed. Please check the errors above.{Colors.RESET}\n"
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
