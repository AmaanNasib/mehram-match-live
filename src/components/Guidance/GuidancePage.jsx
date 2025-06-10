import { useState } from 'react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import Banner from './Banner';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';

const allBlogs = [
  {
    title: 'Choosing Your Career Path',
    slug: 'choosing-your-career-path',
    desc: 'Explore tips and advice for a fulfilling career.',
    date: 'April 10, 2025',
    img: '/blog1.jpg'
  },
  {
    title: 'Study Hacks for Success',
    slug: 'study-hacks-for-success',
    desc: 'Improve your learning with these techniques.',
    date: 'April 12, 2025',
    img: '/blog2.jpg'
  },
  {
    title: 'Productivity in Student Life',
    slug: 'productivity-in-student-life',
    desc: 'Balance study and life efficiently.',
    date: 'April 15, 2025',
    img: '/blog3.jpg'
  },
];

export default function GuidancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const lastIndex = currentPage * blogsPerPage;
  const firstIndex = lastIndex - blogsPerPage;
  const currentBlogs = allBlogs.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);

  const top3Blogs = allBlogs.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Banner blogs={top3Blogs} />
      </motion.div>

      <motion.div
        className="w-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {currentBlogs.map((b, i) => (
          <Link key={i} to={`/guidance/${b.slug}`}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <BlogCard title={b.title} desc={b.desc} date={b.date} img={b.img} />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </motion.div>
    </div>
  );
}
