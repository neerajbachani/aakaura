import SplashScreen from "@/components/SplashScreen";
import env from "@/config/env";
import { ApiResponse } from "@/types/Api";
import { Product } from "@/types/Product";
import { Blog } from "@/types/Blog";
import BannerImage from "@/components/BannerImage";
import OurPath from "@/components/OurPath";
import Blogs from "@/components/Blogs";
import HomeBottomCTA from "@/components/HomeBottomCTA";
import ProductsSwiper from "@/components/ProductsSwiper";
import Container from "@/components/ui/Container";

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
      <SplashScreen />
      {/* Hero Banner */}
      <BannerImage
        heading={
          <>
            Discover Unique Products
            <br />
            for Your Spiritual Journey
          </>
        }
        subheading="Handpicked, meaningful, and crafted with care. Elevate your space and spirit."
        src="/images/banner.jpg"
        height="large"
      />

      {/* Featured Products Section */}
      <Container>
        <ProductsSwiper products={featuredProducts} title="Featured Products" />
      </Container>
      {/* Featured Blogs Section */}
      {featuredBlogs && <Blogs title="Our Thoughts" blogs={featuredBlogs} />}

      {/* About/Our Story Section */}
      <OurPath />

      {/* Secondary CTA Section */}
      <HomeBottomCTA />
    </>
  );
}
