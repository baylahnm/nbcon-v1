import { TestimonialsColumn } from "./testimonials-columns-1";
import { motion } from "motion/react";
import { useTranslation } from 'react-i18next';

const testimonialImages = [
  "https://images.unsplash.com/photo-1736939763234-f176517e95ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
  "https://images.unsplash.com/photo-1625987306773-8b9e554b25e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
  "https://images.unsplash.com/photo-1615813967261-6cdcfc4c7edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
];

const Testimonials = () => {
  const { t } = useTranslation('homepage');
  
  // Get testimonials from i18n and add images
  const testimonials = (t('testimonials.items', { returnObjects: true }) as Array<{ text: string; name: string; role: string }>).map((item, index) => ({
    ...item,
    image: testimonialImages[index],
  }));

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);
  
  return (
    <section className="bg-background py-16 px-6 md:py-[100px] md:px-0 bg-muted/30 relative">
      <div className="container z-10 mx-auto px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">{t('testimonials.badge')}</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center">
            {t('testimonials.title')}
          </h2>
          <p className="text-center mt-5 opacity-75">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
