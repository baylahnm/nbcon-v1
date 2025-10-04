"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "This platform revolutionized our engineering operations, streamlining project management and client communication. The AI matching keeps us productive and efficient.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Mohammed",
    role: "Project Manager",
  },
  {
    text: "Implementing nbcon was smooth and quick. The SCE verification and milestone payments made team collaboration effortless and secure.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Ahmed Al-Rashid",
    role: "Electrical Engineer",
  },
  {
    text: "The support team is exceptional, guiding us through compliance requirements and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Fatima Al-Zahra",
    role: "Structural Engineer",
  },
  {
    text: "This platform's seamless integration enhanced our engineering operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Khalid Al-Mansouri",
    role: "CEO, Engineering Firm",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient in project delivery.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    name: "Mariam Hassan",
    role: "HVAC Engineer",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined our engineering processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Omar Al-Sheikh",
    role: "Civil Engineer",
  },
  {
    text: "Our engineering functions improved with a user-friendly design and positive client feedback. The bilingual support is excellent.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Nasser Al-Dosari",
    role: "Mechanical Engineer",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our engineering needs and enhancing our operations significantly.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Layla Al-Mutairi",
    role: "Project Director",
  },
  {
    text: "Using nbcon, our project management and client satisfaction significantly improved, boosting our engineering business performance.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    name: "Yousef Al-Ghamdi",
    role: "Engineering Consultant",
  },
];

export { testimonials };
