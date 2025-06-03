'use client';

import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/app/components/layout/MainLayout';

type Props = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: Props) {
  // Mock data - in real app would come from API/CMS
  const article = {
    title: "Google Says It Will Appeal Online Search Antitrust Decision",
    author: "Reuters Staff",
    publishDate: "March 25, 2024, 11:42 AM",
    category: "Technology",
    image: "https://www.reuters.com/resizer/hO3Fy0Qe5P_vYQz8oN5-4yqd_Yw=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/T3JXJRAFCJLWBKQD5KQDT4G55M.jpg",
    summary: [
      "Google to appeal federal judge's decision requiring restructuring of its online search business",
      "DOJ wants Google to share search data and end exclusive agreements with smartphone makers",
      "Antitrust concerns extend to Google's advantage in AI products and search monopoly"
    ],
    content: [
      "Google said on Monday it would appeal a federal judge's decision under which the search giant would have to restructure its online search business in a way that could be more extensive than the 10-year regime suggested by antitrust enforcers.",
      "\"We will wait for the Court's opinion. And we strongly believe the Court's original decision was wrong, and we look forward to our eventual appeal,\" Google said in a post on X.",
      "U.S. District Judge Amit Mehta in Washington heard closing arguments on Friday at a trial on proposals to address Google's illegal monopoly in online search and related advertising."
    ],
    quote: {
      text: "We remain committed to providing the best search experience while fostering competition and innovation in the digital marketplace.",
      author: "John Schmidtlein, Google's attorney"
    },
    tags: ["Google", "Antitrust", "Technology", "Legal", "DOJ"],
    stocks: [
      { symbol: "GOOGL", price: "159,300.00", change: -1.18 },
      { symbol: "AAPL", price: "178.14", change: 0.81 }
    ],
    mostRead: [
      { rank: 1, title: "Fed Signals Potential Rate Cut Timeline", reads: "2.5M" },
      { rank: 2, title: "Tesla's New Battery Technology Breakthrough", reads: "1.8M" },
      { rank: 3, title: "Apple's Vision Pro Sales Exceed Expectations", reads: "1.2M" },
      { rank: 4, title: "Nvidia's AI Chip Demand Continues to Surge", reads: "980K" },
      { rank: 5, title: "Microsoft's Cloud Revenue Hits New Record", reads: "875K" }
    ]
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article>
              {/* Article Header */}
              <header className="border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-bold leading-tight mb-4">{article.title}</h1>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-user mr-2"></i>
                    By {article.author}
                  </span>
                  <span className="mx-3">|</span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-2"></i>
                    {article.publishDate}
                  </span>
                  <span className="mx-3">|</span>
                  <span className="flex items-center">
                    <i className="fas fa-folder mr-2"></i>
                    {article.category}
                  </span>
                </div>

                {/* Social Share */}
                <div className="flex gap-3">
                  {['facebook-f', 'twitter', 'linkedin-in', 'envelope', 'link'].map((icon) => (
                    <button
                      key={icon}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                    >
                      <i className={`fab fa-${icon}`}></i>
                    </button>
                  ))}
                </div>

                {/* Article Image */}
                <div className="mt-6 relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt="Article header image"
                    fill
                    className="object-cover"
                  />
                </div>
              </header>

              {/* Article Summary */}
              <div className="bg-gray-50 p-6 my-6 rounded-lg">
                {article.summary.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 mb-3 last:mb-0">
                    <i className="fas fa-circle text-[0.4rem] mt-2 text-blue-600"></i>
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>

              {/* Article Content */}
              <div className="prose max-w-none">
                {article.content.map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                <blockquote className="border-l-4 border-blue-500 pl-4 my-6">
                  <p className="italic text-gray-700">{article.quote.text}</p>
                  <footer className="text-sm text-gray-500 mt-2">— {article.quote.author}</footer>
                </blockquote>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 my-6">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Comments Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-6">Comments</h3>
                
                {/* Comment Form */}
                <div className="mb-8">
                  <textarea 
                    className="w-full p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Share your thoughts..."
                  />
                  <div className="flex justify-end mt-3">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-sm hover:bg-blue-700 text-sm font-medium">
                      Post Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-8">
                  {[
                    {
                      author: "John Smith",
                      time: "1 hour ago",
                      content: "This could have significant implications for the tech industry as a whole. Interesting to see how other companies might adjust their practices.",
                      likes: 24,
                      replies: 3
                    },
                    {
                      author: "Sarah Chen",
                      time: "2 hours ago",
                      content: "The appeal process could take years. Meanwhile, Google's competitors might gain some ground in the search market.",
                      likes: 18,
                      replies: 2
                    }
                  ].map((comment, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-gray-500 text-sm ml-2">{comment.time}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                      <p className="text-gray-700 mb-4">{comment.content}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                          <i className="far fa-thumbs-up"></i>
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                          <i className="far fa-comment"></i>
                          <span>{comment.replies} replies</span>
                        </button>
                        <button className="text-gray-500 hover:text-blue-600">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Comments */}
                <button className="w-full mt-8 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Load More Comments
                </button>
              </div>

              {/* More Articles Section */}
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-6">More Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      image: "https://www.reuters.com/resizer/nKQVSB3qgcOKH-3-0EwEJHF5rw0=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/JCAODZHSWBKRFK4PRQKCC2RKSA.jpg",
                      title: "Fed's Powell Says March Rate Cut Unlikely, Cites Strong Economic Data",
                      category: "Markets",
                      time: "3 hours ago"
                    },
                    {
                      image: "https://www.reuters.com/resizer/q_Ls5NpRuXJc9RQYnFhPYRhO-FY=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/KN7CTXM3PBMRPKQDF7QRZV7ABA.jpg",
                      title: "Apple Vision Pro Sales Slow After Initial Launch Surge",
                      category: "Technology",
                      time: "5 hours ago"
                    },
                    {
                      image: "https://www.reuters.com/resizer/w_Kf4pYz8ljKgQD9L7HJ8qPvBHk=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/IJNQY6YP5NKIXLZ3PYHFGY7K2U.jpg",
                      title: "Tesla's German Factory Halts Production Due to Supply Chain Disruption",
                      category: "Automotive",
                      time: "6 hours ago"
                    }
                  ].map((article, index) => (
                    <div key={index} className="bg-white rounded-sm shadow-sm overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium bg-black text-white px-2 py-1 rounded-sm">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">{article.time}</span>
                        </div>
                        <h4 className="font-medium text-base hover:text-blue-600 line-clamp-2">
                          <Link href="#">{article.title}</Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stocks Mentioned */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Stocks in this Article</h3>
              <div className="space-y-2">
                {article.stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between bg-black text-white p-3 rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{stock.symbol}</span>
                      <span className="font-mono">{stock.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
                      </span>
                      <button className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-sm hover:bg-white/30">
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Read */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Most Read</h3>
              <div className="space-y-4">
                {article.mostRead.map((item) => (
                  <div key={item.rank} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <span className="text-2xl font-semibold text-blue-600 opacity-50">{item.rank}</span>
                    <div>
                      <h4 className="text-sm font-medium hover:text-blue-600">
                        <Link href="#">{item.title}</Link>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 