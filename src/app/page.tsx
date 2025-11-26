import SplashScreen from "@/components/SplashScreen";
import env from "@/config/env";
import { ApiResponse } from "@/types/Api";
import { Product } from "@/types/Product";
import { Blog } from "@/types/Blog";
import HomeHeroSection from "@/components/HomeHeroSection";
import OurPath from "@/components/OurPath";
import Blogs from "@/components/Blogs";
import HomeBottomCTA from "@/components/HomeBottomCTA";
import ProductsSwiper from "@/components/ProductsSwiper";
import Container from "@/components/ui/Container";
import AboutHeader from "@/components/AboutHeader";
import BlogSection from "@/components/BlogSection";
import AnimatedText from "@/components/AnimatedText";

export const dynamic = "force-dynamic";

const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/products/featured`, {
      cache: "no-store",
    });
    const result: ApiResponse<Product[]> = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

const getFeaturedBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/blogs/featured`, {
      cache: "no-store",
    });
    const result: ApiResponse<Blog[]> = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
};

export default async function Home() {
  const [featuredProducts, featuredBlogs] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedBlogs(),
  ]);
  return (
    <>
      {/* <SplashScreen /> */}
      {/* Hero Section with Navbar, Galaxy, and Chakras */}
      <HomeHeroSection />

      {/* Featured Products Section */}
      {/* <Container>
        <ProductsSwiper products={featuredProducts} title="Featured Products" />
      </Container> */}
      {/* Featured Blogs Section */}
     

      <AboutHeader/>
      <BlogSection/>
      <AnimatedText/>
      {/* {featuredBlogs && <Blogs title="Our Thoughts" blogs={featuredBlogs} />} */}

      {/* About/Our Story Section */}
      {/* <OurPath /> */}

      {/* Secondary CTA Section */}
      {/* <HomeBottomCTA /> */}
    </>
  );
}
