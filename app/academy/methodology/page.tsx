'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { useTheme } from '@/app/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { methodologyApi, Article, ArticleListItem } from '@/api/v1/methodology/service';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

// Interface for table of contents
interface TableOfContentsItem {
  level: number;
  text: string;
  id: string;
}

// Interface for grouped articles
interface ArticleSection {
  id: string;
  title: string;
  articles: {
    id: string | number;
    title: string;
    excerpt?: string;
  }[];
}

// Interface for selected article
interface SelectedArticle {
  title: string;
  articleId: string | number;
}

// Function to extract table of contents from markdown content
const extractTableOfContents = (content: string): TableOfContentsItem[] => {
  const headings: TableOfContentsItem[] = [];
  const h2Regex = /^## (.*$)/gm;
  const h3Regex = /^### (.*$)/gm;
  const h4Regex = /^#### (.*$)/gm;
  
  // Helper function to clean markdown for ID generation
  const cleanMarkdownForId = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
      .replace(/`(.*?)`/g, '$1')       // Remove code markers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove link markers
      .replace(/[^\w\s-]/g, '')        // Remove special characters
      .toLowerCase()
      .replace(/\s+/g, '-');           // Replace spaces with hyphens
  };
  
  let match;
  
  // Extract h2 headings
  while ((match = h2Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 2, text, id });
  }
  
  // Extract h3 headings
  while ((match = h3Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 3, text, id });
  }
  
  // Extract h4 headings
  while ((match = h4Regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = cleanMarkdownForId(text);
    headings.push({ level: 4, text, id });
  }
  
  return headings;
};

// Throttle function to limit how often a function can be called
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

// Transform API articles into ArticleSection structure
const transformArticlesToSections = (articles: ArticleListItem[]): {
  ungroupedArticles: ArticleListItem[];
  groupedSections: ArticleSection[];
} => {
  // First, separate articles with empty group_name
  const ungroupedArticles = articles.filter(article => !article.group_name || article.group_name.trim() === '');
  const groupedArticlesArray = articles.filter(article => article.group_name && article.group_name.trim() !== '');
  
  // Group the remaining articles by group_name
  const groupedArticlesMap: Record<string, ArticleListItem[]> = {};
  groupedArticlesArray.forEach(article => {
    const groupName = article.group_name as string; // We've filtered out empty group_names
    if (!groupedArticlesMap[groupName]) {
      groupedArticlesMap[groupName] = [];
    }
    groupedArticlesMap[groupName].push(article);
  });
  
  // Create grouped sections
  const groupedSections: ArticleSection[] = [];
  
  // Add grouped articles to sections
  Object.entries(groupedArticlesMap).forEach(([groupName, groupArticles]) => {
    // Generate a URL-friendly ID from the group name
    const id = groupName.toLowerCase().replace(/\s+/g, '-');
    
    groupedSections.push({
      id,
      title: groupName,
      articles: groupArticles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: '' // API doesn't provide excerpts
      }))
    });
  });
  
  return {
    ungroupedArticles,
    groupedSections
  };
};

