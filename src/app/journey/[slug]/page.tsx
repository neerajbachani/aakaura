import { notFound } from "next/navigation";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { getAllChakraSlugs } from "@/data/chakras";
import { prisma } from "@/lib/prisma";
import { ChakraData } from "@/data/chakras"; // Keep interface for props
import { generateSEO } from "@/lib/seo";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = getAllChakraSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug },
  });

  if (!journey) {
    return generateSEO({
      title: "Journey Not Found | Aakaura",
      description: "The requested chakra journey could not be found.",
      pathname: `/journey/${slug}`,
      noIndex: true,
    });
  }

  return generateSEO({
    title: `${journey.name} Journey | Chakra Alignment | Aakaura`,
    description: journey.description,
    pathname: `/journey/${slug}`,
  });
}

import RelatedCombos from "@/components/combos/RelatedCombos";

export default async function ChakraJourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = await prisma.journey.findUnique({
    where: { slug },
  });

  if (!journey) {
    notFound();
  }

  return (
    <ChakraJourneyTemplate
      chakra={journey as unknown as ChakraData}
      relatedCombos={<RelatedCombos chakraSlug={slug} />}
    />
  );
}
