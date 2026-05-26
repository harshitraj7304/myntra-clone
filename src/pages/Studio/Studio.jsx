import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShare2, FiMessageCircle, FiEye, FiShoppingBag, FiBookmark } from 'react-icons/fi'
import { products } from '../../data/products'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

const CREATOR_POSTS = [
  {
    id: 1,
    creator: {
      name: 'Riya Sharma',
      username: 'riya_style_edit',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      followers: '84.2K'
    },
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    title: 'Floral Summer Chic 🌸',
    description: 'Breezy straight fits and floral accents are this summer\'s absolute best vibes. Paired with minimalist gold accessories!',
    likes: 1245,
    comments: 84,
    taggedProduct: products.find((p) => p.id === 6) // Floral summer dress
  },
  {
    id: 2,
    creator: {
      name: 'Kabir Mehta',
      username: 'kabir_wear',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      followers: '112K'
    },
    image: 'https://images.unsplash.com/photo-1552062407-291826ab63d3?auto=format&fit=crop&w=600&q=80',
    title: 'Office to Diner Smart Casual 💼',
    description: 'Perfect crisp formal shirt and neutral chinos setup. Pro-tip: Keep the top buttons open and cuffs slightly rolled up.',
    likes: 984,
    comments: 42,
    taggedProduct: products.find((p) => p.id === 18) // Men formal shirt
  },
  {
    id: 3,
    creator: {
      name: 'Aisha Sen',
      username: 'aisha_looks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      followers: '45.7K'
    },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    title: 'Streetwear & Sneakers 🔥',
    description: 'Comfort is king! Training sneakers paired with oversized cargo sets. Keep grinding in high-performance style.',
    likes: 2154,
    comments: 167,
    taggedProduct: products.find((p) => p.id === 2) // Sports sneakers
  }
]

function Studio() {
  useDocumentTitle('Myntra Studio — Creator Outfits & Style Guides')
  const [posts, setPosts] = useState(
    CREATOR_POSTS.map((post) => ({ ...post, isLiked: false, isSaved: false }))
  )

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  const handleSave = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, isSaved: !post.isSaved } : post))
    )
  }

  return (
    <div className="bg-[#f5f5f6] min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Editorial Title Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 p-8 text-white shadow-lg text-center md:text-left md:flex md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider">
              ✨ STUDIO EDITORIAL
            </span>
            <h1 className="text-3xl font-black tracking-tight leading-none">MYNTRA STUDIO</h1>
            <p className="text-xs font-semibold text-rose-100 max-w-md">
              Browse top trending creator outfits, get inspired by modern styling guides, and shop real outfits instantly!
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex justify-center gap-3 shrink-0">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold">
              <FiEye /> 250K+ Views Today
            </span>
          </div>
        </div>

        {/* Creator Feed Cards */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              
              {/* Creator Info Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-rose-500/30">
                    <ImageWithFallback src={post.creator.avatar} alt={post.creator.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 leading-none">{post.creator.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">@{post.creator.username} • {post.creator.followers} followers</p>
                  </div>
                </div>
                <button className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition">
                  Follow
                </button>
              </div>

              {/* Feed Image Layout */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
                <ImageWithFallback
                  src={post.image}
                  backupImages={post.backupImages}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Float tagged product card */}
                {post.taggedProduct && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-3.5 shadow-xl backdrop-blur-md border border-white/20 transform transition-transform duration-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 rounded overflow-hidden bg-slate-200 shrink-0">
                        <ImageWithFallback
                          src={post.taggedProduct.image}
                          backupImages={post.taggedProduct.backupImages}
                          alt={post.taggedProduct.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-black text-slate-950 uppercase">{post.taggedProduct.brand}</p>
                        <p className="text-slate-600 truncate max-w-[180px]">{post.taggedProduct.name}</p>
                        <p className="font-bold text-slate-950 mt-0.5">₹{post.taggedProduct.price}</p>
                      </div>
                    </div>

                    <Link
                      to={`/product/${post.taggedProduct.id}`}
                      className="rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2.5 text-xs font-black uppercase text-white shadow-md hover:shadow-lg flex items-center gap-1.5 transition active:scale-95 shrink-0"
                    >
                      <FiShoppingBag /> Shop Look
                    </Link>
                  </div>
                )}
              </div>

              {/* Engagement Panel & Content */}
              <div className="p-5 space-y-4">
                
                {/* Buttons row */}
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition hover:text-rose-600 ${
                        post.isLiked ? 'text-[#ff3f6c]' : ''
                      }`}
                    >
                      <FiHeart size={18} className={post.isLiked ? 'fill-[#ff3f6c]' : ''} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-xs font-bold transition hover:text-rose-600">
                      <FiMessageCircle size={18} />
                      <span>{post.comments} Comments</span>
                    </button>
                    
                    <button className="flex items-center gap-1.5 text-xs font-bold transition hover:text-rose-600">
                      <FiShare2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-1 text-xs font-bold transition hover:text-rose-600 ${
                      post.isSaved ? 'text-[#ff3f6c]' : ''
                    }`}
                  >
                    <FiBookmark size={18} className={post.isSaved ? 'fill-[#ff3f6c]' : ''} />
                  </button>
                </div>

                {/* Text section */}
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900 leading-tight">{post.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-600">{post.description}</p>
                </div>

              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Studio
