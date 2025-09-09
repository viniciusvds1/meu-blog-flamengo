from fastapi import FastAPI, APIRouter, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import re
from urllib.parse import quote
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Blog do Flamengo API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    author: str = "Admin"
    category: str
    tags: List[str] = []
    image_url: Optional[str] = None
    published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    views: int = 0

class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    category: str
    tags: List[str] = []
    image_url: Optional[str] = None
    published: bool = True

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    published: Optional[bool] = None

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    color: str = "#FF0000"  # Vermelho do Flamengo
    created_at: datetime = Field(default_factory=datetime.utcnow)

def create_slug(title: str) -> str:
    """Create URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug.strip('-')

# Posts endpoints
@api_router.post("/posts", response_model=Post)
async def create_post(post_data: PostCreate):
    """Create a new post"""
    post_dict = post_data.dict()
    post_dict['slug'] = create_slug(post_data.title)
    post_obj = Post(**post_dict)
    
    await db.posts.insert_one(post_obj.dict())
    return post_obj

@api_router.get("/posts", response_model=List[Post])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=50),
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    published: bool = True
):
    """Get posts with filtering and pagination"""
    filter_query = {"published": published} if published else {}
    
    if category:
        filter_query["category"] = category
    
    if tag:
        filter_query["tags"] = {"$in": [tag]}
    
    if search:
        filter_query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.posts.find(filter_query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [Post(**post) for post in posts]

# Popular posts (must come before the slug route)
@api_router.get("/posts/popular", response_model=List[Post])
async def get_popular_posts(limit: int = Query(5, ge=1, le=20)):
    """Get most viewed posts"""
    posts = await db.posts.find({"published": True}).sort("views", -1).limit(limit).to_list(limit)
    return [Post(**post) for post in posts]

# Recent posts (must come before the slug route)
@api_router.get("/posts/recent", response_model=List[Post])
async def get_recent_posts(limit: int = Query(5, ge=1, le=20)):
    """Get most recent posts"""
    posts = await db.posts.find({"published": True}).sort("created_at", -1).limit(limit).to_list(limit)
    return [Post(**post) for post in posts]

@api_router.get("/posts/{slug}", response_model=Post)
async def get_post_by_slug(slug: str):
    """Get a single post by slug"""
    post = await db.posts.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment views
    await db.posts.update_one({"slug": slug}, {"$inc": {"views": 1}})
    post["views"] += 1
    
    return Post(**post)

@api_router.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: str, post_data: PostUpdate):
    """Update a post"""
    update_dict = {k: v for k, v in post_data.dict().items() if v is not None}
    
    if "title" in update_dict:
        update_dict["slug"] = create_slug(update_dict["title"])
    
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db.posts.update_one({"id": post_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    updated_post = await db.posts.find_one({"id": post_id})
    return Post(**updated_post)

@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    """Delete a post"""
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

# Categories endpoints
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    categories = await db.categories.find().to_list(100)
    return [Category(**category) for category in categories]

@api_router.post("/categories", response_model=Category)
async def create_category(category_data: dict):
    """Create a new category"""
    category_dict = category_data.copy()
    category_dict['slug'] = create_slug(category_data['name'])
    category_obj = Category(**category_dict)
    
    await db.categories.insert_one(category_obj.dict())
    return category_obj

# Tags endpoint
@api_router.get("/tags")
async def get_tags():
    """Get all unique tags"""
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    
    tags = await db.posts.aggregate(pipeline).to_list(100)
    return [{"name": tag["_id"], "count": tag["count"]} for tag in tags]

# Search suggestions
@api_router.get("/search/suggestions")
async def get_search_suggestions(q: str = Query(..., min_length=2)):
    """Get search suggestions"""
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"tags": {"$regex": q, "$options": "i"}}
                ],
                "published": True
            }
        },
        {
            "$project": {
                "_id": 0,  # Exclude _id to avoid ObjectId serialization issues
                "title": 1,
                "slug": 1,
                "category": 1
            }
        },
        {"$limit": 5}
    ]
    
    suggestions = await db.posts.aggregate(pipeline).to_list(5)
    return suggestions

# Statistics
@api_router.get("/stats")
async def get_stats():
    """Get blog statistics"""
    total_posts = await db.posts.count_documents({"published": True})
    total_views = await db.posts.aggregate([
        {"$match": {"published": True}},
        {"$group": {"_id": None, "total": {"$sum": "$views"}}}
    ]).to_list(1)
    
    categories_count = await db.categories.count_documents({})
    
    return {
        "total_posts": total_posts,
        "total_views": total_views[0]["total"] if total_views else 0,
        "total_categories": categories_count
    }

# Initialize default categories
@api_router.post("/init-data")
async def initialize_data():
    """Initialize default categories and sample posts"""
    # Check if categories already exist
    existing_categories = await db.categories.count_documents({})
    if existing_categories > 0:
        return {"message": "Data already initialized"}
    
    # Default categories
    default_categories = [
        {"name": "Notícias", "description": "Últimas notícias do Flamengo", "color": "#FF0000"},
        {"name": "Jogadores", "description": "Informações sobre os jogadores", "color": "#000000"},
        {"name": "História", "description": "História e tradição do clube", "color": "#FF0000"},
        {"name": "Taças", "description": "Conquistas e títulos", "color": "#FFD700"},
        {"name": "Maracanã", "description": "Nossa casa, nosso templo", "color": "#FF0000"}
    ]
    
    for cat_data in default_categories:
        cat_data['slug'] = create_slug(cat_data['name'])
        category = Category(**cat_data)
        await db.categories.insert_one(category.dict())
    
    # Sample posts
    sample_posts = [
        {
            "title": "Flamengo conquista mais um título histórico",
            "content": "Em uma partida épica no Maracanã, o Flamengo mostrou mais uma vez por que é o clube de maior torcida do Brasil. Com gols de Gabigol e Arrascaeta, o Mengão venceu por 2x1 e conquistou mais um título para sua galeria já repleta de troféus.\n\nA partida foi marcada pela garra e determinação dos jogadores rubro-negros, que não se intimidaram diante da pressão e jogaram com o coração. O técnico destacou a importância da torcida, que compareceu em peso ao estádio e empurrou o time durante os 90 minutos.\n\nEste título representa mais um capítulo na rica história do Clube de Regatas do Flamengo, fundado em 1895 e que se tornou uma paixão nacional.",
            "excerpt": "Em partida épica no Maracanã, Flamengo conquista mais um título com gols de Gabigol e Arrascaeta",
            "category": "Notícias",
            "tags": ["titulo", "maracana", "gabigol", "arrascaeta"],
            "image_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            "title": "A história gloriosa do Clube de Regatas do Flamengo",
            "content": "Fundado em 15 de novembro de 1895, o Clube de Regatas do Flamengo nasceu da fusão entre duas grandes paixões: o remo e o futebol. Inicialmente criado como clube de regatas, o Flamengo rapidamente se tornou uma das maiores potências do futebol brasileiro e mundial.\n\nAo longo de mais de 125 anos de história, o Mengão conquistou inúmeros títulos nacionais e internacionais, incluindo duas Libertadores da América e um Mundial de Clubes da FIFA. Grandes ídolos vestiram a camisa rubro-negra, como Zico, o maior de todos os tempos, Júnior, Bebeto, Romário e muitos outros.\n\nO clube não é apenas futebol, mas uma verdadeira nação que une milhões de corações apaixonados pelo Brasil e pelo mundo.",
            "excerpt": "Conheça a rica história do Clube de Regatas do Flamengo, desde sua fundação em 1895 até os dias atuais",
            "category": "História",
            "tags": ["historia", "fundacao", "zico", "tradicao"],
            "image_url": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
    ]
    
    for post_data in sample_posts:
        post_data['slug'] = create_slug(post_data['title'])
        post = Post(**post_data)
        await db.posts.insert_one(post.dict())
    
    return {"message": "Default data initialized successfully"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Blog do Flamengo API"}

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)