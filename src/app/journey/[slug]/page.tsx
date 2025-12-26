import { notFound } from "next/navigation";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { getAllChakraSlugs } from "@/data/chakras";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ChakraData } from "@/data/chakras"; // Keep interface for props

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllChakraSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug }
  });
  
  if (!journey) {
    return {
      title: "Journey Not Found | Aamvaraah",
    };
  }

  return {
    title: `${journey.name} Journey | Aamvaraah`,
    description: journey.description,
  };
}

export default async function ChakraJourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug }
  });

  if (!journey) {
    notFound();
  }

  return <ChakraJourneyTemplate chakra={journey as unknown as ChakraData} />;
}
