import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { BsArrowRight } from "react-icons/bs";

const HomeBottomCTA: React.FC = () => {
  return (
    <section className="py-24 bg-primaryBrown to-white text-center relative overflow-hidden">
      <Container>
        <div className=" mx-auto px-6 py-12 rounded-3xl shadow-2xl bg-white/90 border border-primaryBrown/10 relative z-10">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-primaryBrown drop-shadow-lg">
            Ready to discover more?
          </h3>
          <p className="text-lg md:text-xl text-primaryBrown/80 mb-8">
            Explore our full collection of unique, handpicked products and find
            something that resonates with you.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primaryRed text-white px-10 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-primaryRed/90 focus:bg-primaryRed/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primaryRed"
            tabIndex={0}
            aria-label="Browse all products"
          >
            Browse All Products
            <BsArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default HomeBottomCTA;
