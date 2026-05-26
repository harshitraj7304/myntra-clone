import { Link } from 'react-router-dom'
import { BiChevronRight } from 'react-icons/bi'
import ImageWithFallback from '../ui/ImageWithFallback'

function TrendingCategories({ categories }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-black text-slate-950">Trending Categories</h2>
        <p className="text-slate-600">
          Shop from our most popular and best-selling categories
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group relative overflow-hidden rounded-2xl shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="aspect-square overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="mb-2 text-2xl font-black text-white">
                {category.name}
              </h3>
              <p className="flex items-center gap-1 text-sm font-bold text-rose-300">
                {category.productCount} Items
                <BiChevronRight className="transition group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TrendingCategories
