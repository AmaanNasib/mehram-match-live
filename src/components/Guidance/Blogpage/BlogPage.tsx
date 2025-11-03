import React, { useState, useEffect, useRef } from "react";
import Footer from "../../sections/Footer";
import Navbar from "../../sections/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import "./blog.css";
import dua from "../../../images/img2.jpg";
import dua2 from "../../../images/img1.jpg";
import dua1 from "../../../images/img2.jpg";
import dua3 from "../../../images/tr1.svg";  
import dua4 from "../../../images/img4.jpg";
import { blogData, getBlogByTitle } from "../blogData";

import ReactPaginate from "react-paginate";

const BlogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title");

  const [currentPage, setCurrentPage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const itemsPerPage = 6;
  
  // Use imported blog data
  const blogDataInner = blogData;
  // Pagination Logic
  const pageCount = Math.ceil(blogDataInner.length / itemsPerPage);
  const startOffset = currentPage * itemsPerPage;
  const paginatedData = blogDataInner.slice(
    startOffset,
    startOffset + itemsPerPage
  );

  useEffect(() => {
    // Scroll to the top when the component loads
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures it runs once after the component mounts

  // Filter blog data based on the title query parameter
  const selectedBlog = getBlogByTitle(title);

  // Share functionality
  const shareUrl = window.location.href;
  const shareTitle = selectedBlog?.title || "Islamic Guidance Article";
  const shareText = selectedBlog?.paragraph1?.substring(0, 100) + "..." || "Read this insightful Islamic guidance article";

  const shareToSocial = async (platform) => {
    // Prefer Native Web Share API on mobile for generic share
    if (platform === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
          setShowShareModal(false);
          return;
        } catch (_) {
          // user cancelled or share failed – fall back to modal
          setShowShareModal(true);
          return;
        }
      }
      // If native not supported, open modal with platform options
      setShowShareModal(true);
      return;
    }

    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);

    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
        break;
      case 'reddit':
        url = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        setShowShareModal(false);
        return;
      default:
        return;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setShowShareModal(false);
    }
  };

  // Emphasize Prophet mentions with bold styling by injecting simple HTML
  const formatContent = (text?: string) => {
    const replacements: Array<[RegExp, string]> = [
      [/The Prophet Muhammad\s*صلى الله عليه وسلم/g, '<strong>The Prophet Muhammad صلى الله عليه وسلم</strong>'],
      [/Prophet Muhammad\s*صلى الله عليه وسلم/g, '<strong>Prophet Muhammad صلى الله عليه وسلم</strong>'],
      [/The Prophet\s*صلى الله عليه وسلم/g, '<strong>The Prophet صلى الله عليه وسلم</strong>'],
      [/\bAllah\b/g, '<strong>Allah</strong>'],
      [/\bALLAH\b/g, '<strong>ALLAH</strong>'],
      [/Qur['’`]?an/gi, '<strong>Qur\'an</strong>'],
    ];
    let html = text || '';
    replacements.forEach(([pattern, repl]) => {
      html = html.replace(pattern, repl);
    });
    // If a quote appears right after a colon, push it to next line
    html = html.replace(/:\s*"/g, ':<br/>"');
    // Quoted statements as blockquotes with citation retained on same line
    html = html.replace(/(^|>|\n)\s*"([^"\n]+)"(\s*\([^)]*\))?/g, '$1<blockquote class="mm-quote">“$2”$3</blockquote>');
    // Parentheses bold only
    html = html.replace(/\(([^)]+)\)/g, '(<strong>$1</strong>)');
    return { __html: html };
  };

  return (
    <>
      <Navbar isLogIn={false} setLogin={() => {}} login={false} />

      <div className="blog-content relative text-black overflow-hidden bg-gradient-to-r from-white to-pink-100">
        <section className="container mx-auto pt-20 pb-20 px-4 sm:px-6 z-50 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-[95%]">
          {/* {selectedBlog ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <p className="text-4xl sm:text-5xl font-bold font-['Poppins'] text-black">
                {selectedBlog.title}
              </p>

              {selectedBlog.content.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-red-500">Blog not found</p>
          )} */}

 <div className="sideBarBlog w-full lg:w-1/3 order-2 lg:order-1">
          <h1 className="text-xl sm:text-2xl font-bold accent-underline mb-3">Recent Post</h1>
          <div className="recent-card hover-lift overflow-hidden ">
            <img src={dua1} alt="Image" className="w-full h-48 object-cover px-2 " />

            <div className="p-4">
            
              <p className="text-sm text-gray-500">1 Jan 2025</p>
              <div style={{display:"flex"}}>
              <h2 className="text-lg font-semibold mb-2 title w-[25rem]">
                Is Celebrating Shab-E-Barat Bid'ah?
              </h2>
              <img style={{height :"1rem",width : "1rem" }} src={dua3} alt="" />

              </div>
              <p className="text-gray-700 prose-body" style={{fontFamily : `"Raleway", serif`}}>
                Shab-E Barat holds great significance in many Islamic
                traditions. It is often viewed as a night of forgiveness and
                mercy, where individuals seek divine blessings. Despite its
                spiritual importance, some argue that practices surrounding
                Shab-E Barat have no basis in authentic teachings of Islam. This
                has led to debates about its classification as Bid’ah
                (innovation). Exploring its roots, it is evident that cultural
                influences have shaped how this night is observed. Understanding
                Shab-E Barat’s significance requires delving into both its
                historical context and the practices promoted by religious
                scholars.
              </p>
            </div>
          </div>
          <div className="recent-card hover-lift overflow-hidden mt-4 ">
            <img src={dua2} alt="Image" className="w-full h-48 object-cover px-2 " />

            <div className="p-4">
              <p className="text-sm text-gray-500">1 Jan 2025</p>
              <div style={{display:"flex"}}>
              <h2 className="text-lg font-semibold mb-2 title w-[25rem]">
                Is Celebrating Shab-E-Barat Bid'ah?
              </h2>
              <img style={{height :"1rem",width : "1rem" }} src={dua3} alt="" />

              </div>
              <p className="text-gray-700 prose-body" style={{fontFamily : `"Raleway", serif`}}>
                Shab-E Barat holds great significance in many Islamic
                traditions. It is often viewed as a night of forgiveness and
                mercy, where individuals seek divine blessings. Despite its
                spiritual importance, some argue that practices surrounding
                Shab-E Barat have no basis in authentic teachings of Islam. This
                has led to debates about its classification as Bid’ah
                (innovation). Exploring its roots, it is evident that cultural
                influences have shaped how this night is observed. Understanding
                Shab-E Barat’s significance requires delving into both its
                historical context and the practices promoted by religious
                scholars.
              </p>
            </div>
          </div>
         
</div>
           {selectedBlog ? (
             <div className="gaidance-container w-full lg:w-2/3 order-1 lg:order-2">
               {/* Modern Article Header */}
               <div className="article-header">
                 <h1 className="article-title">
                   {selectedBlog.title}
                 </h1>
                 <div className="article-meta">
                   <span className="meta-badge">📖 Islamic Guidance</span>
                   <span>•</span>
                   <span>5 min read</span>
                   <span>•</span>
                   <span>Jan 1, 2025</span>
                 </div>
                 {/* Mobile quick share using native API */}
                 <div className="mobile-native-share">
                   <button
                     className="native-share-btn"
                     onClick={() => shareToSocial('native')}
                   >
                     Share
                   </button>
                 </div>
               </div>

               {/* Content Section 1 */}
              <div className="content-section">
                <div className="section-image">
                   <img
                     className="w-full max-h-[500px] sm:max-h-[420px] md:max-h-[480px] h-auto object-cover"
                     src={dua}
                     alt=""
                   />
                 </div>
                <h3 className="section-title flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600">🌙</span>
                  <span> {selectedBlog.sub1}</span>
                </h3>
                <p
                  className="section-content"
                  style={{fontFamily : `"Raleway", serif`}}
                  dangerouslySetInnerHTML={formatContent(selectedBlog.paragraph1)}
                />
               </div>

               {/* Content Section 2 */}
              <div className="content-section">
                 <div className="section-image">
                   <img
                     className="w-full max-h-[500px] sm:max-h-[420px] md:max-h-[480px] h-auto object-cover"
                     src={dua4}
                     alt=""
                   />
                 </div>
                <h3 className="section-title flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">🌍</span>
                  <span> {selectedBlog.sub2}</span>
                </h3>
                {selectedBlog?.benefits?.length ? (
                  <div className="mt-3 space-y-2">
                    {selectedBlog.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3 text-base leading-relaxed" style={{fontFamily : `"Raleway", serif`}}>
                        <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600">•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                    <p
                      className="section-content mt-3"
                      style={{fontFamily : `"Raleway", serif`}}
                      dangerouslySetInnerHTML={formatContent(selectedBlog.paragraph2.split('Delaying marriage')[1] ? 'Delaying marriage may increase stress, temptation, and the risk of unhealthy attachments. Muslim marriage advice emphasizes starting life together on a halal and blessed foundation.' : '')}
                    />
                  </div>
                ) : (
                  <p
                    className="section-content"
                    style={{fontFamily : `"Raleway", serif`}}
                    dangerouslySetInnerHTML={formatContent(selectedBlog.paragraph2)}
                  />
                )}
               </div>

              {/* Practical Tips */}
              {selectedBlog?.tips?.length ? (
                <div className="content-section">
                  <h3 className="section-title flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">💡</span>
                    <span> Practical Tips</span>
                  </h3>
                  <div className="mt-3 space-y-2">
                    {selectedBlog.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-base leading-relaxed" style={{fontFamily : `"Raleway", serif`}}>
                        <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">✓</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Conclusion */}
              {selectedBlog?.conclusion ? (
                <div className="content-section">
                  <h3 className="section-title flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">✅</span>
                    <span> Conclusion</span>
                  </h3>
                  <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p
                      className="section-content m-0"
                      style={{fontFamily : `"Raleway", serif`}}
                      dangerouslySetInnerHTML={formatContent(selectedBlog.conclusion)}
                    />
                  </div>
                </div>
              ) : null}

               {/* Floating Action Buttons */}
               <div className="floating-elements">
                 <button 
                   className="floating-btn" 
                   title="Share Article"
                   onClick={() => setShowShareModal(true)}
                 >
                   <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                   </svg>
                 </button>
                 <button 
                   className="floating-btn" 
                   title="Back to Top"
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                 >
                   <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                   </svg>
                 </button>
               </div>
             </div>
          ) : (
            <p className="text-center text-lg text-red-500">Blog not found</p>
          )}
        </section>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName="pagination-container"
          activeClassName="selected" // Update this to "selected"
        />

        <Footer />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Article</h3>
              <button 
                className="close-btn"
                onClick={() => setShowShareModal(false)}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            
            {/* Native share button (if supported) */}
            {/* <div className="native-share-row">
              <button className="native-share-cta" onClick={() => shareToSocial('native')}>
                📲 Share using phone apps
              </button>
            </div> */}
            
            <div className="share-platforms">
              <button 
                className="share-platform-btn facebook"
                onClick={() => shareToSocial('facebook')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              <button 
                className="share-platform-btn twitter"
                onClick={() => shareToSocial('twitter')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </button>

              <button 
                className="share-platform-btn whatsapp"
                onClick={() => shareToSocial('whatsapp')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              <button 
                className="share-platform-btn telegram"
                onClick={() => shareToSocial('telegram')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>Telegram</span>
              </button>

              <button 
                className="share-platform-btn linkedin"
                onClick={() => shareToSocial('linkedin')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </button>

              <button 
                className="share-platform-btn email"
                onClick={() => shareToSocial('email')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email</span>
              </button>

              <button 
                className="share-platform-btn copy"
                onClick={() => shareToSocial('copy')}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPage;
