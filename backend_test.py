import requests
import sys
import json
from datetime import datetime

class FlamengoAPITester:
    def __init__(self, base_url="https://rubro-negro-blog.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.content else {}

        except Exception as e:
            self.failed_tests.append(f"{name}: Error - {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_initialize_data(self):
        """Test data initialization"""
        return self.run_test("Initialize Data", "POST", "init-data", 200)

    def test_get_categories(self):
        """Test get categories"""
        return self.run_test("Get Categories", "GET", "categories", 200)

    def test_get_stats(self):
        """Test get statistics"""
        return self.run_test("Get Statistics", "GET", "stats", 200)

    def test_get_posts(self):
        """Test get posts with various parameters"""
        success1, _ = self.run_test("Get All Posts", "GET", "posts", 200)
        success2, _ = self.run_test("Get Posts with Limit", "GET", "posts", 200, params={"limit": 5})
        success3, _ = self.run_test("Get Posts with Category Filter", "GET", "posts", 200, params={"category": "Notícias"})
        return success1 and success2 and success3

    def test_get_popular_posts(self):
        """Test get popular posts"""
        return self.run_test("Get Popular Posts", "GET", "posts/popular", 200)

    def test_get_recent_posts(self):
        """Test get recent posts"""
        return self.run_test("Get Recent Posts", "GET", "posts/recent", 200)

    def test_search_functionality(self):
        """Test search functionality"""
        success1, _ = self.run_test("Search Posts", "GET", "posts", 200, params={"search": "Flamengo"})
        success2, _ = self.run_test("Search Suggestions", "GET", "search/suggestions", 200, params={"q": "Fla"})
        return success1 and success2

    def test_get_tags(self):
        """Test get tags"""
        return self.run_test("Get Tags", "GET", "tags", 200)

    def test_post_by_slug(self):
        """Test get post by slug"""
        # First get posts to find a valid slug
        success, response = self.run_test("Get Posts for Slug Test", "GET", "posts", 200, params={"limit": 1})
        if success and response and len(response) > 0:
            slug = response[0].get('slug')
            if slug:
                return self.run_test(f"Get Post by Slug ({slug})", "GET", f"posts/{slug}", 200)
        
        # Try with a known slug from sample data
        return self.run_test("Get Post by Known Slug", "GET", "posts/flamengo-conquista-mais-um-titulo-historico", 200)

    def test_create_post(self):
        """Test create post"""
        test_post = {
            "title": "Test Post - Flamengo Campeão",
            "content": "Este é um post de teste sobre o Flamengo. Mengão sempre!",
            "excerpt": "Post de teste sobre o maior clube do Brasil",
            "category": "Notícias",
            "tags": ["teste", "flamengo", "mengao"],
            "published": True
        }
        return self.run_test("Create Post", "POST", "posts", 200, data=test_post)

def main():
    print("🔥 INICIANDO TESTES DO BLOG DO FLAMENGO 🔥")
    print("=" * 50)
    
    tester = FlamengoAPITester()
    
    # Run all tests
    print("\n📋 EXECUTANDO TESTES DE API...")
    
    # Basic health and setup
    tester.test_health_check()
    tester.test_initialize_data()
    
    # Core functionality
    tester.test_get_categories()
    tester.test_get_stats()
    tester.test_get_posts()
    tester.test_get_popular_posts()
    tester.test_get_recent_posts()
    tester.test_get_tags()
    
    # Search functionality
    tester.test_search_functionality()
    
    # Individual post
    tester.test_post_by_slug()
    
    # Create functionality
    tester.test_create_post()
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 RESULTADOS DOS TESTES")
    print("=" * 50)
    print(f"✅ Testes aprovados: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.failed_tests:
        print(f"\n❌ Testes que falharam:")
        for failed_test in tester.failed_tests:
            print(f"   • {failed_test}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n🎯 Taxa de sucesso: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🔥 MENGÃO! API funcionando bem!")
        return 0
    else:
        print("⚠️  Alguns problemas encontrados na API")
        return 1

if __name__ == "__main__":
    sys.exit(main())