import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Category = lazy(() => import('./pages/Category'));
const Search = lazy(() => import('./pages/Search'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Helmet>
            <title>Blog do Flamengo - Mengão de Coração</title>
            <meta name="description" content="O maior blog do Flamengo! Notícias, história, jogadores e tudo sobre o Clube de Regatas do Flamengo." />
            <meta name="keywords" content="flamengo, mengão, futebol, brasileiro, notícias, história" />
            <meta property="og:title" content="Blog do Flamengo - Mengão de Coração" />
            <meta property="og:description" content="O maior blog do Flamengo! Notícias, história, jogadores e tudo sobre o Clube de Regatas do Flamengo." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="canonical" href="https://rubro-negro-blog.preview.emergentagent.com" />
          </Helmet>
          
          <Header />
          
          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post/:slug" element={<PostDetail />} />
                <Route path="/category/:categorySlug" element={<Category />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;