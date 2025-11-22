
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from './Navbar';

const HelpPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I use the Virtual Try-On feature?",
      answer:
        "Simply browse the clothing items, select one, and click the 'Try On' button. Your camera will activate, and the selected item will overlay on your image in real time. Make sure you are in frame of camera view , if trying top wear make sure your upper body is clearly in frame and if trying bottom wear make sure your lower body is in frame clearly.",
    },
    {
      question: "What devices are supported?",
      answer:
        "The Virtual Try-On feature works on both desktop and mobile devices with a camera enabled.",
    },
    {
      question: "Can I try 2 clothes at once?",
      answer:
        "Currently, we do not support it , you need to switch between different clothes.",
    },

    {
      question: "Why is the clothing overlay not aligning properly?",
      answer:
        "Ensure you have good lighting and position yourself in the camera frame properly. Stand upright and face the camera for the best results.",
    },
    {
      question: "Can I save my try-on images?",
      answer:
        "Currently, we do not support direct saving, but you can take a screenshot of your try-on preview.",
    },
    {
      question: "What types of clothing can I try on?",
      answer:
        "You can try on tops, dresses, pants, and other selected apparel items that are available in our virtual closet.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
            <Navbar/>

      {/* Help Section */}
      <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
      <div style={styles.helpContainer}>
        <h1 style={styles.heading}>Help & Support</h1>
        <p style={styles.description}>
          Welcome to VCloset! Here’s how you can use our Virtual Try-On feature and get help with common questions.
        </p>

        <h2 style={styles.subHeading}>Frequently Asked Questions</h2>
        <div style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqItem}>
              <div style={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                {faq.question}
              </div>
              {openFAQ === index && <div style={styles.faqAnswer}>{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#e0dacb ",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #D3D3D3",
  },
  brand: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "40px",
    fontSize: "18px",
    fontWeight: "600",
    textDecoration: "none",
    color: "black",
  },
  brand: {
    fontSize: "28px",
    fontWeight: "bold",
    fontFamily: "serif",
    color: "#8B8000",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchInput: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "200px",
  },
  icon: {
    fontSize: "28px",
    textDecoration: "none",
    color: "#fff",
  },
  helpContainer: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",

    
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    color:"black",

  },
  description: {
    fontSize: "18px",
    textAlign: "center",
    marginBottom: "30px",
    color:"black",
    
  },
  subHeading: {
    fontSize: "24px",
    marginBottom: "20px",
    color:"purple",

  },
  faqContainer: {
    borderTop: "2px solid #ddd",
    paddingTop: "10px",
    color:"#",
  },
  faqItem: {
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
  },
  faqQuestion: {
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "blue",
  },
  faqAnswer: {
    marginTop: "5px",
    fontSize: "20px",
    color: "black",
    fontWeight:"bold"
  },
};

export default HelpPage;
