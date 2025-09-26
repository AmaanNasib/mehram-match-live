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

import ReactPaginate from "react-paginate";

const BlogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const blogDataInner = [
    {
      title: "Is celebrating Shab-E Barat Bid’ah?",
      sub1: "Understanding Shab-E Barat",
      paragraph1:
        "Shab-E Barat holds great significance in many Islamic traditions. It is often viewed as a night of forgiveness and mercy, where individuals seek divine blessings. Despite its spiritual importance, some argue that practices surrounding Shab-E Barat have no basis in authentic teachings of Islam. This has led to debates about its classification as Bid’ah (innovation). Exploring its roots, it is evident that cultural influences have shaped how this night is observed. Understanding Shab-E Barat’s significance requires delving into both its historical context and the practices promoted by religious scholars.",
      image1: "/path/to/image1.jpg",
      sub2: "The Significance and Practices",
      paragraph2:
        "In modern times, the observance of Shab-E Barat has sparked controversy among Islamic scholars and practitioners. Some believe it is a time for increased devotion and reflection, while others view it as an innovation not rooted in the Quran or Hadith. Cultural practices, such as lighting lamps or distributing sweets, often overshadow the spiritual intent of the night. This divergence in perspectives highlights the need for a balanced approach. While traditions can enrich religious experiences, understanding their origins and adhering to authentic teachings remains crucial.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Benefits of Regular Exercise",
      sub1: "Physical Benefits",
      paragraph1:
        "Engaging in regular exercise has countless benefits for physical health. It strengthens the cardiovascular system, reduces the risk of chronic diseases such as diabetes and hypertension, and enhances overall endurance. Exercise helps in building muscle mass and maintaining a healthy weight, which contributes to better mobility and longevity. Activities like jogging, swimming, or strength training not only improve physical fitness but also promote bone density and joint health. A consistent exercise routine ensures that the body functions at its optimum level, reducing the likelihood of illnesses and injuries.",
      image1: "/path/to/image1.jpg",
      sub2: "Mental Health Benefits",
      paragraph2:
        "Exercise is a powerful tool for boosting mental health and emotional stability. Physical activities stimulate the release of endorphins, commonly known as 'feel-good' hormones, which enhance mood and reduce stress levels. Regular exercise has been proven to alleviate symptoms of anxiety and depression, offering a natural remedy to improve mental well-being. Additionally, activities like yoga and tai chi combine physical movement with mindfulness, creating a holistic approach to emotional balance. Incorporating exercise into daily life can foster resilience, increase focus, and improve overall quality of life.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "Understanding Climate Change",
      sub1: "What is Climate Change?",
      paragraph1:
        "Mental health awareness is vital for creating a society where individuals feel comfortable seeking help without fear of judgment. Historically, mental health issues have been stigmatized, leading to reluctance in addressing them openly. Education and advocacy play a crucial role in breaking this stigma. Schools, workplaces, and communities must work together to normalize discussions around mental well-being. Campaigns that highlight personal stories and provide resources can make a significant impact. Acknowledging mental health as an integral part of overall health encourages proactive care and fosters a supportive environment.",
      image1: "/path/to/image1.jpg",
      sub2: "Causes and Solutions",
      paragraph2:
        "Access to mental health resources is a critical component of improving mental well-being. Many individuals face barriers such as cost, lack of awareness, or limited availability of professional support. Governments and organizations must prioritize funding for mental health programs, ensuring that support is accessible to all, regardless of socioeconomic status. Online platforms and telehealth services are emerging as valuable tools to bridge the gap. By promoting accessibility and providing diverse resources, society can empower individuals to take control of their mental health and lead fulfilling lives.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Art of Mindful Living",
      sub1: "What is Mindfulness?",
      paragraph1:
        "Mindfulness is the practice of being fully present and engaged in the moment without distraction. It encourages awareness of thoughts, feelings, and surroundings, helping individuals live a more peaceful and intentional life.",
      image1: "/path/to/image1.jpg",
      sub2: "Benefits of Mindful Living",
      paragraph2:
        "By practicing mindfulness, individuals can reduce stress, improve focus, and foster a sense of gratitude. It promotes emotional resilience and strengthens interpersonal relationships.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Power of Healthy Eating",
      sub1: "Nourishing Your Body",
      paragraph1:
        "Healthy eating is more than just counting calories; it's about consuming nutrient-rich foods. A balanced diet supports energy levels, improves immunity, and reduces the risk of chronic illnesses.",
      image1: "/path/to/image1.jpg",
      sub2: "Cultivating Good Habits",
      paragraph2:
        "Adopting healthy eating habits involves planning meals, avoiding processed foods, and prioritizing fresh ingredients. These small changes lead to long-term health benefits.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Importance of Financial Literacy",
      sub1: "Understanding Money Management",
      paragraph1:
        "Financial literacy empowers individuals to make informed decisions about saving, investing, and spending. It is essential for achieving financial stability and independence.",
      image1: "/path/to/image1.jpg",
      sub2: "Building Wealth Wisely",
      paragraph2:
        "Learning about budgeting, credit, and investment strategies can help individuals grow wealth over time. Financial education is a critical skill in today's economy.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "Exploring the Cosmos",
      sub1: "The Wonders of Space",
      paragraph1:
        "Space exploration unveils the mysteries of the universe, from distant galaxies to black holes. It inspires curiosity and drives technological advancements that benefit humanity.",
      image1: "/path/to/image1.jpg",
      sub2: "Why It Matters",
      paragraph2:
        "Studying the cosmos helps us understand Earth's place in the universe and addresses critical questions about life beyond our planet.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Role of Technology in Education",
      sub1: "Transforming Learning Environments",
      paragraph1:
        "Technology has revolutionized education by providing access to online resources and interactive tools. It enhances student engagement and supports personalized learning.",
      image1: "/path/to/image1.jpg",
      sub2: "Bridging the Gap",
      paragraph2:
        "Digital platforms make education more inclusive, reaching students in remote areas. They empower educators to adapt teaching methods for diverse needs.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The History of Human Innovation",
      sub1: "Milestones in Human Progress",
      paragraph1:
        "From the invention of the wheel to the rise of artificial intelligence, human innovation has driven societal advancement. Each breakthrough shapes the way we live and interact.",
      image1: "/path/to/image1.jpg",
      sub2: "The Future of Invention",
      paragraph2:
        "As technology evolves, the potential for groundbreaking discoveries grows. Collaboration and creativity remain key to solving future challenges.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Value of Lifelong Learning",
      sub1: "Embracing Continuous Growth",
      paragraph1:
        "Lifelong learning fosters intellectual curiosity and keeps individuals adaptable in a changing world. It enriches personal and professional development, promoting a fulfilling life.",
      image1: "/path/to/image1.jpg",
      sub2: "Opportunities for Everyone",
      paragraph2:
        "With access to online courses and community programs, learning is more accessible than ever. Staying informed empowers individuals to reach their goals.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Art of Time Management",
      sub1: "Prioritizing Your Day",
      paragraph1:
        "Effective time management involves setting goals, organizing tasks, and avoiding procrastination. It leads to increased productivity and reduced stress.",
      image1: "/path/to/image1.jpg",
      sub2: "Tools for Success",
      paragraph2:
        "Utilizing planners, apps, and techniques like the Pomodoro method can help individuals maximize their efficiency and balance work with leisure.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Importance of Community Support",
      sub1: "Building Strong Networks",
      paragraph1:
        "Communities provide emotional and practical support, fostering a sense of belonging. Strong networks are vital during challenging times.",
      image1: "/path/to/image1.jpg",
      sub2: "Making a Difference",
      paragraph2:
        "Volunteering and active participation strengthen community ties. Together, individuals can address local issues and create a positive impact.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Evolution of Social Media",
      sub1: "Connecting the World",
      paragraph1:
        "Social media platforms have transformed how we communicate and share information. They bridge gaps and enable global connections.",
      image1: "/path/to/image1.jpg",
      sub2: "Navigating the Challenges",
      paragraph2:
        "While social media offers many benefits, it also presents challenges like misinformation and privacy concerns. Responsible use is crucial.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Science of Happiness",
      sub1: "Understanding Well-Being",
      paragraph1:
        "Happiness is influenced by genetics, environment, and personal choices. Practices like gratitude and mindfulness contribute to lasting well-being.",
      image1: "/path/to/image1.jpg",
      sub2: "Pursuing Fulfillment",
      paragraph2:
        "True happiness often stems from meaningful relationships, purposeful activities, and a positive outlook on life.",
      image2: "/path/to/image2.jpg",
    },
    {
      title: "The Future of Artificial Intelligence",
      sub1: "AI in Everyday Life",
      paragraph1:
        "Artificial intelligence is shaping industries, from healthcare to transportation. It automates tasks and improves decision-making processes.",
      image1: "/path/to/image1.jpg",
      sub2: "Ethical Considerations",
      paragraph2:
        "As AI evolves, addressing ethical concerns like bias, privacy, and job displacement is critical to ensuring its benefits for society.",
      image2: "/path/to/image2.jpg",
    },
  ];
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
  const selectedBlog = blogDataInner.find((blog) => blog.title === title);

  return (
    <>
      <Navbar isLogIn={false} setLogin={() => {}} login={() => {}} />

      <div className="blog-content relative text-black overflow-hidden bg-gradient-to-r from-white to-pink-100">
        <section className="container mx-auto pt-20 pb-20 px-6 z-50 flex justify-between  w-[90%]">
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

<div className="sideBarBlog">
          <h1 style={{fontSize:"1.5rem"}}>Recent Post</h1>
          <div class="bg-white shadow-md  overflow-hidden ">
            <img src={dua1} alt="Image" class="w-full h-48 object-cover px-2 " />

            <div class="p-4">
            
              <p class="text-sm text-gray-500">1 Jan 2025</p>
              <div style={{display:"flex"}}>
              <h2 class="text-lg font-semibold mb-2 text-pink-500 w-[25rem]">
                Is Celebrating Shab-E-Barat Bid'ah?
              </h2>
              <img style={{height :"1rem",width : "1rem" }} src={dua3} alt="" />

              </div>
              <p class="text-gray-700 " style={{fontFamily : `"Raleway", serif`}}>
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
          <div class="bg-white shadow-md  overflow-hidden ">
            <img src={dua2} alt="Image" class="w-full h-48 object-cover px-2 " />

            <div class="p-4">
              <p class="text-sm text-gray-500">1 Jan 2025</p>
              <div style={{display:"flex"}}>
              <h2 class="text-lg font-semibold mb-2 text-pink-500 w-[25rem]">
                Is Celebrating Shab-E-Barat Bid'ah?
              </h2>
              <img style={{height :"1rem",width : "1rem" }} src={dua3} alt="" />

              </div>
              <p class="text-gray-700 " style={{fontFamily : `"Raleway", serif`}}>
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
            <div class="gaidance-container w-[70%]">
              <h1
                className="text-pink-500"
                style={{ fontFamily: '"Inknut Antiqua", serif' }}
              >
                {selectedBlog.title}
              </h1>
              <div class="text-gaidance flex flex-col items-start">
                <img
                  className="w-[100%] h-[500px]  py-3 "
                  src={dua}
                  alt=""
                />

                <div class="text_bottom w-[80%]">
                  <h3 className="text-[20px] font-semibold mb-2 text-pink-500">
                    {selectedBlog.sub1}
                  </h3>
                  <p className="text-gray-700 text-[16px]" style={{fontFamily : `"Raleway", serif`}}>
                    {selectedBlog.paragraph1}
                  </p>
                </div>
              </div>

              <div class="text-gaidance flex flex-col items-start">
                <img
                  className="w-[100%] h-[500px] px-3 py-3 "
                  src={dua4}
                  alt=""
                />

                <div class="text_bottom w-[100%]">
                  <h3 className="text-[20px] font-semibold mb-2 text-pink-500">
                    {selectedBlog.sub1}
                  </h3>
                  <p className="text-gray-700 text-[16px]" style={{fontFamily : `"Raleway", serif`}}>
                    {selectedBlog.paragraph1}
                  </p>
                </div>
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
    </>
  );
};

export default BlogPage;
