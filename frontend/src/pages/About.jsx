// import React from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import "./About.css";

// export default function About() {
//   const technologies = [
//     "React.js",
//     "React Router",
//     "Axios",
//     "JSON Server",
//     "LocalStorage",
//     "Tailwind CSS",
//     "Custom CSS",
//     "Toast notifications",
//   ];

//   const contributors = ["Vinay", "Manoj", "Nasarvali", "Prem Sai", "Bhaswanth"];

//   return (
//     <div className="about-page">
//       <Navbar />

//       <main className="about-main">
//         <header className="about-hero">
//           <span className="about-eyebrow">ABOUT THE PROJECT</span>
//           <h1>
//             A home for your
//             <span> next favorite</span> movie
//           </h1>
//           <p>
//             StreamSavvy is a movie catalog and watchlist management application
//             developed as part of the Full Stack Web Development course at{" "}
//             <span className="about-university">SRM University</span>. The
//             project demonstrates full-stack development using modern web
//             technologies.
//           </p>
//         </header>

//         <div className="about-content-grid">
//           <section className="about-card">
//             <div className="about-card-heading">
//               <span className="about-card-icon" aria-hidden="true">01</span>
//               <div>
//                 <span className="about-card-kicker">BUILT WITH</span>
//                 <h2>Technologies used</h2>
//               </div>
//             </div>
//             <p className="about-card-description">
//               The tools behind the StreamSavvy experience.
//             </p>
//             <ul className="about-tech-list">
//               {technologies.map((technology) => (
//                 <li key={technology}>{technology}</li>
//               ))}
//             </ul>
//           </section>

//           <section className="about-card">
//             <div className="about-card-heading">
//               <span className="about-card-icon" aria-hidden="true">02</span>
//               <div>
//                 <span className="about-card-kicker">THE PEOPLE</span>
//                 <h2>Project contributors</h2>
//               </div>
//             </div>
//             <p className="about-card-description">
//               Created together as part of a learning project.
//             </p>
//             <ul className="about-contributor-list">
//               {contributors.map((contributor) => (
//                 <li key={contributor}>
//                   <span className="about-contributor-avatar" aria-hidden="true">
//                     {contributor.charAt(0)}
//                   </span>
//                   <span>{contributor}</span>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