export default function MethodologyPage() {
  const { isDark } = useTheme();
  const [selectedArticle, setSelectedArticle] = useState<SelectedArticle>({
    title: '',
    articleId: ''
  });
  const [articleContent, setArticleContent] = useState<string>('');
  const [articleTitle, setArticleTitle] = useState<string>('');
  const [ungroupedArticles, setUngroupedArticles] = useState<ArticleListItem[]>([]);
  const [groupedSections, setGroupedSections] = useState<ArticleSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Table of contents state
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState({ top: '0px', height: '0px' });
  const contentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const tocItemsRef = useRef<Record<string, HTMLElement>>({});
  
  // Store article previews - map article IDs to their content
  const [articlePreviews, setArticlePreviews] = useState<Record<string | number, string>>({});
  
  // Helper function to create a text excerpt
  const createExcerpt = (content: string, maxLength: number = 150): string => {
    if (!content) return 'No content available';
    
    return content
      .replace(/[#*`_~|<>]/g, '')  // Remove markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Replace markdown links with just the text
      .replace(/\n+/g, ' ')  // Replace newlines with spaces
      .substring(0, maxLength) + '...';
  };

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const articleList = await methodologyApi.getArticlesList();
      console.log('Fetched article list:', articleList);
      
      // Transform API articles into sections
      const { ungroupedArticles: ungrouped, groupedSections: grouped } = transformArticlesToSections(articleList);
      
      // Set the article sections
      setUngroupedArticles(ungrouped);
      setGroupedSections(grouped);
      
      // Set first article as selected if available
      if (ungrouped.length > 0) {
        const firstArticle = ungrouped[0];
        // Ensure the article ID is valid
        if (firstArticle && firstArticle.id !== undefined && firstArticle.id !== null) {
          console.log('Setting initial selected article:', firstArticle.id);
          setSelectedArticle({
            title: firstArticle.title,
            articleId: firstArticle.id
          });
          fetchArticleContent(firstArticle.id);
        }
      } else if (grouped.length > 0 && grouped[0].articles.length > 0) {
        const firstArticle = grouped[0].articles[0];
        // Ensure the article ID is valid
        if (firstArticle && firstArticle.id !== undefined && firstArticle.id !== null) {
          console.log('Setting initial selected article:', firstArticle.id);
          setSelectedArticle({
            title: grouped[0].title,
            articleId: firstArticle.id
          });
          fetchArticleContent(firstArticle.id);
        }
      }
      
      setUsingMockData(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles. Please try again later.');
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Find the selected article content
  const fetchArticleContent = async (articleId: string | number) => {
    setLoading(true);
    setError(null);
    
    // Validate article ID
    if (articleId === null || 
        articleId === undefined || 
        articleId === 'NaN' || 
        (typeof articleId === 'string' && articleId.toLowerCase() === 'nan') ||
        (typeof articleId === 'number' && isNaN(articleId))) {
      console.error('Invalid article ID detected in fetchArticleContent:', articleId);
      setError('Invalid article ID');
      setLoading(false);
      return;
    }
    
    try {
      // Use the methodologyApi which handles both numeric and string IDs
      console.log('Fetching article with ID:', articleId);
      // Explicitly cast to Article type to access content property
      const articleData = await methodologyApi.getArticle(articleId) as Article;
      console.log('Fetched article:', articleData);
      setArticleContent(articleData.content || '');
      setArticleTitle(articleData.title);
      
      // Store article preview for this ID
      setArticlePreviews(prev => ({
        ...prev,
        [articleId]: articleData.content || ''
      }));
    } catch (err) {
      console.error('Error fetching article content:', err);
      setError('Failed to load article content');
      setArticleContent('');
      setArticleTitle('Article Not Found');
    } finally {
      setLoading(false);
    }
  };
  
  // Extract table of contents when article content changes
  useEffect(() => {
    if (articleContent) {
      const toc = extractTableOfContents(articleContent);
      setTableOfContents(toc);
      
      // Set first heading as active by default
      if (toc.length > 0) {
        setActiveHeading(toc[0].id);
      } else {
        setActiveHeading('');
      }
      
      // Reset TOC item refs
      tocItemsRef.current = {};
    }
  }, [articleContent]);

  // Store references to TOC items after render
  useEffect(() => {
    // Wait for the TOC items to be rendered
    setTimeout(() => {
      tableOfContents.forEach(heading => {
        const element = document.getElementById(`toc-${heading.id}`);
        if (element) {
          tocItemsRef.current[heading.id] = element;
        }
      });
      
      // Update indicator position for initial active heading
      if (activeHeading && tocItemsRef.current[activeHeading]) {
        updateIndicatorPosition(activeHeading);
      }
    }, 500);
  }, [tableOfContents]);

  // Update indicator style when active heading changes
  useEffect(() => {
    if (activeHeading && tocItemsRef.current[activeHeading]) {
      updateIndicatorPosition(activeHeading);
    }
  }, [activeHeading]);

  // Monitor scroll position to update active heading
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = throttle(() => {
      if (tableOfContents.length === 0) return;
      const visibleHeading = findMostVisibleHeading();
      if (visibleHeading && visibleHeading !== activeHeading) {
        setActiveHeading(visibleHeading);
      }
    }, 100);

    // Listen for scroll events on both the content div and the window
    content.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      content.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tableOfContents, activeHeading]);

  const updateIndicatorPosition = (headingId: string) => {
    const tocItem = tocItemsRef.current[headingId];
    if (!tocItem || !tocRef.current) return;
    
    const itemRect = tocItem.getBoundingClientRect();
    const tocRect = tocRef.current.getBoundingClientRect();
    
    // Calculate relative position
    const top = itemRect.top - tocRect.top;
    const height = itemRect.height;
    
    setIndicatorStyle({
      top: `${top}px`,
      height: `${height}px`
    });
  };

  const findMostVisibleHeading = () => {
    if (!contentRef.current) return '';
    
    const headings: {id: string, visibility: number}[] = [];
    
    // Find all heading elements in the content
    tableOfContents.forEach(toc => {
      const id = toc.id;
      const element = document.getElementById(id);
      
      if (element) {
        // Calculate how much of the element is visible in the viewport
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate visibility percentage
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, windowHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;
        
        headings.push({ id, visibility });
      }
    });
    
    // Sort by visibility (most visible first)
    headings.sort((a, b) => b.visibility - a.visibility);
    
    // Return the most visible heading
    return headings.length > 0 ? headings[0].id : '';
  };

  const scrollToHeading = (headingId: string) => {
    const heading = document.getElementById(headingId);
    
    if (heading) {
      // Scroll to the heading with a small offset
      window.scrollTo({
        top: heading.offsetTop - 100,
        behavior: 'smooth'
      });
      
      // Update active heading
      setActiveHeading(headingId);
    }
  };

  // Fetch article content when selected article changes
  useEffect(() => {
    if (selectedArticle.articleId) {
      fetchArticleContent(selectedArticle.articleId);
    }
  }, [selectedArticle]);

  // Toggle section expansion
  const toggleSection = (sectionId: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Render the markdown content
  const renderMarkdown = (content: string): JSX.Element => {
    // Check if content contains HTML tags
    const containsHTML = /<[a-z][\s\S]*>/i.test(content);
    
    if (containsHTML) {
      // If content contains HTML, sanitize it with DOMPurify before rendering
      const sanitizedHTML = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'] // Allow target attribute for links
      });
      
      return (
        <div 
          className="markdown-content" 
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      );
    }
    
    // For markdown content, use ReactMarkdown with remarkGfm plugin
    return (
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Render the article list
  const renderArticleList = () => {
    if (loading && ungroupedArticles.length === 0) {
      return (
        <div className="flex justify-center my-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
        </div>
      );
    }

    if (ungroupedArticles.length === 0) {
      return (
        <div className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No articles found.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {ungroupedArticles.map(article => (
          <div 
            key={article.id} 
            className={`p-3 rounded-lg cursor-pointer ${
              selectedArticle.articleId === article.id ? 
              (isDark ? 'bg-gray-700' : 'bg-gray-100') : 
              (isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50')
            }`}
            onClick={() => setSelectedArticle({
              title: article.title,
              articleId: article.id
            })}
          >
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {article.title}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {articlePreviews[article.id] 
                ? createExcerpt(articlePreviews[article.id], 80)
                : 'Loading preview...'}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/academy" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:underline flex items-center`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Academy
            </Link>
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Methodology Articles
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Learn about our investment methodologies and analysis frameworks
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-md ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} mb-6`}>
            {error}
          </div>
        )}

        {usingMockData && (
          <div className={`p-4 rounded-md ${isDark ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} mb-6`}>
            Using mock data - API is not available
        </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar (Articles) */}
          <div className="md:col-span-3">
            <aside className={`sidebar p-4 rounded-lg sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-bold mb-4">Article Library</h2>
            
              <div className="space-y-4">
                {/* Articles List */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Articles</h3>
                  {renderArticleList()}
                </div>
                
                {/* Article Sections */}
                <div>
                  {groupedSections.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-2">Categories</h3>
                      <div className="space-y-2">
                        {groupedSections.map(section => (
                          <div key={section.id} className="mb-2">
                            {/* Section Header */}
                            <div
                              className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                              onClick={() => toggleSection(section.id)}
                            >
                              <span className="font-medium text-sm">{section.title}</span>
                              <span>{expandedSections[section.id] ? '−' : '+'}</span>
                            </div>
                            
                            {/* Section Articles */}
                            {expandedSections[section.id] && (
                              <ul className="ml-3 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-600">
                                {section.articles.map(article => (
                                  <li key={`grouped-${article.id}`} className="relative">
                                    <button
                                      className={`block w-full text-left pl-4 py-2 text-sm ${
                                        selectedArticle.articleId === article.id ? 
                                        'font-semibold' : 'opacity-80 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => setSelectedArticle({
                                        title: section.title,
                                        articleId: article.id
                                      })}
                                    >
                                      {article.title}
                                      {articlePreviews[article.id] && (
                                        <span className="block text-xs opacity-70 mt-1 pr-2">
                                          {createExcerpt(articlePreviews[article.id], 80)}
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Article Content */}
              <div className="md:col-span-9" ref={contentRef}>
                {loading ? (
                  <div className="flex justify-center my-8">
                    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
                  </div>
                ) : (
                  <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {articleTitle}
                        </h1>
                      </div>
                      
                      <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                        {renderMarkdown(articleContent)}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="md:col-span-3">
                  <div className={`p-4 rounded-lg sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
                    
                    <div ref={tocRef} className="relative">
                      {/* Active indicator */}
                      <div 
                        className={`absolute left-0 w-0.5 transition-all duration-100 ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} 
                        style={{ 
                          top: indicatorStyle.top, 
                          height: indicatorStyle.height 
                        }}
                      />
                      
                      <ul className="space-y-2">
                        {tableOfContents.map(heading => (
                          <li 
                            key={heading.id}
                            id={`toc-${heading.id}`}
                            className={`pl-${heading.level} cursor-pointer`}
                          >
                            <button
                              className={`block text-left pl-3 py-1 text-sm rounded ${
                                activeHeading === heading.id ?
                                `font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}` :
                                `${isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'}`
                              }`}
                              onClick={() => scrollToHeading(heading.id)}
                              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                            >
                              {heading.text}
                            </button>
                </li>
                        ))}
              </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 